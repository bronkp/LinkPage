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
    pfp:""
  };
  return (
    <>
    <AuthContextProvider>
    <Navbar/>
    <TreeContainer  demoTree={false}>
      <Header pfp={""} name={tree.name} />
      {tree.links.map((link) => (
        <LinkItem link={link} />
        ))}
      <SpecialContainer>
        {tree.specials.map((special)=>(
          <Special special={special}/>
          ))}
      </SpecialContainer>
    </TreeContainer></AuthContextProvider>
          </>
  );
}
