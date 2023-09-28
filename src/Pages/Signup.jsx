import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Inputcontrol from '../Component/Inputcontrol'
import { auth } from '../firebase-config'
import "./Signup.css"
export default function Signup({setIsAuth}) {
  const [values,setValues]=useState({
    name:"",
    email:"",
    pass:" ",
  })

  let navigate = useNavigate();
  const [errMsg,setErrorMsg]=useState("");
  const [submitButtonDisabled,setSubmitButtonDisabled]=useState(false);
  
  const handelSubmit= ()=>{
    if(!values.name||!values.email||!values.pass){
        setErrorMsg("Fill all Fields");
        return
    }
    setErrorMsg("")
    setSubmitButtonDisabled(true);
    createUserWithEmailAndPassword(auth,values.email,values.pass).then(
        async (res)=>{
            setSubmitButtonDisabled(false);
            localStorage.setItem("IsAuth", true);
            setIsAuth(true);
            const user=res.user;
            console.log(user)
            await updateProfile(user,{
                displayName:values.name,
            });
            navigate("/")          
                },
        
    ).catch(err=>{
        setSubmitButtonDisabled(false);
        setErrorMsg(err.message);
    })
  }

    return (
    
    <div className="container">
        <div className="cont">
        <h1>Signup</h1>
        <Inputcontrol label="Name" 
         placeholder="Enter Your Name" 
         onChange={(e)=>
         setValues((prev)=>({...prev,name:e.target.value}))
         }>  
        </Inputcontrol>

        <Inputcontrol label="Email" type="email" placeholder="Enter Your Email"
        onChange={(e)=>setValues((prev)=>({...prev,email:e.target.value}))}></Inputcontrol>
        <Inputcontrol label="Password" type="password" placeholder="Enter Your Password"
        onChange={(e)=>setValues((prev)=>({...prev,pass:e.target.value}))}></Inputcontrol>

        <div className="footer">
            <b className='error'>{errMsg}</b>
          <button onClick={handelSubmit} disabled={submitButtonDisabled}>SignUp</button>
          <p>
            Already have an account? <span><Link to="/login">Login</Link></span>
          </p>
        </div>

        </div>
    </div>
  )
}
