import React,{useState,useEffect} from 'react'
import supabase from "../database/Supabase";
import styles from './comment.module.css'
const Comment = ({comment,user_id}) => {
  const [name, setname] = useState('user');
  const[img,setimg]=useState()
  const[url,seturl]=useState()

  async function getprofile() {
    const { data } = await supabase
      .from("users")
      .select()
      .eq("id",user_id)
      .select();
    if (data) {
      setname(data[0].username);
      seturl(data[0].avatar);
    }
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
      console.log(error.message)
    }
  }
  return (
    <div className={styles.box}>
        <div className={styles.img}><img width='100%' height='100%' style={{borderRadius:"50%"}} src={img} alt=''/></div>
        <div className={styles.user}>
            <div className={styles.username}>{name}</div>
            <div className={styles.comment}>{comment}
          </div>
        </div>
    </div>
  )
}

export default Comment