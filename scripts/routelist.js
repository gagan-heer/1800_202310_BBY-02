//this returns an url for a specific route
function urlEvent(lat, long) {
    return "https://api.open511.gov.bc.ca/events?geography=POINT(" + lat + "%20" + long + ")&tolerance=5000";
}

// This function makes an AJAX GET request to the provided URL and calls the callback function with the response
function ajaxGET(url, callback) {

    const xhr = new XMLHttpRequest();

    let value = null;

    xhr.onload = function () {
        value = this.responseText;
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            value = this.responseText;
            callback(this.responseText);

        } else {
            console.log(this.status);
        }
    }
    xhr.open("GET", url);
    xhr.send();
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
  


//this goes through the specific route and then compares the time updated and current time
//then logs the description that is below the specific time.
//this also counts how many notifications there are then uses the count to assign a number
//to the content-#, allowing a systematic assignment of links.
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
      if(difference_h <= 24){    //This is looking for all favorite route's events less than 24 hours ago.
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
      if(difference_h <= 24){ //this is looking for all favourite route's events less than 500h ago.
        //because of cutting words off some text may look the same even though they are entirely different events
        //discuss what to do, wether to keep short text or give long text. or find more patterns with their desc.
        if(temp.indexOf("Starting") > -1){
          sentence = sentence.concat("<li><a class=\"dropdown-item\" href=\"#\" id=\"content-", count, "\">", temp.substring(0, temp.indexOf("Starting")),"<div id=\"timestamp\">",hour_difference," Hours ago</div></a></li>");
        } else {
          sentence = sentence.concat("<li><a class=\"dropdown-item\" href=\"#\" id=\"content-", count, "\">", temp.substring(0, temp.indexOf("Until")), "<div id=\"timestamp\">",hour_difference," Hours ago</div></a></li>");
        }
        findRouteLink(lat,long, count);
        count++;
      }
    }
    document.getElementById("dropdown-notifications").innerHTML += sentence;

    document.getElementById("notification-count").innerHTML = count;
  });
}

//this checks if a route has an event, returns true if it does
function hasEvent(lat, long, callback) {
    ajaxGET(urlEvent(lat, long), function (data) {
        parsedData = JSON.parse(data);
  
        let desc = "";
        for(let i = 0; i < parsedData.events.length; i++) {
            desc += parsedData.events[i].description + "\n" + "\n";
        }
  
        if(desc === "") {
            callback(false);
        } else {
          callback(true);
        }
    }); 
};
  
  //each routecard template has a 
function checkEvent(lat, long, classNumber) {
    
    hasEvent(lat, long, function(hasEventResult) {
        let icon = document.getElementById("logo");
        let newIcon = icon.content.cloneNode(true);

        if(hasEventResult == true){
            document.getElementsByClassName("routeNumber")[classNumber].append(newIcon);
        }
    });
}

//------------------------------------------------------------------------------
// Displays routes from the "routes" collection from Firestore dynamically
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
  let cardTemplate = document.getElementById("routeCardTemplate");

  db.collection(collection)
    .get()
    .then((allRoutes) => {
      let cardsWithEvents = [];
      let cardsWithoutEvents = [];
      let i = 0; // Optional: if you want to have a unique ID for each hike

      allRoutes.forEach((doc) => {
        var title = doc.data().name; // get value of the "name" key
        var details = doc.data().details; // get value of the "details" key
        var img = doc.data().img; //get img
        var docID = doc.id;
        let newcard = cardTemplate.content.cloneNode(true);
        lat = doc.data().lat;
        long = doc.data().long;

        //update title and text and image
        newcard.querySelector(".card-title").innerHTML = title;
        newcard.querySelector(".card-text").innerHTML = details;
        newcard.querySelector(".card-image").src = img;
        newcard.querySelector("a").href = "eachRoute.html?docID=" + docID;

        let icon = document.getElementById("logo");
        let newIcon = icon.content.cloneNode(true);

        hasEvent(lat, long, (hasEventResult) => {
          
          if (hasEventResult) {            
            newcard.querySelector(".routeNumber").append(newIcon) 
            cardsWithEvents.push(newcard);                                    
          } else {
            cardsWithoutEvents.push(newcard);
          }

          if (cardsWithEvents.length + cardsWithoutEvents.length === allRoutes.size) {
            cardsWithEvents.forEach((card) => {
              document.getElementById(collection + "-go-here").appendChild(card);
            });

            cardsWithoutEvents.forEach((card) => {
              document.getElementById(collection + "-go-here").appendChild(card);
            });
          }
        });

        i++; // Optional: iterate variable to serve as unique ID
      });
    });
}
displayCardsDynamically("routes");  //input param is the name of the collection

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    const userId = user.uid;
    displayFavsDynamically("favourites", userId);
  } else {
    console.log("User is not logged in.");
  } 
});

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
