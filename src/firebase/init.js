import firebase from 'firebase/app'

import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/database'

//import firestore from 'firebase/firestore'

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBKeomFZowrp8gEqZ1kZX7Jveujo9dPVi4",
    authDomain: "moview-v2.firebaseapp.com",
    databaseURL: "https://moview-v2.firebaseio.com",
    projectId: "moview-v2",
    storageBucket: "moview-v2.appspot.com",
    messagingSenderId: "951337726791"
  };
  const firebaseApp = firebase.initializeApp(config);
  // firebaseApp.firestore().settings({ timestampsInSnapshots: true });
  
  export default firebaseApp.firestore()