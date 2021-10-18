import { useState, useEffect } from 'react'
import Firebase from './clientApp';

const formatAuthUser = (user) => ({
    uid: user.uid,
    email: user.email
});

export default function useFirebaseAuth() {
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userDoc, setUserDoc] = useState(null);

    const authStateChanged = async (authState) => {
        console.log("innn authStateChanged");
        console.log(authState);
        if (!authState) {
            setAuthUser(null)
            setLoading(false)
            return;
        }

        setLoading(true)
        var formattedUser = formatAuthUser(authState);
        setAuthUser(formattedUser);
        setLoading(false);
    };

// listen for Firebase state change
    useEffect(() => {
        const unsubscribe = Firebase.auth().onAuthStateChanged(authStateChanged);
        return unsubscribe;
    }, []);

    const clear = () => {
        setAuthUser(null);
        setLoading(true);
    };

    const setUserDocument = (userDocData) =>
        setUserDoc(userDocData)

    const signInWithEmailAndPassword = (email, password) =>
        Firebase.auth().signInWithEmailAndPassword(email, password);

    const createUserWithEmailAndPassword = (email, password) =>
        Firebase.auth().createUserWithEmailAndPassword(email, password);

    const signOut = () =>
        setUserDoc(null)
        Firebase.auth().signOut().then(clear);
    
    const addTeacherDocument = (user) => {
        Firebase.firestore().collection("users").doc(user.user.uid).set({
            uid: user.user.uid,
            displayName: user.user.displayName,
            photoURL: user.user.photoURL,
            email: user.user.email,
            emailVerified: user.user.emailVerified,
            isNewUser: user.additionalUserInfo.isNewUser,
            userType: "teacher",
        });
    };

    const getUserDocData = (user) =>
        Firebase.firestore().collection("users").doc(user.uid).get();

    useEffect(() => {
        const unsubscribe = Firebase.auth().onAuthStateChanged(authStateChanged);
        return () => unsubscribe();
    }, []);

    return {
        authUser,
        loading,
        userDoc,
        signInWithEmailAndPassword,
        createUserWithEmailAndPassword,
        signOut,
        setUserDocument,
        addTeacherDocument,
        getUserDocData,
    };

    return {
        authUser,
        loading
    };
}