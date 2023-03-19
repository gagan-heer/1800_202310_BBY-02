
function addToFavourites(routeId) {
    const userId = firebase.auth().currentUser.uid; // Get the ID of the currently logged in user
    
    let params = new URL(window.location.href); //get the url from the search bar
    let ID = params.searchParams.get("docID"); 
    
    const routeRef = firebase.firestore().collection("routes").doc(routeId); // Get route info
    const favouritesRef = firebase.firestore().collection("users").doc(userId).collection("favourites").doc(ID); // Create a reference to the user's favourites list
    favouritesRef.get().then((doc) => {
        if (doc.exists) {
            // The product is already in the user's favorites, so remove it.
            favouritesRef.delete();
          } else {
          const routeRef = firebase.firestore().collection("routes").doc(routeId);
          routeRef.get().then((doc) => {
          favouritesRef.set({
          docID: ID
          });
        });
        }
    });
  }
  

// Dynamically display Favourite Routes on home page
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("favouritesCardTemplate");

    const userId = firebase.auth().currentUser.uid; // Get the ID of the curently logged in user

    db.collection(collection).where("userId", "==", userId).get()   //the collection called "favourites"
        .then(favouriteRoutes=> {
            let i = 1;  //Optional: if you want to have a unique ID for each hike
            favouriteRoutes.forEach(doc => { //iterate thru each doc
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
 
                document.getElementById(collection + "favourites-go-here").appendChild(newcard);

                i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

displayCardsDynamically("favourites");  //input param is the name of the collection