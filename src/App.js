import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import {BrowserRouter as Router,Routes,Route,Link}from "react-router-dom"; 
import Home from './Pages/Home';
import CreatePost from './Pages/CreatePost';
import Login from './Pages/Login';
import { useEffect, useState } from 'react';
import {signOut} from 'firebase/auth'
import { auth } from './firebase-config';
import Signup from './Pages/Signup';
import UserPost from './Pages/UserPost';
import { ToastContainer } from 'react-toastify';


function App() {
  const [ isAuth,setIsAuth]=useState(false);
  // const [ isAuthUser,setIsAuthUser]=useState(localStorage.getItem("isAuthUser"));

  useEffect(()=>{
    const authStatus=localStorage.getItem("IsAuth");
    authStatus ? setIsAuth(true) :setIsAuth(false);
  })
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
    // console.log("is auth "+isAuth)
    if(isAuth===true){
      auth.onAuthStateChanged((user)=>{
        if(user){
          setUserName(user.displayName)
        }
        else setUserName("");
        // console.log(user.displayName);
      })
    }
    else{
      setUserName("");
      // console.log(userName)
    }
    //eslint-disable-next-line
  })
  
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
           <Link to={"/Userpost"}>Your Posts</Link>
            <Link to={"/createpost"}>Create Post</Link> 
            <h1 className='userName'>
             <i class="fa-regular fa-user"></i> {userName}
            </h1>

            <div className='divLog'>
             <button className='btnlogout' onClick={signUserOut}><i class="fa fa-sign-out"></i>  LogOut</button>
            </div> 
            
          </>
        )}     
       </nav>
       <ToastContainer />
        <Routes>
           <Route path="/" element={ <Home  isAuth={isAuth}></Home>}></Route>
           <Route path="/UserPost" element={<UserPost  isAuth={isAuth}></UserPost>}></Route>
           <Route path="/createPost" element={<CreatePost  isAuth={isAuth}></CreatePost>}></Route>
           <Route path="/login" element={<Login setIsAuth={setIsAuth}></Login>}></Route>
           <Route path='/Signup' element={<Signup setIsAuth={setIsAuth}></Signup>} />
        </Routes>
    </Router>
      );
}

export default App;
