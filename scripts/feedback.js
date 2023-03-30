function saveUserFeedback(routeId, feedback) {
    const userId = firebase.auth().currentUser.uid; // Get the ID of the currently logged in user
  
    // Create a reference to the user's feedback collection for the specific route
    const feedbackRef = firebase.firestore().collection("users").doc(userId).collection("feedback").doc(routeId);
  
    feedbackRef.set({
      feedback: feedback,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      console.log("Feedback saved successfully.");
    })
    .catch((error) => {
      console.error("Error saving feedback: ", error);
    });
  }
 