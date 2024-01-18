"use client";

import { useEffect, useState } from "react";
import Login from "../../../components/login/Login";
import Signup from "../../../components/login/Signup";
import AuthContextProvider from "../../../context/AuthContext";
import styles from '@/app/page.module.css';
import Navbar from "../../../components/Navbar";

export default function Home() {
    
  const [view,setView]=useState(true)
 
  return (<>
  <AuthContextProvider>
    <div  className={styles["login-portal-container"]}>
      <div style={{ flexDirection:"column",justifyContent:"center", display:"flex", alignItems:"center"}}>

    {view?(
      <Login/>
      
      ):(<Signup/>)}

<div style={{color:'white',cursor:"pointer"}} onClick={()=>setView(!view)}>{view?"Signup":"Log In"}</div>
      </div>
</div>
  </AuthContextProvider>
  </>);
}
