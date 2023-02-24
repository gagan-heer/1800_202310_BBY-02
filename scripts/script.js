function loadSkeleton(){
    console.log($('#navbarPlaceholder').load('./text/nav.html'));
    console.log($('#footerPlaceholder').load('./text/footer.html'));
}
loadSkeleton();  //invoke the function

function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) { 
            console.log(user.uid); 
            console.log(user.displayName);  
            user_Name = user.displayName;

            $("#name-goes-here").text(user_Name); 

        } else {
            // No user is signed in.
        }
    });
}
getNameFromAuth(); //run the function