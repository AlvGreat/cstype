// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyABJ3VM-NBt2iuBv08mUmGYhaayWa-AvRk",
    authDomain: "cstype-450d2.firebaseapp.com",
    databaseURL: "https://cstype-450d2-default-rtdb.firebaseio.com",
    projectId: "cstype-450d2",
    storageBucket: "cstype-450d2.appspot.com",
    messagingSenderId: "136453327611",
    appId: "1:136453327611:web:dec1e093fad933c44fbe5e",
    measurementId: "G-3WXQY94VCG"
};

firebase.initializeApp(firebaseConfig);

export default firebase;