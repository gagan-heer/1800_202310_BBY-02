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

function urlEvent(lat, long) {
  return "https://api.open511.gov.bc.ca/events?geography=POINT(" + lat + "%20" + long + ")&tolerance=5000";
}

// Adds and removes a route from the user's Favourites collection
function addToFavourites(routeId) {
  const userId = firebase.auth().currentUser.uid; // Get the ID of the currently logged in user

  let params = new URL(window.location.href); //Get the url from the search bar
  let ID = params.searchParams.get("docID");

  const routeRef = firebase.firestore().collection("routes").doc(routeId); // Get route info
  const favouritesRef = firebase.firestore().collection("users").doc(userId).collection("favourites").doc(ID); // Create a reference to the user's favourites list
  favouritesRef.get().then((doc) => {
    if (doc.exists) {
      // The route is already in the user's favorites, so remove it.
      const removeConfirm = confirm('This route is already in your favourites. Do you want to remove it?');
      if (removeConfirm) {
        favouritesRef.delete();
        // changes the icon of the route that was removed from favourites to "unfilled"
        document.getElementById('star_border').innerText = 'star_border';
        alert('The route has been removed from your favourites.');
      }
    } else {
      // The route is not yet in the user's Favourites so it is added
      const addConfirm = confirm('Do you want to add this route to your favourites?');
      if (addConfirm) {
        const routeRef = firebase.firestore().collection("routes").doc(ID);
        routeRef.get().then((doc) => {
          favouritesRef.set({
            name: doc.data().name,
            city: doc.data().city,
            code: doc.data().code,
            province: doc.data().province,
            details: doc.data().details,
            img: doc.data().img,
            desc: doc.data().desc,
            long: doc.data().long,
            lat: doc.data().lat
          });
        });
        
        //changes the icon of the route that was favourited to "filled"
        document.getElementById('star_border').innerText = 'star';
        alert('The route has been added to your favourites.');
      }
    }
  });
}

//this goes through the specific route and then compares the time updated and current time
//then logs the description that is below the specific time.
//
//this also counts how many notifications there are then uses the count to assign a number
//to the content-#, allowing a systematic assignment of links.
let count = 0;
//the lat/long is from the favourite collections so that only favourite routes are parsed through
function updatedHours(lat, long){
  ajaxGET(urlEvent(lat, long), function (data) {
    parsedData = JSON.parse(data);
    let currentTime = new Date();
    var sentence = "";

    for(let i = 0; i < parsedData.events.length; i++){
      let difference_s = (new Date(parsedData.events[i].updated).getTime() - currentTime.getTime()) / -1000;
      let difference_m = difference_s / 60;
      let difference_h = difference_m / 60;
      let temp = parsedData.events[i].description;
    
      if(difference_h < 500){ //this is looking for all favourite route's events less than 500h ago.
        //because of cutting words off some text may look the same even though they are entirely different events
        //discuss what to do, wether to keep short text or give long text. or find more patterns with their desc.
        if(temp.indexOf("Starting") > -1){
          sentence = sentence.concat("<li><a class=\"dropdown-item\" href=\"#\" id=\"content-", count, "\">", temp.substring(0, temp.indexOf("Starting")),"</a></li>");
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

// Checks if user is logged in and gets user ID to pass to displayFavsDynamically
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    const userId = user.uid;
    displayFavsDynamically("favourites", userId);
  } else {
    console.log("User is not logged in.");
  } 
});

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


  // Dynamically display Favourite Routes on home page
function displayFavsDynamically(collection, userId) {
    let cardTemplate = document.getElementById("favouritesCardTemplate");
    console.log(userId);

    db.collection("users").doc(userId).collection(collection).get() // get the favorites collection of the current user
      .then(favourites => {
        let i = 0;
        favourites.forEach(doc => {
          var title = doc.data().name;
          var details = doc.data().details;
          var routeCode = doc.data().code;
          var img = doc.data().img;
          var docID = doc.id;
          lat = doc.data().lat;
          long = doc.data().long;
          let newcard = cardTemplate.content.cloneNode(true);
  
          //update title and text and image
          newcard.querySelector('.card-title').innerHTML = title;
          newcard.querySelector('.card-text').innerHTML = details;
          newcard.querySelector('.card-image').src = img;
          newcard.querySelector('a').href = "eachRoute.html?docID=" + docID;

          document.getElementById(collection + "-go-here").appendChild(newcard);
          checkEvent(lat, long, i);

          //this goes through the favourite routes and logs the events that happen
          //within specified time.
          updatedHours(lat, long);
          i++;
        })
      })
      .catch(error => console.log(error));
  }

displayFavsDynamically("favourites");  


// Listen for changes to the authentication state
firebase.auth().onAuthStateChanged(function(user) {
  // Call checkFavourites when the authentication state changes
  checkFavourites();
});

// Checks if a route is already in the user's favourites to display star icon as filled
function checkFavourites() {
  const user = firebase.auth().currentUser; // Get the currently logged in user

  if (user) { // Check if a user is logged in
    const userId = user.uid;

    let params = new URL(window.location.href); //get the url from the search bar
    let ID = params.searchParams.get("docID"); 

    const favouritesRef = firebase.firestore().collection("users").doc(userId).collection("favourites").doc(ID); // Create a reference to the user's favourites list
    favouritesRef.get().then((doc) => {
        if (doc.exists) {
            document.getElementById('star_border').innerText = 'star';
          } else {
            document.getElementById('star_border').innerText = 'star_border';
          }
    })
  } else {
    console.log("No user logged in");
  }
}



//compare machine time to updated time
//go through user's favourite route's and compare the updated time
//notify user if updated time and machine time is less than an hour?
