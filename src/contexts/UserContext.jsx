import React, { useContext, useState, useEffect } from 'react';
import { auth, db } from '../api/firebase';
import { setDoc, doc, } from '@firebase/firestore';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail,
    updateEmail,
    updatePassword,

} from '@firebase/auth';

const UserContext = React.createContext();

export function useUser() {
    return useContext(UserContext);
}

export function UserProvider({ children }) {

}