import firebase from "firebase/app";
import 'firebase/auth';      //firebase authentication
import 'firebase/firestore'; //firebase firestore
import 'firebase/analytics'; //firebase analytics

var firebaseConfig = {
    apiKey: "AIzaSyC_aALO6pJiJ9Zhv7OetbxuR4Y8ExcfLlA",
    authDomain: "danshan-square.firebaseapp.com",
    databaseURL: "https://danshan-square.firebaseio.com",
    projectId: "danshan-square",
    storageBucket: "danshan-square.appspot.com",
    messagingSenderId: "937496455872",
    appId: "1:937496455872:web:313733bff3b46e89e49b25",
    measurementId: "G-Z167PLCPXW"
  };


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

export default firebase;
