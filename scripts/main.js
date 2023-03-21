
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

//*******************************************************************************************/
//***************************** Route data **************************************************/
function writeRoutes() {
    //define a variable for the collection you want to create in Firestore to populate data
    var routesRef = db.collection("routes");

    routesRef.add({
        code: "KnightNorthendN", 
        name: "Knight Street Bridge Northend - N",  
        city: "Vancouver",
        province: "BC",
		details: "North end of Knight Street Bridge, looking north",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    routesRef.add({
        code: "KnightNorthendS",
        name: "Knight Street Bridge Northend - S", 
        city: "Vancouver",
        province: "BC",
        details: "North end of Knight STreet Bridge, looking south",
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("March 10, 2022"))
    });
    routesRef.add({
        code: "AlexFraserS",
        name: "Alex Fraser Bridge - Southbound", //replace with your own city?
        city: "Annacis Island",
        province: "BC",
        details:  "Alex Fraser Bridge, mid-span, looking south",
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2023"))
    });
    routesRef.add({
        code: "AlexFraserN",
        name: "Alex Fraser Bridge - Northbound", //replace with your own city?
        city: "Annacis Island",
        province: "BC",
        details:  "Alex Fraser Bridge, mid-span, looking north",
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2023"))
    });
    routesRef.add({ 
        code: "HW91ABoundaryW",
        name: "Hi91ghway A at Boundary Rd - W", //replace with your own city?
        city: "New Westminster/Queensborough",
        province: "BC",
        details:  "Highway 91A at Boundary Road, looking west",
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2023"))
    });
    routesRef.add({
        code: "HW91ABoundaryE",
        name: "Highway 91A at Boundary Rd - E", //replace with your own city?
        city: "New Westminster/Queensborough",
        province: "BC",
        details:  "Highway 91A at Boundary Road, looking east",
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2023"))
    });
    routesRef.add({
        code: "HW99CambieN",
        name: "Highway 99 at Cambie Rd - N", //replace with your own city?
        city: "Richmond",
        province: "BC",
        details:  "Highway 99 at Cambie Rd in Richmond, looking north",
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2023"))
    });
    routesRef.add({
        code: "HW99CambieS",
        name: "Highway 99 at Cambie Rd - S", //replace with your own city?
        city: "Richmond",
        province: "BC",
        details:  "Highway 99 at Cambie Rd in Richmond, looking south",  
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2023"))
    });
    routesRef.add({
        code: "Oak70N",
        name: "Oak St at 70th - N", //replace with your own city?
        city: "Vancouver",
        province: "BC",
        details:  "Oak Street at 70th Avenue, north approach to Oak Street Bridge, looking north on Oak Street",
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2023"))
    });
    routesRef.add({
        code: "Oak70S",
        name: "Oak St at 70th - S", //replace with your own city?
        city: "Vancouver",
        province: "BC",
        details:  "Oak Street at 70th Avenue, north approach to Oak Street Bridge, looking south to the bridge",
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2023"))
    });
    routesRef.add({
        code: "PattulloNorthendN",
        name: "Pattullo Bridge Northend - North", //replace with your own city?
        city: "New Westminster",
        province: "BC",
        details:  "Pattullo Bridge at north end, in New Westminster, looking north", 
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2023"))
    });
    routesRef.add({
        code: "PattulloNorthendS",
        name: "Pattullo Bridge Northend - South", //replace with your own city?
        city: "New Westminster",
        province: "BC",
        details:  "Pattullo Bridge at north end, in New Westminster, looking south",
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2023"))
    });
    routesRef.add({
        code: "KensingtonE",
        name: "Kensington - E", //replace with your own city?
        city: "Burnaby",
        province: "BC",
        details:  "Highway 1 at Kensington Avenue, looking east",      
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2023"))
    });
    routesRef.add({
        code: "KensingtonW",
        name: "Kensington - W", //replace with your own city?
        city: "Burnaby",
        province: "BC",
        details:  "Highway 1 at Kensington Avenue, looking west",      
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2023"))
    });
}

function writeLionsGate() {
    var routesRef = db.collection("routes");
    routesRef.add({
        code: "KnightNorthendN", 
        name: "Knight Street Bridge Northend - N",  
        city: "Vancouver",
        desc: "",
        province: "BC",
		details: "North end of Knight Street Bridge, looking north",
        img: "http://images.drivebc.ca/bchighwaycam/pub/cameras/18.jpg",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
}

//a function that parse through a route's nearby event using coordinates parseRouteEvent(long, lat);
//a function that add a description to a route
function urlEvent(lat, long) {
    return "https://api.open511.gov.bc.ca/events?geography=POINT(" + lat + "%20" + long + ")&tolerance=15000";
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


//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("routeCardTemplate");

    db.collection(collection).get()   //the collection called "hikes"
        .then(allRoutes=> {
            let i = 1;  //Optional: if you want to have a unique ID for each hike
            allRoutes.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;       // get value of the "name" key
                var details = doc.data().details;  // get value of the "details" key
				var routeCode = doc.data().code;    //get unique ID to each route to be used for fetching right image
                var img = doc.data().img;           //get img
                var docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true);

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-text').innerHTML = details;
                newcard.querySelector('.card-image').src = img; //Example: NV01.jpg
                newcard.querySelector('a').href = "eachRoute.html?docID=" + docID;
                //Optional: give unique ids to all elements for future use
                // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);

                i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

displayCardsDynamically("routes");  //input param is the name of the collection
