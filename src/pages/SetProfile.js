import React, { useRef, useState} from 'react'
import { FaPlus, FaTimes } from 'react-icons/fa'
import {useNavigate} from 'react-router-dom'
import {Auth } from '../store/Context'
import supabase from '../database/Supabase'
import styles from './setprofile.module.css'
const SetProfile = () => {
    const navigate=useNavigate()
    const{currentUser}=Auth()
    const[loading,setloading]=useState(false)
    const[error,setError]=useState('Welcome')
    const[color,setcolor]=useState('rgb(0,140,255)')
      const [uploading, setUploading] = useState(false)
      const[avatarurl,setavatarurl]=useState()
      const[file,setfile]=useState()
      const nameRef=useRef()
    const bioRef=useRef()
    const fileRef=useRef()
    async function setprofile(){
      setcolor('rgb(0,140,255)')
        if(nameRef.current.value){
          setloading(true)
          setError('Welcome')
            const { error } = await supabase
            .from('users')
            .insert({ id:currentUser.uid, username:nameRef.current.value,bio:bioRef.current.value===''?' ':bioRef.current.value,avatar:avatarurl })
            if(error)setError(error.message)
            else navigate('/home')
            setloading(false)
        }
        else setError('must have username')
        setcolor('red')
    }
    async function handlefileupload(event) {
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
        setfile(filePath)
      } catch (error) {
        alert(error.message)
      } finally {
        setUploading(false)
      }
    }
    const upload=()=>{
      fileRef.current.click();
    }
    
  return (
  <div className={styles.box}>
    <div className={styles.form}>
      <div className={styles.userimg}><button onClick={upload} disabled={uploading}>{uploading?<FaTimes/>:<FaPlus size={25} color='white'/>}</button><span>{file}</span></div>
    <div className={styles.div}><div>UserName</div><input maxLength='30' ref={nameRef}/></div>
    <div className={styles.div}><div>bio</div><input maxLength='37' ref={bioRef}/></div>
    <button disabled={loading} onClick={setprofile}>{loading?'Uploading':'Upload'}</button>
    <input style={{display:'none'}} type='file' ref={fileRef} onChangeCapture={handlefileupload}/>
    <p style={{color:color}}>{error}</p>
    </div>
  </div>
  )
}

export default SetProfile