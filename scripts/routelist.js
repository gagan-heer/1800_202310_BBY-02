function urlEvent(lat, long) {
    return "https://api.open511.gov.bc.ca/events?geography=POINT(" + lat + "%20" + long + ")&tolerance=5000";
}

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

function insertName() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            console.log(user.displayName);  //print the user name in the browser console
            user_Name = user.displayName;
            //method #1:  insert with html only
            //document.getElementById("name-goes-here").innerText = user_Name;    //using javascript
            //method #2:  insert using jquery
            $("#name-goes-here").text(user_Name); //using jquery

        } else {
            // No user is signed in.
        }
    });
}
insertName(); //run the function


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
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("routeCardTemplate");

    db.collection(collection).get()   //the collection called "hikes"
        .then(allRoutes=> {
            let i = 0;  //Optional: if you want to have a unique ID for each hike
            allRoutes.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;       // get value of the "name" key
                var details = doc.data().details;  // get value of the "details" key
				var routeCode = doc.data().code;    //get unique ID to each route to be used for fetching right image
                var img = doc.data().img;           //get img
                var docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true);
                lat = doc.data().lat;
                long = doc.data().long

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-text').innerHTML = details;
                newcard.querySelector('.card-image').src = img;
                newcard.querySelector('a').href = "eachRoute.html?docID=" + docID;


                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);
                checkEvent(lat, long, i);

                updatedHours(lat, long);

                i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

displayCardsDynamically("routes");  //input param is the name of the collection


