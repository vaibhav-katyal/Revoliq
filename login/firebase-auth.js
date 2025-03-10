import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js"
import {
  getAuth,
  createUserWithEmailAndPassword as _createUserWithEmailAndPassword,
  signInWithEmailAndPassword as _signInWithEmailAndPassword,
  sendPasswordResetEmail as _sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js"
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js"

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwdoq-N3zCiMopVf8MFSsEugth6eXnyZU",
  authDomain: "revoliqauth.firebaseapp.com",
  projectId: "revoliqauth",
  storageBucket: "revoliqauth.appspot.com",
  messagingSenderId: "761775634366",
  appId: "1:761775634366:web:64d6f48dbf6323e2aaabef",
  measurementId: "G-K956WKVC54",
}

// ✅ Initialize Firebase
console.log("Initializing Firebase with config:", JSON.stringify(firebaseConfig))
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app) // ✅ Firestore Database
console.log("Firebase initialized successfully")

// Wrapper for createUserWithEmailAndPassword with better error handling
async function createUserWithEmailAndPassword(auth, email, password) {
  try {
    console.log("Creating user with email:", email)
    const result = await _createUserWithEmailAndPassword(auth, email, password)
    console.log("User created successfully:", result.user.uid)
    return result
  } catch (error) {
    console.error("Error in createUserWithEmailAndPassword:", error.code, error.message)
    throw error
  }
}

// Wrapper for signInWithEmailAndPassword with better error handling
async function signInWithEmailAndPassword(auth, email, password) {
  try {
    console.log("Signing in user with email:", email)
    const result = await _signInWithEmailAndPassword(auth, email, password)
    console.log("User signed in successfully:", result.user.uid)
    return result
  } catch (error) {
    console.error("Error in signInWithEmailAndPassword:", error.code, error.message)
    throw error
  }
}

// Wrapper for sendPasswordResetEmail with better error handling
async function sendPasswordResetEmail(auth, email) {
  try {
    console.log("Sending password reset email to:", email)
    await _sendPasswordResetEmail(auth, email)
    console.log("Password reset email sent successfully")
  } catch (error) {
    console.error("Error in sendPasswordResetEmail:", error.code, error.message)
    throw error
  }
}

// 🔥 Store user data in Firestore
async function storeUserData(userType, userCredential, name = "", storeName = "") {
  try {
    const user = userCredential.user
    console.log("Storing user data for:", user.uid)

    // Create a user document with all necessary fields
    const userData = {
      uid: user.uid,
      email: user.email,
      name: name, // Store the user's name
      userType: userType,
      storeName: userType === "retailer" ? storeName : null, // 🔹 Store Name only for retailers
      createdAt: new Date().toISOString(),
    }

    console.log("User data to store:", userData)
    await setDoc(doc(db, "users", user.uid), userData)
    console.log("User data stored successfully in Firestore")
    return true
  } catch (error) {
    console.error("Error storing user data:", error.code, error.message)
    throw error
  }
}

// 🔥 Retrieve user type from Firestore
async function getUserType(uid) {
  try {
    console.log("Getting user type for:", uid)
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data()
      console.log("User data retrieved:", userData)
      return userData.userType
    }
    console.log("No user data found for:", uid)
    return null
  } catch (error) {
    console.error("Error getting user type:", error.code, error.message)
    throw error
  }
}

// Export all the necessary functions and objects
export {
  auth,
  db,
  storeUserData,
  getUserType,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  getDoc,
  setDoc,
  doc,
}

