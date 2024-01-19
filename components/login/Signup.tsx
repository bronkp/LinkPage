import React, { useState } from 'react'
import { useAuthContext } from '../../context/AuthContext'
import styles from '@/app/page.module.css';
import { useRouter } from 'next/navigation';
import { themes } from '../../utils/themes';

const Signup:React.FC = () => {
    let context = useAuthContext()
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")
    const [message,setMessage]=useState(false)
    const [accountError,setAccountError]=useState(false)
    const router = useRouter()
    
    const signup = async()=>{

if(password==confirmPassword){
        const { data, error } = await context.client!.auth.signUp({
            email: email,
            password: password,
        })
        if(!error){
  setEmail("")
  setPassword("")
  setConfirmPassword("")
  setMessage(true)
  setAccountError(false)

}else{
  setAccountError(true)
  setMessage(false)
        }
    }
     // router.push('/')
    }
  return (
    <div style={{height:accountError||message?"22em":"20em"}} className={styles['login-box']}>
        Email
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='email'>
        </input>
        Password
        <input value={password} type="password" placeholder='password' onChange={(e)=>setPassword(e.target.value)}>
        </input>
    Confirm Password
        <input value={confirmPassword} type="password" onChange={(e)=>setConfirmPassword(e.target.value)} placeholder='confirm password'>
        </input>
        {accountError&&<p style={{color:"red"}}>Error Creating Account</p>}
        {message&&<p >Check Email to Confirm Account</p>}
        <button style={{paddingTop:"0.5em",paddingBottom:"1em"}} onClick={()=>signup()}>
            Sign Up
        </button>
    </div>
  )
}

export default Signup