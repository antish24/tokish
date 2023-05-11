import React, { useContext,useState,useEffect } from 'react'
import {auth} from "../database/Firebase";


const AuthContext=React.createContext()
export const Auth=()=>{
    return useContext(AuthContext)
}

export const Context = ({children}) => {
const[loading,setLoading]=useState(true)
const[currentUser,setCurrentUser]=useState()
function signup(email,password){
   return auth.createUserWithEmailAndPassword(email,password)
}
function login(email,password){
    return auth.signInWithEmailAndPassword(email,password)
}
function resetPassword(email){
    return auth.sendPasswordResetEmail(email)
}
function logout(){
    return auth.signOut()
}
useEffect(()=>{
    const unsub=auth.onAuthStateChanged(user=>{
        setCurrentUser(user)
        setLoading(false)
    })
    return unsub
},[])

    const values={
        currentUser,
        signup,
        login,
        resetPassword,
        logout
    }

  return (
    <AuthContext.Provider value={values}>
        {!loading && children}
    </AuthContext.Provider>
  )
}

export default Context