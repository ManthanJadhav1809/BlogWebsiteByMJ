import './App.css';
import {BrowserRouter as Router,Routes,Route,Link}from "react-router-dom"; 
import Home from './Pages/Home';
import CreatePost from './Pages/CreatePost';
import Login from './Pages/Login';
import { useEffect, useState } from 'react';
import {signOut} from 'firebase/auth'
import { auth } from './firebase-config';
import Signup from './Pages/Signup';


function App() {
  const [ isAuth,setIsAuth]=useState(localStorage.getItem("isAuth"));
  // const [ isAuthUser,setIsAuthUser]=useState(localStorage.getItem("isAuthUser"));

  const signUserOut=()=>{
    signOut(auth).then(()=>{
      localStorage.clear();
      setIsAuth(false);
      // setIsAuthUser(false);
      window.location.pathname="/login";
    })
  }

  const [userName,setUserName]=useState("");
  useEffect(()=>{
    if(!isAuth){
      setUserName("");
    }
    else{
      auth.onAuthStateChanged((user)=>{
        if(user){
          setUserName(user.displayName)
        }else setUserName("");
        console.log(user.displayName);
      })
    }
    //eslint-disable-next-line
  },[])
  return (
     <Router>
       <nav>
        <Link to={"/"}>Home</Link>
        {!isAuth ?(
          <>
          <Link to={"/login"}>Login</Link>
          <Link to={"/Signup"}>Signup</Link>
          </>
          
        ):(
          <>
            <Link to={"/createpost"}>Create Post</Link>
             <h1><i class="fa-regular fa-user"></i> {userName}</h1>
            <button onClick={signUserOut}> <i class="fa-light fa-right-from-bracket">Logout</i> </button>
          </>
        )}     
       </nav>
        <Routes>
           <Route path="/" element={ <Home  isAuth={isAuth}></Home>}></Route>
           <Route path="/createPost" element={<CreatePost  isAuth={isAuth}></CreatePost>}></Route>
           <Route path="/login" element={<Login setIsAuth={setIsAuth}></Login>}></Route>
           <Route path='/Signup' element={<Signup setIsAuth={setIsAuth}></Signup>} />
        </Routes>
    </Router>
      );
}

export default App;
