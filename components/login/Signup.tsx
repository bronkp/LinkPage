import React, { useState } from 'react'
import { useAuthContext } from '../../context/AuthContext'
import styles from '@/app/page.module.css';
import { useRouter } from 'next/navigation';

const Signup:React.FC = () => {
    let context = useAuthContext()
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")
    const router = useRouter()
    const signup = async()=>{

if(password==confirmPassword){
        const { data, error } = await context.client!.auth.signUp({
            email: email,
            password: password,
        })
        console.log(data,error)
    }
      //router.push('/')
    }
  return (
    <div style={{height:"19em"}} className={styles['login-box']}>
        Email
        <input onChange={(e)=>setEmail(e.target.value)} placeholder='email'>
        </input>
        Password
        <input type="password" placeholder='password' onChange={(e)=>setPassword(e.target.value)}>
        </input>
    Confirm Password
        <input type="password" onChange={(e)=>setConfirmPassword(e.target.value)} placeholder='confirm password'>
        </input>
        <button onClick={()=>signup()}>
            Sign Up
        </button>
    </div>
  )
}

export default Signup