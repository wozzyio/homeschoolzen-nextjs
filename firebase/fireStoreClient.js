import { useCollection } from "react-firebase-hooks/firestore";
import { createContext, useContext, Context } from 'react';
import Firebase from './clientApp';

const fireStoreContext = createContext({
    addTeacherDocument: async () => {},
});

export default function useFirebaseCollection() {
    const db = Firebase.firestore();
    // Create document function
    // const addTeacherDocument = async (teacherData, user) => {
    //     await db.collection("teachers").doc(user.uid).set({
    //         teacherData,
    //     });
    // };
    const addTeacherDocument = (email, password) =>
        Firebase.auth().createUserWithEmailAndPassword(email, password);
}

export const useFireStore = () => useContext(fireStoreContext);
