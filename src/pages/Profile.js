import React, { useState,useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {Auth } from "../store/Context";
import styles from "./profile.module.css";
import supabase from "../database/Supabase";
import { FaArrowUp, FaHeart, FaTimes, } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { RiUserFollowFill } from "react-icons/ri";
import UserPost from "../components/UserPost";
const DashBoard = () => {
  const { currentUser, logout } =Auth(); 
  const[url,seturl]=useState()
  const[img,setimg]=useState()
  const picRef=useRef()
  const [avatarurl,setavatarurl]=useState(url)
  const[uploading,setUploading]=useState(false)
  const[updateing,setupdateing]=useState(false)
  const navigate = useNavigate();
  const [name, setname] = useState('user');
  const [bio,setbio]=useState('')
  const [updatebio,setupdatebio]=useState('')
  const [username,setusername]=useState()
  const [showupdatemenu, setshowupdatemenu] = useState(false);
  const [error, seterror] = useState("");
 
  async function handlelogout() {
    try {
      await logout();
      navigate("/");
    } catch {
      alert("failed to log out");
    }
  }
  async function updateprofile(){
    try {
      setupdateing(true)
      if(username!==''&&updatebio!==''){
        const updates={
          id:currentUser?currentUser.uid:1,
          username:username,
          bio:updatebio,
          avatar:avatarurl
        }
      const {error}=await supabase.from('users').upsert(updates)
      if(error){
        throw error
      }
      else{
        seterror('Profile Updated Succuesfully')
        setupdatebio('')
        setusername('')
      }
      }
      else if(username!==''&&updatebio===''){
        const updates={
          id:currentUser?currentUser.uid:1,
          username:username,
          bio:bio,
          avatar:avatarurl

        }
      const {error}=await supabase.from('users').upsert(updates)
      if(error){
        throw error
      }
      else{
        seterror('Profile Updated Succuesfully')
        setupdatebio('')
        setusername('')
      }
      }
      else if(username===''&&updatebio!==''){
        const updates={
          id:currentUser?currentUser.uid:1,
          username:name,
          bio:updatebio,
          avatar:avatarurl

        }
       
      const {error}=await supabase.from('users').upsert(updates)
      if(error){
        throw error
      }
      else{
        seterror('Profile Updated Succuesfully')
        setupdatebio('')
        setusername('')
      }
      }  
      else if(username===''&&updatebio ===''&& avatarurl !==url){
        const updates={
          id:currentUser?currentUser.uid:1,
          username:name,
          bio:bio,
          avatar:avatarurl

        }
       
      const {error}=await supabase.from('users').upsert(updates)
      if(error){
        throw error
      }
      else{
        seterror('Profile Updated Succuesfully')
        setupdatebio('')
        setusername('')
      }
      }      
      else{seterror("can't update empty value")}
    } catch (error) {
      seterror('error')
    }
    finally{
    setupdateing(false)
    setshowupdatemenu(false)
  }}
  async function getprofile() {
    const { data } = await supabase
      .from("users")
      .select()
      .eq("id", currentUser?currentUser.uid:1)
      .select();
    if (data) {
      setname(data[0].username);
      setbio(data[0].bio);
      seturl(data[0].avatar);
    }
  }

  function closeupdatefun(){
    setshowupdatemenu(false)
    seterror('')
  }
  useEffect(() => {
    if (url) downloadImage(url)
  getprofile()


  })
  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setimg(url)
    } catch (error) {
      seterror(error.message)
    }
  }
  async function uploadpic(event){
    try {
      setUploading(true)
      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`
      let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }
      setavatarurl(filePath)
    } catch (error) {
      seterror(error.message)
    } finally {
      setUploading(false)
      deleteoldpic()
    }
  }
  async function deleteoldpic(){
    
const {error } = await supabase
.storage
.from('avatars')
.remove([`avatars/${url}`])
if(error)console.log(error)
  }
  function upload(){
    picRef.current.click()
  }


  const[post,setpost]=useState([])
  useEffect(() => {
  getpost()
  })
  async function getpost() {
    const { data } = await supabase
      .from("zposts")
      .select()
      .eq('user_id',currentUser.uid)
      .order("created_at",{ascending:false})
    if (data) {
      setpost(data)
    }
  }
  return (
          <div className={styles.box}>
            <div className={styles.logout}>
              <FiLogOut onClick={handlelogout} size={30} />
            </div>
            <div className={styles.header}>
              <div className={styles.userimg}><img width='100%' height='100%' src={img} alt=''/></div>
              <div className={styles.username}>{name}</div>
              <div className={styles.userbio}>
               {bio}
              </div>
            </div>
            <div className={styles.body}>
              <div className={styles.likes}>
                <FaHeart size={20} /> likes
              </div>
              <div className={styles.following}>
                <RiUserFollowFill size={20} /> following
              </div>
              <div className={styles.followers}>
                <RiUserFollowFill size={20} /> followers
              </div>
            </div>
            <div className={styles.updateprofile}>
              <button onClick={()=>setshowupdatemenu(true)}>Update Profile</button>
              <div className={styles.zupdates} style={{height:showupdatemenu?'100vh':'0'}}>
                <div className={styles.closeupdate} style={{display:showupdatemenu?'block':'none'}} onClick={closeupdatefun}><FaTimes size={30}/></div>
                
                <div className={styles.updateinputs} style={{display:showupdatemenu?'block':'none'}}>
                <div className={styles.updateimg}>
        <button onClick={upload} disabled={uploading}><img src={img} alt='+' width='100%' height='100%' style={{borderRadius:'50%'}}/></button>
        <div className={styles.uploadinganimation}>{uploading?<FaArrowUp size={30} color={'rgb(0,140,255)'} />:''}</div>
        </div>
                  <p>UserName</p><input value={username} maxLength='30'  placeholder={name} onChange={e=>setusername(e.target.value)}/>
                  <p>Bio</p><input style={{width:'300px'}} maxLength='37'  placeholder={bio}  onChange={e=>setupdatebio(e.target.value)} value={updatebio}/>
                  <input
          type="file"
          ref={picRef}
          onChangeCapture={uploadpic}
          accept="image/*"
          style={{display:'none'}}
        />
                  <button disabled={updateing || uploading} onClick={updateprofile}>{updateing ?'Updating':'Update'}</button>
                  <p>{error}</p>
                </div>
              </div>
            </div>
            <div className={styles.footer}>
            {post.map((i,k)=><UserPost key={k} {...i}/>)}
              
            </div>
            <div className={styles.zpost}>
            <div className={styles.card}>
                  <div className={styles.cardinfo}></div>
                  <div className={styles.cardimg}></div>
                </div>
                <div className={styles.card}>
                  <div className={styles.cardinfo}></div>
                  <div className={styles.cardimg}></div>
                </div>
                <div className={styles.card}>
                  <div className={styles.cardinfo}></div>
                  <div className={styles.cardimg}></div>
                </div>
                <div className={styles.card}>
                  <div className={styles.cardinfo}></div>
                  <div className={styles.cardimg}></div>
                </div>
              </div>
          </div>
  );
};

export default DashBoard;
