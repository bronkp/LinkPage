"use client";
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
import { TreeType } from "../../types/types";

export default function Home() {
  const [tree,setTree]= useState<TreeType>()
  
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      const updateWindowDimensions = () => {
        const newWidth = window.innerWidth;
        setWidth(newWidth);
      };

      window.addEventListener("resize", updateWindowDimensions);
      updateWindowDimensions();
      return () => window.removeEventListener("resize", updateWindowDimensions);
    } else {
      setWidth(1920);
    }
    
   setTree ({
      name: "Welcome!",
      links: [
        { name: "Login", link: "/login" },
        { name: "Example", link: "/page/Bronkp" },
        { name: "About", link: "/about" },
      ],
      special_links: [],
      pfp: "",
      theme:
        Object.keys(themes)[
          Math.floor(Math.random() * Object.keys(themes).length)
          
        ],url:""
    });

  }, []);

  return (
    <>
    
    {/* Basically the tree component but was easier to build a custom version for home screen purposes */}
     {tree&&
      <AuthContextProvider>
        <TreeContainer width={width} demoTree={false}>
          <CheckUser />
          <div
            style={{
              backgroundColor: themes[tree.theme as keyof typeof themes].runner,
            }}
            className={styles["tree-runner"]}
          ></div>
          <div
            style={{
              top: 0,
              zIndex: "-2",
              position: "absolute",
              width: "100vw",
              height: "100vh",
              backgroundColor: themes[tree.theme as keyof typeof themes].base,
            }}
          ></div>
          <Header
            width={width}
            demo={true}
            theme={tree.theme}
            pfp={tree.pfp}
            name={tree!.name}
          />
          <div style={{ marginTop: "16 em", height: "10em" }}></div>
          {tree?.links.map((link, key) => (
            <LinkItem
              demo={false}
              width={width}
              theme={themes[tree.theme as keyof typeof themes]}
              key={key}
              link={link}
            />
          ))}
          {/* <SpecialContainer>
            {tree?.special_links?.map((special, key) => (
              <Special key={key} special={special} />
            ))}
          </SpecialContainer> */}
        </TreeContainer>
      </AuthContextProvider>}
    </>
  );
}
