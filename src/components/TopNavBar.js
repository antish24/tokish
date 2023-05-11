import React from 'react'
import { NavLink} from 'react-router-dom'
import styles from './topnavbar.module.css'
import Signin from '../pages/Signin'
import {Route, Routes } from 'react-router-dom'
import {FaPlus, FaBoxOpen,FaMailBulk, FaSearch} from 'react-icons/fa'
import Home from '../pages/Home'
import Upload from '../pages/Upload'
import Inbox from '../pages/Inbox'
import Setting from '../pages/Setting'
import Profile from '../pages/Profile'
import Page404 from '../pages/Page404'
import SetProfile from '../pages/SetProfile'
import { Auth } from '../store/Context'
const TopNavBar = () => {
  const {currentUser}=Auth()
  return (
    <div>
        <div className={styles.box}>
            <NavLink to='/home'><div className={styles.logo}>TOKISH</div></NavLink>
            <div className={styles.search} style={{display: currentUser ?'block':'none'}}>
              <input placeholder='Search...'/>
              <div className={styles.searchicon}><FaSearch/></div>
            </div>
            <div className={styles.links}>
            <NavLink to='/upload'><button>Upload <FaPlus/> </button></NavLink>
            <NavLink to='/inbox'><FaMailBulk size={25}/></NavLink>
            <NavLink to='/setting'>< FaBoxOpen size={25}/></NavLink>
            <NavLink to='/profile'><div className={styles.profilemenu}></div></NavLink>
            </div>
        </div>
        <Routes>
            <Route path='/' element={<Signin/>}/>
            <Route path='/home' element={<Home/>}/>
            <Route path='/inbox' element={<Inbox/>}/>
            <Route path='/upload' element={<Upload/>}/>
            <Route path='/setting' element={<Setting/>}/>
            <Route path='/setProfile' element={<SetProfile/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/*' element={<Page404/>}/>
        </Routes>
    </div>
  )
}

export default TopNavBar