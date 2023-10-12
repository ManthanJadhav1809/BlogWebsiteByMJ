
import React,{ useEffect,useState } from 'react';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase-config';
import "./home.css"
function Home({isAuth}) {
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
  },[isAuth]);

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
       <h1 className='textWel'> Welcome to Blog website</h1>
      <div className="postcount">
        {
           isAuth
           ?
           <div className="top-right-container">
            <div className="user-post-count">
            <span>
             All Post <br />{postLists.length}
            </span>
            </div>
            <div className="user-post-count"> 
              <span >
                  Your Post <br />{userPostCount}
              </span>
              </div>
            </div>
           :``
        }  
      </div>
      
     
     {postLists.map((post)=>{
     return (
      <>
      <div className="card-container">
        
        <div key={post.id} className="Post-card">
          <div className='postImage2'>
          <img className='postImage' src={post.imageUrl} alt="PostImage" />
          </div>
            <div className="postContant">
            <h3>{post.title}</h3>
            <hr />
            <p>{post.postText}</p>
            </div>
            <div className="postButtons">
              <div className="userInfo">
              <i class="fa-regular fa-user"></i>{post.author.name}
              </div>
              <div className='PostBtn'>
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
              <button>Like</button>
              <button>Update</button>
              </div>
            </div>
          </div>
        </div>
          
        {/* ******** */}

         {/* <div key={post.id} className="post">
         <div>
          <img className='postImage' src='data:image/jpeg;base64,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' alt="imsagg" />
         </div>
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
       </div>    */}
      </>
      
      ) 
     })}

    </div>
  )
}

export default Home