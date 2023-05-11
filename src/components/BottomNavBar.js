import React from 'react'
import { NavLink} from 'react-router-dom'
import styles from './bottomnavbar.module.css'
import { AiFillHome, AiFillSetting } from 'react-icons/ai'
import { MdForwardToInbox, MdPerson } from 'react-icons/md'
import Signin from '../pages/Signin'
import {Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Upload from '../pages/Upload'
import Inbox from '../pages/Inbox'
import Setting from '../pages/Setting'
import Profile from '../pages/Profile'
import Page404 from '../pages/Page404'
import SetProfile from '../pages/SetProfile'
import { FaPlus } from 'react-icons/fa'

const TopNavBar = () => {
  return (
    <div>
       <Routes>
            <Route path='/' element={<Signin/>} />
            <Route path='/home' element={<Home/>} />
            <Route path='/inbox' element={<Inbox/>} />
            <Route path='/upload' element={<Upload/>} />
            <Route path='/setting' element={<Setting/>} />
            <Route path='/setProfile' element={<SetProfile/>} />
            <Route path='/profile' element={<Profile/>} />
            <Route path='/*' element={<Page404/>} />
        </Routes>
        <div className={styles.box}>
            <div className={styles.iconlinks}>
            <NavLink to='/home'><span className={styles.linkicons}><AiFillHome  size={30}/></span></NavLink>
            <NavLink to='/inbox'><span className={styles.linkicons}><MdForwardToInbox size={30}/></span></NavLink>
            <NavLink to='/upload'><span className={styles.linkicons}><FaPlus size={30}/></span></NavLink>
            <NavLink to='/setting'><span className={styles.linkicons}><AiFillSetting size={30}/></span></NavLink>
            <NavLink to='/profile'><span className={styles.linkicons}><MdPerson size={30}/></span></NavLink>
            </div>

        </div>
    </div>
  )
}

export default TopNavBar