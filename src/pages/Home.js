import React, { useState ,useEffect} from "react";
import Post from "../components/Post";
import supabase from "../database/Supabase";
import styles from "./home.module.css";
const Home = () => {
const[post,setpost]=useState([])

  useEffect(() => {
  getpost()
  },[])
  async function getpost() {
    const { data } = await supabase
      .from("zposts")
      .select()
      .order("created_at",{ascending:false})


    if (data) {
      setpost(data)
    }
  }
  

  return (
    <div className={styles.box}>
      <div className={styles.leftnav}></div>
      <div className={styles.postbox}>
        <div className={styles.postmap}>
        {post.map((value,key)=><Post key={key} {...value}/>)}
        </div>

        <div className={styles.zpost}>
          <div className={styles.zimg}></div>
          <div className={styles.zbtns}></div>
        </div>
      </div>
      <div className={styles.rightnav}></div>
    </div>
  );
};

export default Home;
