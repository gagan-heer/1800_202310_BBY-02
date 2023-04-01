var currentUser;          //put this right after you start script tag before writing any functions.


function populateUserInfo() {    
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            
            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            console.log(user.uid)
            //get the document for current user.
            currentUser.get()
            .then(userDoc => {
                //get the data fields of the user
                var userName = userDoc.data().name;
                var userFavoriteRoutes = userDoc.data().favoriteroutes;
                var userTransPortation = userDoc.data().transportation;
    
                //if the data fields are not empty, then write them in to the form.
                if (userName != null) {
                    document.getElementById("nameInput").value = userName;
                }
                if (userFavoriteRoutes != null) {
                    document.getElementById("favoriteroutesInput").value = userFavoriteRoutes;
                }
                if (userTransPortation != null) {
                    document.getElementById("transportationInput").value = userTransPortation;
                }
                })
        } else {
            // No user is signed in.
            console.log ("No user is signed in");
        }
    });
}

populateUserInfo()

//call the function to run it 

function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
 }
 function saveUserInfo() {
    //enter code here

    //a) get user entered values
    userName = document.getElementById('nameInput').value;       //get the value of the field with id="nameInput"
    userFavoriteRoutes = document.getElementById('favoriteroutesInput').value;     //get the value of the field with id="favoriteroutesInput"
    userTransPortation = document.getElementById('transportationInput').value;       //get the value of the field with id="transportationInput"
    //b) update user's document in Firestore
    currentUser.update({
        name: userName,
        favoriteroutes: userFavoriteRoutes,
        transportation: userTransPortation
    })
    .then(() => {
        console.log("Document successfully updated!");
    })
    //c) disable edit 
    document.getElementById('personalInfoFields').disabled = true;
}

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
