
let firebase = require('firebase');
let config = { apiKey: "AIzaSyCwwIY6jfniWBgaNOLOjmarT_cACs5k9yI", authDomain: "receita-8fcd3.firebaseapp.com", databaseURL: "https://receita-8fcd3.firebaseio.com", projectId: "receita-8fcd3", storageBucket: "", messagingSenderId: "164278912442" };
let app = firebase.initializeApp(config);


exports.firebase = app;

