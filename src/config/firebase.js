import * as firebase from "firebase";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyBYLr54MCx5tFDC9p4zY4e_CFKJDClrCCU",
  authDomain: "track-buddy-hackathon.firebaseapp.com",
  databaseURL: "https://track-buddy-hackathon.firebaseio.com",
  projectId: "track-buddy-hackathon",
  storageBucket: "track-buddy-hackathon.appspot.com",
  messagingSenderId: "1003195145517",
  appId: "1:1003195145517:web:a9c2797a5a3aeed947c7a4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const loginWithFb = async (token,deviceToken) => {
  const credential = firebase.auth.FacebookAuthProvider.credential(token);

  try {
    const response = await firebase.auth().signInWithCredential(credential);

    const user = {
      uid: response.user.uid,
      email: response.additionalUserInfo.profile.email,
      name: response.additionalUserInfo.profile.name,
      firstName: response.additionalUserInfo.profile.first_name,
      lastName: response.additionalUserInfo.profile.last_name,
      facebookId: response.additionalUserInfo.profile.id,
      profilePicture: `${response.user.photoURL}?type=large`,
      deviceToken
    };
    console.log(user);
    await firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .set(user,{merge:true});

    const getData = await firebase.firestore().collection('users').doc(user.uid).get();

    return getData.data();
  } catch (e) {
    throw e;
  }
};

export default {
  loginWithFb
};
