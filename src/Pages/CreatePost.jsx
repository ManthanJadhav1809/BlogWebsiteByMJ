import React,{ useState,useEffect } from 'react';
import {addDoc,collection} from 'firebase/firestore';
import {auth, db} from "../firebase-config";
import { useNavigate } from 'react-router-dom';
import { ToastContainer,toast } from 'react-toastify';

function CreatePost({isAuth}) {
const [title,setTitle]=useState("");
const [postText,setPostText]=useState("");
const [images,setImage]=useState("");


const postCollectionRef=collection(db,"posts");
let navigate=useNavigate();


const createPost = async () => {
    console.log("Button clicked"); // Check if the button click event is triggered
    console.log(title);
  
    if (title==="" || postText==="" || !images==="") {
        toast.success("ssssss",{
            position:toast.POSITION.TOP_RIGHT
        });
    //    toast.warning("Please fill proper Data");
    }
    if (!images || images === undefined) {
      toast.warning("Please Select image");
    }
  
    await addDoc(postCollectionRef, {
      title,
      postText,
      author: {
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
        id: auth.currentUser.uid,
      },
    });
  
    console.log("Post added to Firestore"); // Check if the Firestore operation is executed
  
    navigate("/");
  };
  

useEffect(() => {
    if(!isAuth){
        navigate("/login");
    }
    //eslint-disable-next-line
},[isAuth])

    return (
    <div className='createPostPage'>
        <div className="cpContainer">
            <h1>Create A Post</h1>
            <div className="inputGp">
                <label >Title</label>
                <input placeholder='Title...' onChange={(e)=>{setTitle(e.target.value)}} />
            </div>
            <div className='inputGp'>
                <label >Post :</label>
                <textarea  placeholder='Post...' cols="30" rows="10" onChange={(e)=>{setPostText(e.target.value)}} ></textarea>
            </div>
            <div className='inputGp'>
                <label >Image :</label>
                <input style={{backgroundColor:"white"}} type="file" src="" alt=""  />
            </div>
            <div>
            <button onClick={createPost}>Submit Post</button>
             <ToastContainer></ToastContainer> 
            </div>
        </div>
    </div>
  )
}

export default CreatePost