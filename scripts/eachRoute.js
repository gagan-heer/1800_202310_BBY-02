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

function parseRouteEvent(lat, long) {
    ajaxGET(urlEvent(lat, long), function (data) {
        parsedData = JSON.parse(data);

        let desc = "";
        for(let i = 0; i < parsedData.events.length; i++) {
            desc += parsedData.events[i].description + "\n" + "\n";
        }

        if(desc === "") {
            desc = "No current event(s) for this route.";
        }

        console.log(parsedData);
        document.getElementById("desc-text").innerHTML = desc;
    }); 
};

// Displays route information for each route's page
function displayRouteInfo() {
    let params = new URL( window.location.href ); //get URL of search bar
    let ID = params.searchParams.get( "docID" ); //get value for key "id"
    
    // Receives route information from Firestore "routes" collection
    db.collection( "routes" )
        .doc( ID )
        .get()
        .then( doc => {
            thisRoute = doc.data();
            routeCode = thisRoute.code; 
            routeTitle = doc.data().name;
            lat = doc.data().lat;
            long = doc.data().long;
            webcamUrl = thisRoute.webcamUrl;
            staticImageUrl = thisRoute.img; 
            routeDetails = thisRoute.details;
            

            parseRouteEvent(lat, long); //needs lat and long that is from firestore for specific routes
            document.getElementById( "routeName" ).innerHTML = routeTitle; 
            document.getElementById( "webcam-frame" ).src = webcamUrl;
            document.getElementById("route-details").innerHTML = routeDetails;
        } );
    console.log("Route updated.");
}
displayRouteInfo();
