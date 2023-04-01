// MAPBOX DISPLAY
function showEventsOnMap() {
    // Defines basic mapbox data
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWRhbWNoZW4zIiwiYSI6ImNsMGZyNWRtZzB2angzanBjcHVkNTQ2YncifQ.fTdfEXaQ70WoIFLZ2QaRmQ';
    const map = new mapboxgl.Map({
        container: 'map', // Container ID
        style: 'mapbox://styles/mapbox/streets-v11', // Styling URL
        center: [-122.964274, 49.236082], // Starting position
        zoom: 8 // Starting zoom
    });

    // Add user controls to map
    map.addControl(new mapboxgl.NavigationControl());

    // Adds map features
    map.on('load', () => {
        const features = []; // Defines an empty array for information to be added to

        // Defines map pin icon
        map.loadImage(
            'https://cdn.iconscout.com/icon/free/png-256/pin-locate-marker-location-navigation-16-28668.png',
            (error, image) => {
                if (error) throw error;

                // Add the image to the map style.
                map.addImage('eventpin', image); // Pin Icon

                // READING information from "events" collection in Firestore
                db.collection("routes").get().then(allEvents => {
                    allEvents.forEach(doc => {
                        // get hike Coordinates
                        lat = doc.data().lat; 
                        long = doc.data().long;
                        console.log(lat,long);
                        coordinates = [long, lat];
                        console.log(coordinates);
                        //read name and the details of hike
                        event_name = doc.data().name; // Event Name
                        preview = doc.data().details; // Text Preview
         

                        // Pushes information into the features array
                        features.push({
                            'type': 'Feature',
                            'properties': {
                                'description': `<strong>${event_name}</strong><p>${preview}</p> <br> 
                                <a href="/eachRoute.html?docID=${doc.id}" target="_blank" title="Opens in a new window">Read more</a>`
                            },
                            'geometry': {
                                'type': 'Point',
                                'coordinates': coordinates
                            }
                        });
                    })

                    // Adds features as a source to the map
                    map.addSource('places', {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': features
                        }
                    });

                    // Creates a layer above the map displaying the pins
                    map.addLayer({
                        'id': 'places',
                        'type': 'symbol',
                        'source': 'places',
                        'layout': {
                            'icon-image': 'eventpin', // Pin Icon
                            'icon-size': 0.1, // Pin Size
                            'icon-allow-overlap': true // Allows icons to overlap
                        }
                    });

                    // Map On Click function that creates a popup, displaying previously defined information from "events" collection in Firestore
                    map.on('click', 'places', (e) => {
                        // Copy coordinates array.
                        const coordinates = e.features[0].geometry.coordinates.slice();
                        const description = e.features[0].properties.description;

                        // Ensure that if the map is zoomed out such that multiple copies of the feature are visible, the popup appears over the copy being pointed to.
                        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                        }

                        new mapboxgl.Popup()
                            .setLngLat(coordinates)
                            .setHTML(description)
                            .addTo(map);
                    });

                    // Change the cursor to a pointer when the mouse is over the places layer.
                    map.on('mouseenter', 'places', () => {
                        map.getCanvas().style.cursor = 'pointer';
                    });

                    // Defaults cursor when not hovering over the places layer
                    map.on('mouseleave', 'places', () => {
                        map.getCanvas().style.cursor = '';
                    });
                })

            });
    })
}

showEventsOnMap()


//BELOW FUNCTIONS NEED FOR NOTIFICATIONS
function urlEvent(lat, long) {
    return "https://api.open511.gov.bc.ca/events?geography=POINT(" + lat + "%20" + long + ")&tolerance=5000";
}

function ajaxGET(url, callback) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            callback(this.responseText);
        } else {
            console.log(this.status);
        }
    }
    xhr.open("GET", url);
    xhr.send();
}


//  notification display
function displayFavsDynamically(collection, userId) {  

    db.collection("users").doc(userId).collection(collection).get() // get the favorites collection of the current user
        .then(favourites => {
        favourites.forEach(doc => {
            title = doc.data().name;
            lat = doc.data().lat;
            long = doc.data().long;
            //this goes through the favourite routes and logs the events that happen
            //within specified time.
            updatedHours(lat, long, title);
        })
        })
        .catch(error => console.log(error));
    }
      
    
//this function goes through the route collections and then compares the lat and long of
//parameter to the routes. if its the same then the route link is assigned to the specific
//anchored tag.
function findRouteLink(lat, long, numOfNotification, userId) {  
let params = new URL( window.location.href ); //get URL of search bar
let ID = params.searchParams.get( "docID" ); //get value for key "id"

db.collection("routes").get()
.then(allRoutes=> {
    let routeLink = "";
    allRoutes.forEach(doc => { //iterate thru each doc
        var docID = doc.id;
        let docLat = doc.data().lat;
        let docLong = doc.data().long;

        if(docLat == lat && docLong == long){
            routeLink = "eachRoute.html?docID=" + docID;
            document.getElementById("content-" + numOfNotification).href = routeLink;
        }
    })
})
}

firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const userId = user.uid;
      displayFavsDynamically("favourites", userId);
    } else {
      console.log("User is not logged in.");
    } 
  });

  
let count = 0;
//the lat/long is from the favourite collections so that only favourite routes are parsed through
function updatedHours(lat, long, title){
  ajaxGET(urlEvent(lat, long), function (data) {
    parsedData = JSON.parse(data);
    let currentTime = new Date();
    var sentence = "";

    parsedData.events.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.updated) - new Date(a.updated);
    });

    if(parsedData.events.length != 0){
      let difference_s = (new Date(parsedData.events[0].updated).getTime() - currentTime.getTime()) / -1000;
      let difference_m = difference_s / 60;
      let difference_h = difference_m / 60;
      if(difference_h <= 250){
        sentence += "<div id=\"notification-title\">" + title + "</div>";
      }
    }



    for(let i = 0; i < parsedData.events.length; i++){
      let difference_s = (new Date(parsedData.events[i].updated).getTime() - currentTime.getTime()) / -1000;
      let difference_m = difference_s / 60;
      let difference_h = difference_m / 60;
      let temp = parsedData.events[i].description;
      let hour_difference = parseInt(difference_h);
    
      //if you change the hour difference make sure to change the one above too
      if(difference_h <= 250 ){ //this is looking for all favourite route's events less than 500h ago.
        //because of cutting words off some text may look the same even though they are entirely different events
        //discuss what to do, wether to keep short text or give long text. or find more patterns with their desc.
        if(temp.indexOf("Starting") > -1){
          sentence = sentence.concat("<li><a class=\"dropdown-item\" href=\"#\" id=\"content-", count, "\">", temp.substring(0, temp.indexOf("Starting")), hour_difference," Hours ago</a></li>");
        } else {
          sentence = sentence.concat("<li><a class=\"dropdown-item\" href=\"#\" id=\"content-", count, "\">", temp.substring(0, temp.indexOf("Until")),"</a></li>");
        }
        findRouteLink(lat,long, count);
        count++;
      }
    }
    document.getElementById("dropdown-notifications").innerHTML += sentence;

    document.getElementById("notification-count").innerHTML = count;
  });
}
