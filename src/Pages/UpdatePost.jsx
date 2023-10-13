import {  doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import React, { useState,useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase-config";
import { toast } from "react-toastify";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import "./CreatePost.css";

export default function UpdatePost() {
  const { postId } = useParams();
  
  const [title, setTitle] = useState('');
  const [postText, setPostText] = useState('');
  const [image,setImage]=useState(null);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postDoc = doc(db, "posts", postId);
        const postData = await getDoc(postDoc);

        if (postData.exists()) {
          const postDataObject = postData.data();
          setTitle(postDataObject.title);
          setPostText(postDataObject.postText);
        } else {
          toast.error("post not found");
        }
      } catch (error) {
        toast.error("Error loading post data: " + error.message);
      }
    };
    fetchPostData();
  }, [postId]);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const updateData = async (e) => {
    e.preventDefault();
    try {
      if (image) {
        // Upload the new image to Firebase Storage
        const storage = getStorage();
        const imageRef = ref(storage, `images/${postId}`);
        await uploadBytes(imageRef, image);

        // Get the URL of the uploaded image
        const imageUrl = await getDownloadURL(imageRef);

        // Update the post data in Firebase with the new image URL
        await updateDoc(doc(db, "posts", postId), {
          title: title,
          postText: postText,
          imageUrl: imageUrl, // Include the image URL in the post data
          createdAt: serverTimestamp(),
        });

        toast.success("Post updated successfully");
        navigate("/");
      } else {
        // If no image is selected, update the post without changing the image
        await updateDoc(doc(db, "posts", postId), {
          title: title,
          postText: postText,
          createdAt: serverTimestamp(),
        });

        toast.success("Post updated successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error("Error updating post: " + error.message);
    }
  };
  return (
    <div className='createPost'>
      <h2>Update Post</h2>
      <form className="createPostForm">
        <div className="inputGp">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="inputGp">
          <label>Description:</label>
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          />
        </div>
        <div className="inputGp">
          <label>Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <button className='postBtn' onClick={updateData}>Update Data</button>
      </form>
    </div>
  );
}

