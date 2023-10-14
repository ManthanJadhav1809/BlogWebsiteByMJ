import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';
import "./UserPost.css";
import { format, fromUnixTime } from 'date-fns';
import {  useParams} from 'react-router-dom';

function UserProfilePost({ isAuth }) {
  

    const [postLists, setPostList] = useState([]);
  const postCollectionRef = collection(db, "posts");

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postCollectionRef);
      // firebase data is set to setpostList.    
      setPostList(data.docs.map((doc) => (
        { ...doc.data(), id: doc.id })));
    };
    getPosts();
  });


  const { Username } = useParams();
  let [userPostCount, setUserpost] = useState(0);

  
  useEffect(() => {
    const getUserPost = () => {

        let count = 0;
        postLists.forEach((post) => {
          if (post.author.name === Username) {
            count++; // Increment the count for each post matching the user's name
          }
        });
  
        setUserpost(count);
  
      }
    
    getUserPost()
  }, [isAuth,Username,postLists])

  

  return (

    <div className='homePage'>

      <div className="postcount">
        <h3> <i class="fa-regular fa-user"></i>  {Username}</h3> 
        <h5>Post Count {userPostCount}</h5>
        
      </div>
      
      {postLists.map((post) => {
        if (post.author.name === Username) {

          return (
            <>
            
              <div className="card-container">

                <div key={post.id} className="Post-card">
                  <div className="postImage2">
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
                    
                      <button>Like</button>
                      <span>{format(fromUnixTime(post.createdAt.seconds),'d/MM/yyyy - h:mm a')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>


          )
        }
        else {
          return (
            <>
            </>
          )
        }

      })}
    </div>
  )
}

export default UserProfilePost