
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

//a function that parse through a route's nearby event using coordinates parseRouteEvent(long, lat);
//a function that add a description to a route
// function urlEvent(lat, long) {
//     return "https://api.open511.gov.bc.ca/events?geography=POINT(" + lat + "%20" + long + ")&tolerance=15000";
// }



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

function parseRouteEvent(long, lat) {
    ajaxGET(urlEvent(long, lat), function (data) {
        parsedData = JSON.parse(data);
        let desc = "";
        for(let i = 0; i < parsedData.length; i++){
            desc += parsedData.events[i].description + "\n";
        }
        // document.getElementById("desc-text").innerHTML = desc; //must be desc for cards
    }); 
};

//a function that loops the function that writes description every certain time

//make sure to unhide danger logo when there is an event

//a function that notifies 

// random doc for template
function getRandomDocs(n, docsArray) {
    if (n >= docsArray.length) {
      return docsArray;
    }
    
    let shuffled = docsArray.slice(0);
    let randomDocs = [];
    
    for (let i = 0; i < n; i++) {
      let randomIndex = Math.floor(Math.random() * shuffled.length);
      randomDocs.push(shuffled[randomIndex]);
      shuffled.splice(randomIndex, 1);
    }
    
    return randomDocs;
  }
  
//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("routeCardTemplate");
  
    db.collection(collection)
      .get()
      .then((querySnapshot) => {
        let docsArray = [];
        
        querySnapshot.forEach((doc) => {
          docsArray.push(doc);
        });
        
        let randomDocs = getRandomDocs(4, docsArray);
  
        let i = 0;
        randomDocs.forEach((doc) => {
          var title = doc.data().name;
          var details = doc.data().details;
          var routeCode = doc.data().code;
          var img = doc.data().img;
          var docID = doc.id;
          let newcard = cardTemplate.content.cloneNode(true);
          lat = doc.data().lat;
          long = doc.data().long;
  
          newcard.querySelector('.card-title').innerHTML = title;
          newcard.querySelector('.card-text').innerHTML = details;
          newcard.querySelector('.card-image').src = img;
          newcard.querySelector('a').href = "eachRoute.html?docID=" + docID;
  
          document.getElementById(collection + "-go-here").appendChild(newcard);
          checkEvent(lat, long, i);
  
          i++;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  displayCardsDynamically("routes");
  