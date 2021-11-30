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
    const [teacherStudentDoc, setTeacherStudentDoc] = useState(null);

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
        let token = await authState.getIdToken();
        console.log("token: "+ token);
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

    const signOut = () => {
        setUserDoc(null);
        setTeacherStudentDoc(null);
        Firebase.auth().signOut().then(clear);
    }
    
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

    // const getStudentsAsTeacher = (userDoc) => {
    //     // go thru each userDoc student ID grab the corresponding user data
    //     // input that data into an array and return that array for usage
    //     // for studentId in userDoc.studentUid:
    //     studentDoc = [];
    //     // check if userDoc student id is empty if its empty then just return empty array
    // }

    const setStudentsDocAsTeacher = (teacherStudentDocData) => {
        setTeacherStudentDoc(teacherStudentDocData)
    }

    useEffect(() => {
        const unsubscribe = Firebase.auth().onAuthStateChanged(authStateChanged);
        return () => unsubscribe();
    }, []);

    return {
        authUser,
        loading,
        userDoc,
        teacherStudentDoc,
        signInWithEmailAndPassword,
        createUserWithEmailAndPassword,
        signOut,
        setUserDocument,
        addTeacherDocument,
        setStudentsDocAsTeacher,
        getUserDocData,
    };
}
