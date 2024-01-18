"use client";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import styles from "@/app/page.module.css";
import { useRouter } from "next/navigation";

const Login: React.FC = () => {
  let context = useAuthContext();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [reset,setReset]=useState(false)
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const[resetError,setResetError] = useState(false)
  const [loading, setLoading] =useState(false)
  const sendPasswordReset = async () => {
    if(email){
    const { data, error } = await context.client!.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: "http://localhost:3000/password_change",
      }
    );
    console.log(data,error)
    if(error){
setResetError(true)
    }else{
      setReset(true)
    }}
  };
  const login = async () => {
    setLoading(true)
    const { data, error } = await context.client!.auth.signInWithPassword({
      email: email,
      password: password,
    });
   if(error){
    setLoginError("Invalid Login")
   }else{
    router.push("/")
   }
   setLoading(false)
  };
  const checkuser = async () => {
    let res = await context.client?.auth.getUser();
    if (res?.data.user) {
      router.push("/");
    }
  };
  useEffect(() => {
    checkuser();
  }, [router]);

  return (
    <>
      <div className={styles["login-box"]}>
        <input
          className={styles["login-input"]}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        ></input>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        ></input>
        <button disabled={loading} onClick={() => login()}>Login</button>
        <button
        disabled={loading||!email}
          onClick={() => {
            sendPasswordReset();
          }}
        >
          Reset Password
        </button>
        {resetError&&
        <p style={{color:"red"}}>Error Resetting Password</p>}

       {reset&& <p>Check Email For Reset Password</p>}
        <p style={{color:"red"}}>{loginError}</p>
      </div>
    </>
  );
};

export default Login;
