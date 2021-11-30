import { createContext, useContext, Context } from 'react'
import useFirebaseAuth from './authState';

const authUserContext = createContext({
    authUser: null,
    loading: true,
    userDoc: null,
    teacherStudentDoc: null,
    signInWithEmailAndPassword: async () => {},
    createUserWithEmailAndPassword: async () => {},
    signOut: async () => {},
    setUserDocument : async () => {},
    getUserDocData : async () => {},
    addTeacherDocument : async () => {},
    setStudentsDocAsTeacher: async () => {},
});

export function AuthUserProvider({ children }) {
    const auth = useFirebaseAuth();
    return <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>;
}
// custom hook to use the authUserContext and access authUser and loading
export const useAuth = () => useContext(authUserContext);
