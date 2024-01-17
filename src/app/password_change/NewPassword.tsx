import React, { useState } from 'react'
import { useAuthContext } from '../../../context/AuthContext'

const NewPassword:React.FC = () => {
    const [password,setPassword]=useState("")
    const context = useAuthContext()
    const changePassword = async()=>{
        const { data, error } = await context.client!.auth.updateUser({

            password: password
          
          })
    }
  return (
    <>
    <input onChange={(e)=>setPassword(e.target.value)}/>
    <button onClick={()=>changePassword()}>submit</button>
    </>
  )
}

export default NewPassword