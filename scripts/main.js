
// Inserts the user's name on the home page if there is a user logged in
function insertName() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            console.log(user.uid); //print the uid in the browser console
            console.log(user.displayName);  //print the user name in the browser console
            user_Name = user.displayName;
            //insert using jquery
            $("#name-goes-here").text(user_Name); 

        } else {
            // No user is signed in.
        }
    });
}
insertName(); //run the function

//get request for api
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

//this parses through the event and gets the description
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
// Displays routes from the "routes" collection in Firestore dynamically
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("routeCardTemplate");
  
    db.collection(collection)
      .get()
      .then((querySnapshot) => {
        let docsArray = [];
 // Iterate through each document in the collection and add it to the docsArray
        querySnapshot.forEach((doc) => {
          docsArray.push(doc);
        });
 // Get a specified number of random documents from the docsArray       
        let randomDocs = getRandomDocs(4, docsArray);
  
        let i = 0;
        randomDocs.forEach((doc) => {
          var title = doc.data().name;
          var details = doc.data().details;
          var img = doc.data().img;
          var docID = doc.id;
          let newcard = cardTemplate.content.cloneNode(true);
          lat = doc.data().lat;
          long = doc.data().long;
  // Set the card's content using the document's data 
          newcard.querySelector('.card-title').innerHTML = title;
          newcard.querySelector('.card-text').innerHTML = details;
          newcard.querySelector('.card-image').src = img;
          newcard.querySelector('a').href = "eachRoute.html?docID=" + docID;
  // Append the card to the specified container on the page
          document.getElementById(collection + "-go-here").appendChild(newcard);
          // checkEvent(lat, long, i);
  
          i++;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  displayCardsDynamically("routes");
  