import React, { useState, useEffect } from "react";
import { FaComment, FaHeart } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import supabase from "../database/Supabase";
import styles from "./userpost.module.css";
const UserPost = ({ post,id }) => {
  const [img, setimg] = useState();
  const [conform, setconform] = useState(false);
  useEffect(() => {
    if (post) downloadImage(post);
  });
  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage
        .from("test")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setimg(url);
    } catch (error) {
      console.log(error.message);
    }
  }
  async function deletepost(idd){
    try{
      await supabase.from('comments').delete().eq("post_id",idd)
      await supabase.from('zposts').delete().eq("id",idd)
    } 
    catch(error){
      console.log(error)
    }
    finally{
      setconform(false)
    }
  }
  return (
    <div className={styles.box}>
      <div className={styles.postinfo}>
        <div className={styles.likes}>
        <FaHeart size={20}/>
        <span>222</span>
        </div>
        <div className={styles.comments}>
        <FaComment size={20}/>
        <span>154</span>
        </div>
        <div className={styles.delete}>
        <MdDelete onClick={()=>setconform(true)} size={20}/>
        </div>
      </div>
      <img width="100%" height="100%" src={img} alt={post} />

      <div className={styles.conform} style={{display:conform?"flex":"none"}}>
        <button onClick={()=>setconform(false)}>No</button>
        <button onClick={()=>deletepost(id)}>Yes</button>
      </div>
    </div>
  );
};

export default UserPost;
