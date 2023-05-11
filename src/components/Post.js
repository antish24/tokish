import React, { useState, useEffect, useRef } from "react";
import styles from "./post.module.css";
import Comment from "./Comment";
import { FaComment, FaHeart, FaPlus, FaShare, FaTimes } from "react-icons/fa";
import { Auth } from "../store/Context";
import supabase from "../database/Supabase";
import { MdSend } from "react-icons/md";
const Post = ({ post, id, user_id }) => {
  const [showcomment, setshowcomment] = useState(false);
  const { currentUser } = Auth();
  const [img, setimg] = useState();
  const [userimg, setuserimg] = useState();
  const [placeholder, setplaceholder] = useState(true);
  const [commenting, setcommenting] = useState(false);
  const commentRef = useRef();
  const [msg, setmsg] = useState([]);
  const [zuser, setzuser] = useState([]);

  useEffect(() => {
    if (post) downloadImage(post);
    if (zuser.avatar) downloadUserImage(zuser.avatar);
    getcomment();
    getuser();
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
  async function comment(id) {
    try {
      setcommenting(true);
      if (commentRef.current.value) {
        const { error } = await supabase
          .from("comments")
          .insert({
            post_id: id,
            comment: commentRef.current.value,
            user_id: currentUser.uid,
          });
        if (error) console.log(error.message);
        else {
          commentRef.current.value = null;
        }
      } else {
        setplaceholder(false);
      }
    } finally {
      setcommenting(false);
      commentRef.current.value = null;
    }
  }
  async function getcomment() {
    const { data } = await supabase
      .from("comments")
      .select()
      .eq("post_id", id)
      .select()
      .order("created_at", { ascending: false });
    if (data) {
      setmsg(data);
    }
  }
  async function getuser() {
    const { data } = await supabase
      .from("users")
      .select()
      .eq("id", user_id)
      .select()
      .single();
    if (data) {
      setzuser(data);
    }
  }

  async function downloadUserImage(path) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setuserimg(url);
    } catch (error) {
      console.log(error.message);
    }
  }
  const enterkey=(e)=>{
    if(e.key==="Enter"){
      comment(id) 
    }
  }
  return (
    <div className={styles.box}>
      <div className={styles.userinfo}>
        <div className={styles.userimg}>
          <img
            width="100%"
            height="100%"
            style={{ borderRadius: "50%" }}
            src={userimg}
            alt=""
          />
        </div>
        <div className={styles.username}>{zuser.username}</div>
        <div className={styles.follow}>
          <FaPlus size={20} />
        </div>
      </div>
      <div className={styles.postimg} onClick={() => setshowcomment(false)}>
        <img src={img} alt="" />
      </div>
      <div className={styles.postbtns}>
        <FaHeart size={30} />
        <FaComment size={30} onClick={() => setshowcomment(true)} />
        <FaShare size={30} />
      </div>
      <div
        className={styles.commentbox}
        style={{ height: showcomment ? "90%" : 0 }}
      >
        <div
          className={styles.header}
          style={{ display: showcomment ? "flex" : "none" }}
        >
          <p>comments</p>
          <span style={{cursor:'pointer'}}>
            <FaTimes onClick={() => setshowcomment(false)} size={20} />
          </span>
        </div>
        <div
          className={styles.body}
          style={{ display: showcomment ? "flex" : "none" }}
        >
          <div className={styles.commentmap}>
            {msg.map((k, i) => (
              <Comment key={i} {...k} />
            ))}
          </div>
          <div className={styles.nocomment}>Be The First to Comment</div>
        </div>
        <div
          className={styles.footer}
          style={{ display: showcomment ? "flex" : "none" }}
        >
          <input
            ref={commentRef}
            placeholder={placeholder ? "Comment..." : "Comment First..."}
            maxLength={160}
            onKeyDown={enterkey}
          />

          <button
            onClick={() => comment(id)}
            disabled={commenting}
            className={styles.commentbtn}
          >
            <MdSend size={25} color="rgb(0,140,255)" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
