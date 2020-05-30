import * as app from "firebase/app";
import 'firebase/auth'
import 'firebase/firebase-firestore'
import 'firebase/database'
import 'firebase/storage'




var firebaseConfig = {
	apiKey: "AIzaSyARUWpqc0nNXa0kIQiLy6gN9AgXOYawQXQ",
    authDomain: "web-chat-e36cb.firebaseapp.com",
    databaseURL: "https://web-chat-e36cb.firebaseio.com",
    projectId: "web-chat-e36cb",
    storageBucket: "web-chat-e36cb.appspot.com",
    messagingSenderId: "1017710627055",
	appId: "1:1017710627055:web:b7a7c9b0eea502032d731a"
};




class Firebase {
	constructor() {
		app.initializeApp(firebaseConfig)
		this.auth = app.auth()
		this.db = app.firestore()
	}

	 async  login(email, password) {
		await this.auth.signInWithEmailAndPassword(email, password);
	}

	logout() {
		return this.auth.signOut()
	}

	async register(name, surname, email, password) {

		await this.auth.createUserWithEmailAndPassword(email, password);
		console.log(app.auth().currentUser.uid);
		app.auth().currentUser.updateProfile({
			displayName: name+' '+surname,
			photoURL: '/images/noavatar.png',

		  })

		 return app.database().ref().child('/users/'+app.auth().currentUser.uid).set({
			name: name,
			surname: surname,
			email: email,
			id: this.auth.currentUser.uid,
		});
	}


	isUserSignedIn() {
		return app.auth().currentUser;
	}


	

	isInitialized() {
		return new Promise(resolve => {
			this.auth.onAuthStateChanged(resolve)
		})
	}

	getCurrentUsername() {
		return this.auth.currentUser && this.auth.currentUser.email
	}

	


}

export default new Firebase()