function loadSkeleton(){
    console.log($('#navbarPlaceholder').load('./text/nav.html'));
    console.log($('#footerPlaceholder').load('./text/footer.html'));
}
loadSkeleton();  //invoke the function

function buttonClick(id) {
    // gets the clicked button's ID
    let current = document.getElementById(id);
    // gets the sibling element (the like counter input)
    let nextSibling = current.nextElementSibling;
    //increment the like counter
    nextSibling.value++
}
