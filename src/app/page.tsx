"use client"
import Image from "next/image";
import styles from "./page.module.css";
import TreeContainer from "../../components/TreeContainer";
import Header from "../../components/Header";
import LinkItem from "../../components/LinkItem";
import SpecialContainer from "../../components/SpecialContainer";
import Special from "../../components/Special";
import Navbar from "../../components/Navbar";
import AuthContextProvider, { useAuthContext } from "../../context/AuthContext";
import { themes } from "../../utils/themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CheckUser from "../../components/CheckUser";

export default function Home() {
  const tree = {
    name: "Welcome!",
    links: [
      { name: "Login", link: "/login" },
      { name: "Me", link: "https://rorysaxton.com/" },
      { name: "Demo", link: "/page/Bronkp" }
    ],
    specials: [
      
      
    ],
    special_links:[],
    pfp:"",
    theme:themes[Math.floor(Math.random()*themes.length)]
  };
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){

    const updateWindowDimensions = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
      console.log("updating Width");
    };

    window.addEventListener("resize", updateWindowDimensions);
    updateWindowDimensions()
    return () => window.removeEventListener("resize", updateWindowDimensions) }else{
      setWidth(1920)
    }

  }, []);
  
  return (
    <>
    <AuthContextProvider>
      
      
      
    <TreeContainer width={width} demoTree={false}>
      <CheckUser/>
          <div  style={{backgroundColor:tree.theme.runner}} className={styles["tree-runner"]}></div>
          <div style={{top:0,zIndex:"-2",position:"absolute",width:"100vw",height:"100vh", backgroundColor:tree.theme.base}}></div>
          <Header width={width} demo={true}  theme={tree.theme} pfp={tree.pfp} name={tree!.name} />
          <div style={{marginTop:"16 em",height:"10em"}}></div>
          {tree?.links.map((link, key) => (
            <LinkItem demo={false} width={width} theme={tree.theme} key={key} link={link} />
          ))}
          {/* <SpecialContainer>
            {tree?.special_links?.map((special, key) => (
              <Special key={key} special={special} />
            ))}
          </SpecialContainer> */}
        </TreeContainer></AuthContextProvider>
          </>
  );
}
