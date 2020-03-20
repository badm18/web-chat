import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase';

 // Your web app's Firebase configuration
 var firebaseConfig = {
    apiKey: "AIzaSyARUWpqc0nNXa0kIQiLy6gN9AgXOYawQXQ",
    authDomain: "web-chat-e36cb.firebaseapp.com",
    databaseURL: "https://web-chat-e36cb.firebaseio.com",
    projectId: "web-chat-e36cb",
    storageBucket: "web-chat-e36cb.appspot.com",
    messagingSenderId: "1017710627055",
    appId: "1:1017710627055:web:b7a7c9b0eea502032d731a"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);



ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
