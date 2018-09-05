import firebase from 'firebase/app'
import firestore from 'firebase/firestore'

// Initialize Firebase
// firebase database setup
var config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
  };
const firebaseApp = firebase.initializeApp(config);
firebaseApp.firestore().settings({ timestampsInSnapshots: true });

export default firebaseApp.firestore()