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

<p style={{color:'white',}}>{view?"Don't have an account? ":"Have an account? "} <a  onClick={()=>setView(!view)} style={{color:"#3dcbff",cursor:"pointer"}}>{view?"Sign Up":"Login"}</a></p>


      </div>
</div>
  </AuthContextProvider>
  </>);
}
