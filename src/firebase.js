import * as app from "firebase/app";
import 'firebase/auth'
import 'firebase/firebase-firestore'




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

	login(email, password) {
		this.auth.signInWithEmailAndPassword(email, password).then(function (result) {
		 console.log(result);

		});
	}

	logout() {
		return this.auth.signOut()
	}

	async register(name, surname, email, password) {




		await this.auth.createUserWithEmailAndPassword(email, password);

		return app.database().ref('users/').push({
			name: name,
			surname: surname,
			email: email,
			id: this.auth.currentUser.uid,
		});




		// app.auth().currentUser.updateProfile({
		// 	displayName: name,	
		// })




	}


	isUserSignedIn() {
		return !!app.auth().currentUser;
	}


	addQuote(quote) {
		if (!this.auth.currentUser) {
			return alert('Not authorized')
		}

		return this.db.doc(`users_codedamn_video/${this.auth.currentUser.uid}`).set({
			quote
		})
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