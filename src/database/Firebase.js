import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

const app =firebase.initializeApp({
    apiKey: "AIzaSyCtC10ZqfwacbSqcj5mr1ddSniPN0XtWN4",
    authDomain: "tokish2402.firebaseapp.com",
    projectId: "tokish2402",
    storageBucket: "tokish2402.appspot.com",
    messagingSenderId: "72327570119",
    appId: "1:72327570119:web:0d488a404fe38a8c6fd4e2"
})
export const auth=app.auth()
export default app