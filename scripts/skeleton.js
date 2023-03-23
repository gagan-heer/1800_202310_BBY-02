//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton(){
    console.log($('#navbarPlaceholder').load('./text/nav.html'));
    console.log($('#footerPlaceholder').load('./text/footer.html'));
}

loadSkeleton();  //invoke the function

function logout() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        console.log("logging out user");
        // Open modal1
        document.getElementById("modal1").style.display = "block";
        // Close modal1 after 2 seconds
        setTimeout(function () {
          document.getElementById("modal1").style.display = "none";
          // Redirect to main.html
          window.location.href = "index.html";
        }, 1500);
      })
      .catch((error) => {
        // An error happened.
      });
  }
  
  