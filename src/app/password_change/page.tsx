"use client";

import { useState } from "react";
import Login from "../../../components/login/Login";
import Signup from "../../../components/login/Signup";
import AuthContextProvider from "../../../context/AuthContext";
import NewPassword from "./NewPassword";
import Navbar from "../../../components/Navbar";

export default function Home() {
    
 
 
  return (<>
  <AuthContextProvider>
  <Navbar/>
   <NewPassword/>

  </AuthContextProvider>
  </>);
}
