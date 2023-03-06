function displayRouteInfo() {
    let params = new URL( window.location.href ); //get URL of search bar
    let ID = params.searchParams.get( "docID" ); //get value for key "id"
    
    console.log( ID );

    // doublecheck: is your collection called "Reviews" or "reviews"?
    db.collection( "routes" )
        .doc( ID )
        .get()
        .then( doc => {
            thisRoute = doc.data();
            routeCode = thisRoute.code; 
            routeTitle = doc.data().name;
            
            // only populate title, and image
            document.getElementById( "routeName" ).innerHTML = routeTitle; 
            document.getElementById("route-image").src("https://dummyimage.com/400x315/a6a6a6/fff");
            // let imgEvent = document.querySelector( "route-img" );
            // imgEvent.src = "https://dummyimage.com/400x315/a6a6a6/fff";
        } );
}
displayRouteInfo();







