import React, { useEffect } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { useRouter } from 'next/navigation';
import { themes } from '../utils/themes';
import { User } from '@supabase/supabase-js';

const CheckUser:React.FC = () => {
  let router = useRouter()
  let context = useAuthContext()
  const createPage = async(user:User) => {
    console.log(user,'user')
    let supa = context.client;
   let res= await supa
      ?.from("TreePages")
      .insert({
        name: "",
        special_links: [],
        links: [],
        url: user?.id,
        pfp:user?.id+"/pfp.png",
        email:user?.email,
        theme:"green"
      });
console.log(res)


//router.push("/update")
  };
    const getPage = async()=>{
        let user = await context.client?.auth.getUser()  
        console.log(user)
          if(user?.data.user){
            let page = await context.client?.from("TreePages").select().eq("email",user.data.user.email)
          
            page?.data?.[0]?.url&&router.push(`/page/${page?.data?.[0]?.url}`)
        console.log(page)  
        if( !page?.data?.[0]?.url){
await createPage(user?.data.user)
router.push(`/page/${user.data.user.id}`)
        }
        }
    }
    useEffect(()=>{

        getPage()
      },[])
  return (
    <></>
  )}


export default CheckUser