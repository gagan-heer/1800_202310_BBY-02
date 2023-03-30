
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

// Parses route traffic event data and displays events for each route in cards
function parseRouteEvent(lat, long) {
    ajaxGET(urlEvent(lat, long), function (data) {
        parsedData = JSON.parse(data);

        let events = parsedData.events.sort(function(a, b) {
            return new Date(b.updated) - new Date(a.updated);
        });

        let desc = "";
        for(let i = 0; i < events.length; i++) {
            let updatedDate = new Date(events[i].updated);
            let formattedDate = updatedDate.toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'}) 
                + " at " + updatedDate.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric'}) 
                + " " + updatedDate.toLocaleTimeString('en-US', {timeZoneName: 'short'}).split(' ')[2];

            desc += "<div class='card'><div class='card-header'>" + events[i].event_type 
            + "</div><div class='card-body'><p class='card-text'>" + events[i].description 
            + "</p></div><div class='card-footer text-muted'>" + "Last Updated: " + formattedDate + "</div></div>";
        }

        if(desc === "") {
            desc = "No current event(s) for this route.";
        }

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
