import React from 'react'
import "./Login.css"
import { auth, provider } from '../firebase-config'
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'
import { Link, useNavigate } from "react-router-dom"
import { useState } from 'react'
import Inputcontrol from '../Component/Inputcontrol'

function Login({ setIsAuth}) {

  // const [login,setLogin]=useState(false);
  let navigate = useNavigate();

  const[values,setValues]=useState({
    email:"",
    pass:""
  })
  const [errMsg,setErrorMsg]=useState("");
  const [submitButtonDisabled,setSubmitButtonDisabled]=useState(false);
  
  const handelSubmit= ()=>{
    if(!values.email||!values.pass){
        setErrorMsg("Fill all Fields");
        return;
    }
    setErrorMsg("")
    setSubmitButtonDisabled(true);
    signInWithEmailAndPassword(auth,values.email,values.pass)
    .then(
        async (res)=>{
            setSubmitButtonDisabled(false);
            localStorage.setItem("IsAuth", true);
            setIsAuth(true);
            navigate("/")          
                },
        
    ).catch(err=>{
        setSubmitButtonDisabled(false);
        setErrorMsg(err.message);
    })
    
  }

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem("IsAuth", true);
      setIsAuth(true);
      // setIsAuthUser(false);
      navigate("/")
    });
  };

  return (

    <div className='loginPage'>

      <div className="loginform">
        <h1>Login</h1>
        <Inputcontrol label="Email" type="email" placeholder="Enter Your Email" 
         onChange={
          (e)=>setValues((prev)=>({...prev,email:e.target.value}))
         }
        ></Inputcontrol>
        <Inputcontrol label="Password" type="password" placeholder="Enter Your Password"
        onChange={
          (e)=>setValues((prev)=>({...prev,pass:e.target.value}))
         }></Inputcontrol>

        <div className="footer">
          <b className='error'>{errMsg}</b>
          <button disabled={submitButtonDisabled} onClick={handelSubmit}>Login</button>
          <p>
            Dont have an account? <span><Link to="/Signup">Sign Up</Link></span>
          </p>
        </div>
        {/* <h1>{login?"SignIn":"SignUp"}</h1>
        <form onSubmit={(e)=>handleSubmit(e,login?"signIn":"SignUp")}>
          <input name='email' type="email"  placeholder='Email'/> <br />
          <input name="password" type="password" placeholder='Password'/><br />
          <br />
          <button>{login?"SignIn":"SignUp"}</button>
        </form> */}
      </div>
      <div>
        <h4>OR <hr /> </h4>
        <p>Sign In with Google to Continue</p>
        <button className='login-with-google-btn' onClick={signInWithGoogle}>
          Sign in with Google
        </button>
      </div>

    </div>

  )
}

export default Login