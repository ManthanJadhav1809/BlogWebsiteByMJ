import React, { useState, useEffect } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db, storage } from '../firebase-config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {v4} from "uuid";
import "./CreatePost.css";

function CreatePost({ isAuth }) {
  const [title, setTitle] = useState('');
  const [postText, setPostText] = useState('');
  const [image, setImage] = useState(null); // Store the image file
  
  const postCollectionRef = collection(db, 'posts');
  let navigate = useNavigate();

  const createPost = async (e) => {
    e.preventDefault();

    if (title === '' || postText === '' || !image) {
      toast.warning('Please fill in all fields and select an image.');
    } else {
      try {
        // Upload the image to Firebase Cloud Storage
        const imageRef = ref(storage, `images/${image.name +v4()}`);
        await uploadBytes(imageRef, image);
        
        // Get the download URL of the uploaded image
        const imageUrl = await getDownloadURL(imageRef);

        // Add the post to Firestore with the image URL
        await addDoc(postCollectionRef, {
          title,
          postText,
          imageUrl,
          createdAt: serverTimestamp(),
          author: {
            name: auth.currentUser.displayName,
            email: auth.currentUser.email,
            id: auth.currentUser.uid,
          },
        });

        toast.success('Post Submitted Successfully');
        console.log('Post added to Firestore');
        navigate('/');
      } catch (error) {
        console.error('Error uploading image and adding post:', error);
        toast.error('An error occurred while creating the post.');
      }
    }
  };

  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
    }
    // eslint-disable-next-line
  }, [isAuth]);

  return (
    <div className='createPost'>
      <form className="createPostForm">
        <div className="inputGp">
          <label>Title</label>
          <input placeholder="Title..." onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="inputGp">
          <label>Post :</label>
          <textarea placeholder="Post..." cols="30" rows="10" onChange={(e) => setPostText(e.target.value)}></textarea>
        </div>
        <div className="inputGp">
          <label>Image :</label>
          <input
            style={{ backgroundColor: 'white' }}
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <div>
          <button className='postBtn' onClick={createPost}>Submit Post</button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
