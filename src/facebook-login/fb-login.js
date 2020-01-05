

import * as Facebook from 'expo-facebook'

import firebase from '../config/firebase';


const loginWithFacebook = async (deviceToken) => {
    try {
      await Facebook.initializeAsync('925470951182049');
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile','email'],
      });

        // const { result, token } = response;

        if (type === 'success') {
            return firebase.loginWithFb(token,deviceToken);
        }
        else {
            throw { message: "You cannot login since you cancelled!" }
        }
    }
    catch (error) {
        throw error
    }
}

const facebook = {
    loginWithFacebook,
}

export default facebook;