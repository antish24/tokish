import React, { useEffect, useRef, useState } from 'react'
import {useNavigate } from 'react-router-dom'
import { Auth } from '../store/Context'
import styles from './signup.module.css'
const Signin = () => {
  const {currentUser}=Auth()
  const emailRef=useRef()
    const passwordRef=useRef()
    const passwordcRef=useRef()
    const {signup,login,resetPassword}=Auth()
    const navigate=useNavigate()
    const [error,setError]=useState('')
    const [errcolor,seterrcolor]=useState(true)
    const [showlogin,setlogin]=useState('')
    const [forgetpassword,setforgetpassword]=useState(true)
    const [loading,setLoading]=useState(false)
    useEffect(()=>{
      currentUser?navigate('/setprofile'):navigate('/')
    },[currentUser,navigate])
    async function handleSubmit(e){
        e.preventDefault()
        if(passwordRef.current.value !== passwordcRef.current.value){
            return setError('password do not match')
        }try {
            setError('')
            setLoading(true)
        await signup(emailRef.current.value,passwordRef.current.value)
            navigate('/setprofile')
        } catch(error) {
        seterrcolor(true)
            switch(error.code){
              case "auth/invalid-email":
                setError('Invalid Email');
              break;
              case "auth/weak-password":
                  setError('Weak password');
              break;
              case "auth/email-already-in-use":
                  setError('Email already in use');
                break;
              default: 
              setError(error.code);
            }
          }
        setLoading(false)
    }
    async function handleLogin(e) {
      e.preventDefault();
      try {
        setError("");
        seterrcolor(true)
        setLoading(true);
        await login(emailRef.current.value, passwordRef.current.value);
        navigate("/profile");
      } catch(error) {
        switch(error.code){
          case "auth/invalid-email":
            setError('Invalid Email');
          break;
          case "auth/user-disabled":
              setError('Account Disabled');
          break;
          case "auth/user-not-found":
              setError("Account Not Found");
            break;
          case "auth/wrong-password":
              setError('Incorrect Password');
            break;
          default: 
          setError('something went wrong');
        }
      }
      setLoading(false);
    }
    async function ResetPassword(e){
      e.preventDefault()
      try {
        setError('')
        seterrcolor(true)
        setLoading(true);
        await resetPassword(emailRef.current.value)
      } catch (error) {
        console.log(error.code)
        if(error.code==='auth/user-not-found')
          {seterrcolor(true)
            setError("User Not Found")}
          else if(error.code==="auth/missing-email" || error.code==="auth/invalid-email"){
            seterrcolor(true)
            setError("Invalid Email")
          }
          else{
          seterrcolor(false)
            setError("Check your Email")
          }
      }
      setLoading(false);

    }
  return (
    <>
    { showlogin?
  <div className={styles.box}>
  <div className={styles.form}>
    <div>
      <p>Email</p>
      <input autoComplete='on' ref={emailRef} />
    </div>
    <div>
      <p>Password</p>
      <input  type="password" ref={passwordRef} />
    </div>
    <div>
      <p>Confirm Password</p>
      <input type="password" ref={passwordcRef} />
    </div>
    <button disabled={loading} onClick={handleSubmit}>
      Sign up
    </button>
    <span style={{color:'red'}}>{error}</span>
    <div>
    Already have an account ?<span style={{color:'rgb(0,140,255'}} onClick={()=>setlogin(false)}>Log in</span>
    </div>
  </div>
</div>
:
<div>
{forgetpassword?
<div className={styles.box}>
<div className={styles.form}>
  <div>
    <p>Email</p>
    <input ref={emailRef} />
  </div>
  <div>
    <p>Password</p>
    <input type="password" ref={passwordRef} />
  </div>
  <div>
   <span style={{color:'rgb(0,140,255',fontSize:"15px"}} onClick={()=>setforgetpassword(false)}>Forgot your password?</span>
  </div>
  <button disabled={loading} onClick={handleLogin}>
    Login
  </button>
  <span style={{color:'red'}}>{error}</span>
  <div>
    don't have an account ?<span style={{color:'rgb(0,140,255'}} onClick={()=>setlogin(true)}>Sign up</span>
  </div>
</div>
</div>
:
<div className={styles.box}>
<div className={styles.form}>
  <div className={styles.resetpassword}>
    <p>Email</p>
    <input ref={emailRef} />
    <button disabled={loading} onClick={ResetPassword}>
    RESET PASSWORD
  </button>
  </div>
  
  <div>
  <span style={{color:errcolor?'red':"rgb(0,140,255)"}}>{error}</span>
  <div>
  <span style={{color:'rgb(0,140,255'}} onClick={()=>setforgetpassword(true)}>Login</span>
  </div>
</div>
</div>
</div>
    }
</div>
  }
    </>
   
  )
}

export default Signin