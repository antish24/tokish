import React, { useEffect, useState } from 'react'
import styles from './App.module.css'
import { Auth } from './store/Context'
import BottomNavBar from './components/BottomNavBar'
import TopNavBar from './components/TopNavBar'
import { useNavigate } from 'react-router-dom'

const App = () => {
  const { currentUser } = Auth();
  const navigate = useNavigate();
  const [userid,setuserid]=useState()
  useEffect(()=>{
    currentUser ?setuserid(currentUser.uid):setuserid('1')
    if(userid==='1'){navigate('/')}
  },[currentUser,navigate,userid])
  return (
    <div>
      <div className={styles.box}>
        <div className={styles.top}>
      <TopNavBar/>
        </div>
        <div className={styles.bottom}>
          <BottomNavBar/>
        </div>
    </div>
    </div>
  )
}

export default App