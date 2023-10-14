import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { format, fromUnixTime } from "date-fns";
import "./home.css";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function Home({ isAuth }) {
  const [postLists, setPostList] = useState([]);
  const postCollectionRef = collection(db, "posts");

  // code for get post
  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postCollectionRef);
      // firebase data is set to setpostList.
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getPosts();
    //isAuth in array
  }, [isAuth, postCollectionRef]);

  // code for delete post
  const deletePost = async (id) => {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
  };

  const [UserName, setUser] = useState("");
  let [userPostCount, setUserpost] = useState(0);

  useEffect(() => {
    const getUserName = () => {
      if (isAuth === true) {
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
    };
    // if (isAuth === true)
    getUserName();
    // isAuth,postLists in array
  }, [isAuth,UserName,postLists]);

  // like button code
  const [likedPosts, setLikedPosts] = useState([]);

  const handleLike = async (id) => {
    if (isAuth === true) {
      if (!likedPosts.includes(id)) {
        const postRef = doc(db, "posts", id);
        await updateDoc(postRef, {
          likes: increment(1),
        });

        // Update the like count in the local state
        setPostList((prevPosts) =>
          prevPosts.map((post) =>
            post.id === id ? { ...post, likes: post.likes + 1 } : post
          )
        );

        // Add the post ID to the likedPosts state
        setLikedPosts((prevLikedPosts) => [...prevLikedPosts, id]);
      } else {
        alert("you already Like");
      }
    } else {
      toast.warning("Please Login To Like Post");
    }
  };

  return (
    <div className="homePage">
      <h1 className="textWel"> Welcome to Blog website</h1>
      <div className="postcount">
        {isAuth ? (
          <div className="top-right-container">
            <div className="user-post-count">
              <span>
                All Post <br />
                {postLists.length}
              </span>
            </div>
            <div className="user-post-count">
              <span>
                Your Post <br />
                {userPostCount}
              </span>
            </div>
          </div>
        ) : (
          ``
        )}
      </div>

      {postLists.map((post) => {
        return (
          <>
            <div className="card-container">
              <div key={post.id} className="Post-card">
                <div className="postImage2">
                  <img
                    className="postImage"
                    src={post.imageUrl}
                    alt="PostImage"
                  />
                </div>
                <div className="postContant">
                  <h3>{post.title}</h3>
                  <hr />
                  <p>{post.postText}</p>
                </div>
                <div className="postButtons">
                  <div className="userInfo">
                    <i class="fa-regular fa-user"></i>
                    {post.author.name}
                  </div>
                  <div className="PostBtn">
                    {isAuth && post.author.id === auth.currentUser.uid && (
                      <>
                        <button
                          onClick={() => {
                            deletePost(post.id);
                          }}
                        >
                          <i class="fa-solid fa-trash"></i>
                        </button>

                        <button>
                          <Link
                            style={{
                              color: "black",
                              fontSize: "1rem",
                              textAlign: "center",
                            }}
                            to={`/UpdatePost/${post.id}`}
                          >
                            Update
                          </Link>
                        </button>
                      </>
                    )}
                    <button onClick={() => handleLike(post.id)}>
                      Like <b>{post.likes}</b>
                    </button>

                    <span>
                      {format(
                        fromUnixTime(post.createdAt.seconds),
                        "d/MM/yyyy - h:mm a"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
}

export default Home;
