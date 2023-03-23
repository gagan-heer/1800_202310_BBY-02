
function addToFavourites(routeId) {
  const userId = firebase.auth().currentUser.uid; // Get the ID of the currently logged in user

  let params = new URL(window.location.href); //get the url from the search bar
  let ID = params.searchParams.get("docID");

  const routeRef = firebase.firestore().collection("routes").doc(routeId); // Get route info
  const favouritesRef = firebase.firestore().collection("users").doc(userId).collection("favourites").doc(ID); // Create a reference to the user's favourites list
  favouritesRef.get().then((doc) => {
    if (doc.exists) {
      // The product is already in the user's favorites, so remove it.
      const removeConfirm = confirm('This route is already in your favourites. Do you want to remove it?');
      if (removeConfirm) {
        favouritesRef.delete();
        alert('The route has been removed from your favourites.');
      }
    } else {
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
            desc: doc.data().desc
          });
        });
        alert('The route has been added to your favourites.');
      }
    }
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
  

  // Dynamically display Favourite Routes on home page
  function displayFavsDynamically(collection, userId) {
    let cardTemplate = document.getElementById("favouritesCardTemplate");
  
    db.collection("users").doc(userId).collection(collection).get() // get the favorites collection of the current user
      .then(favourites => {
        let i = 1;
        favourites.forEach(doc => {
          var title = doc.data().name;
          var details = doc.data().details;
          var routeCode = doc.data().code;
          var img = doc.data().img;
          var docID = doc.id;
          let newcard = cardTemplate.content.cloneNode(true);
  
          //update title and text and image
          newcard.querySelector('.card-title').innerHTML = title;
          newcard.querySelector('.card-text').innerHTML = details;
          newcard.querySelector('.card-image').src = img;
          newcard.querySelector('a').href = "eachRoute.html?docID=" + docID;
  
          document.getElementById(collection + "-go-here").appendChild(newcard);
  
          i++;
        })
      })
      .catch(error => console.log(error));
  }

displayFavsDynamically("favourites");  //input param is the name of the collection