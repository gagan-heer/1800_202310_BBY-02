// Allows user to ilter through routes cards on the route list page by typing in the name of a route
 function searchRoutes() {
    // Get the value of the search bar
    var input = document.getElementById("myInput");
    var filter = input.value.toUpperCase();
  
    // Get all the cards
    var cards = document.getElementsByClassName("card");
  
    // Loop through each card and show or hide it based on whether its name contains the search bar value
    for (var i = 0; i < cards.length; i++) {
      var name = cards[i].querySelector(".card-title").textContent.toUpperCase();
      if (name.includes(filter)) {
        cards[i].style.display = "";
      } else {
        cards[i].style.display = "none";
      }
    }
  }
  
  
  
  
  

  