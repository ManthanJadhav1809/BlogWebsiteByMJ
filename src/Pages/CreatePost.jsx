import React,{ useState,useEffect } from 'react';
import {addDoc,collection} from 'firebase/firestore';
import {auth, db} from "../firebase-config";
import { useNavigate } from 'react-router-dom';

function CreatePost({isAuth}) {
const [title,setTitle]=useState("");
const [postText,setPostText]=useState("");


const postCollectionRef=collection(db,"posts");
let navigate=useNavigate();
const createPost = async ()=>{
   await addDoc(postCollectionRef,{
    title,
    postText,
    author:{name:auth.currentUser.displayName,email:auth.currentUser.email,id:auth.currentUser.uid},
});
// console.log();
navigate("/");
}

useEffect(() => {
    if(!isAuth){
        navigate("/login");
    }
    //eslint-disable-next-line
},[])

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
                <textarea  placeholder='Post...' cols="30" rows="10" onChange={(e)=>{setPostText(e.target.value)}}></textarea>
            </div>
            <button onClick={createPost}>Submit Post</button>
        </div>
    </div>
  )
}

export default CreatePost