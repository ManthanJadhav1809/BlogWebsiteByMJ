import React,{ useEffect,useState } from 'react';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase-config';
import "./UserPost.css"

function UserPost({isAuth}) {
const [postLists,setPostList]=useState([]);
const postCollectionRef=collection(db,"posts");

//  console.log();
  useEffect(()=>{
    const getPosts=async()=>{
      const data =await getDocs(postCollectionRef);
      // firebase data is set to setpostList.    
      setPostList(data.docs.map((doc)=>( 
        {...doc.data(),id:doc.id})));
    };
    getPosts();
  });

  const deletePost=async(id)=>{
    const postDoc=doc(db,"posts",id);
    await deleteDoc(postDoc);
  };

  const[UserName,setUser]=useState("");
  let [userPostCount,setUserpost]=useState(0);
    
  const getUserPost=()=>{

    if(isAuth === true)
    {
     setUser(auth.currentUser.displayName); 
     
     let count = 0;
     postLists.forEach((post) => {
      if (post.author.name === UserName) {
        count++; // Increment the count for each post matching the user's name
      }
     });

     setUserpost(count);
    
   }
    //  console.log(UserName+" "+"count"+userPostCount)
  }
  useEffect(()=>{
   if(isAuth===true) 
    getUserPost();
    
  },[isAuth,postLists])
  
  return (
    
    <div className='homePage'>
        
       <div className="postcount">
        {
           isAuth
           ?
           <div className="top-right-Container">
            <div className="user-post-Count">
            <span>
             All Post <br />{postLists.length}
            </span>
            </div>
            <div className="user-post-Count"> 
              <span >
                  Your Post <br />{userPostCount}
              </span>
              </div>
            </div>
           :``
        }
        
      </div> 
     {postLists.map((post)=>{
        if(post.author.name === UserName){
           return (
                <div key={post.id} className="post">
                  <div className="postHeader">
                    <div className="title">
                      <h1>{post.title}</h1>
                    </div>
                    <div className="deletePost">
                      {
                        isAuth && post.author.id === auth.currentUser.uid &&
                        <>
                        <button onClick={
                          ()=>{
                            deletePost(post.id)
                          }
                        }><i class="fa-solid fa-trash"></i></button>
                        </>
                        
                      }
                      
                    </div>
                  </div>
                  <div className="postTextContainer">{post.postText}</div>
                  <h3><i class="fa-regular fa-user"></i>  {post.author.name}</h3>
                  <button className='updatePostBtn'>Update Post</button>
                </div>
            )
        }
        else{
          return(
            <></>
          )
        }
      
     })}
    </div>
  )
}

export default UserPost