"use client"
import Image from "next/image";
import styles from "./page.module.css";
import TreeContainer from "../../components/TreeContainer";
import Header from "../../components/Header";
import LinkItem from "../../components/LinkItem";
import SpecialContainer from "../../components/SpecialContainer";
import Special from "../../components/Special";
import Navbar from "../../components/Navbar";
import AuthContextProvider from "../../context/AuthContext";
import { themes } from "../../utils/themes";

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
    theme:themes[0]
  };
  return (
    <>
    <AuthContextProvider>
    <Navbar/>
    <TreeContainer demoTree={false}>
          <div  style={{backgroundColor:tree.theme.runner}} className={styles["tree-runner"]}></div>
          <div style={{top:0,zIndex:"-2",position:"absolute",width:"100vw",height:"100vh", backgroundColor:tree.theme.base}}></div>
          <Header  theme={tree.theme} pfp={tree.pfp} name={tree!.name} />
          <div style={{marginTop:"9em"}}></div>
          {tree?.links.map((link, key) => (
            <LinkItem theme={tree.theme} key={key} link={link} />
          ))}
          <SpecialContainer>
            {tree?.special_links?.map((special, key) => (
              <Special key={key} special={special} />
            ))}
          </SpecialContainer>
        </TreeContainer></AuthContextProvider>
          </>
  );
}
