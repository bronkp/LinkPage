"use client";
import styles from "./page.module.css";
import TreeContainer from "../../components/TreeContainer";
import LinkItem from "../../components/LinkItem";
import AuthContextProvider from "../../context/AuthContext";
import { themes } from "../../utils/themes";
import { useEffect, useState } from "react";
import CheckUser from "../../components/CheckUser";
import { TreeType } from "../../types/types";

export default function Home() {
  //base tree before color is picked so it's already up
  const [tree, setTree] = useState<TreeType>({
    name: "Welcome!",
    links: [
      { name: "Login", link: "/login" },
      { name: "Example", link: "/page/Bronkp" },
      { name: "About", link: "/about" },
    ],
    special_links: [],
    pfp: "",
    theme: Object.keys(themes)[0],
    url: "",
  });

  const [width, setWidth] = useState(0);

  useEffect(() => {
    //getsview port and device information
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
  }, []);
  useEffect(() => {
    //setting the color themeing
    setTree({
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
          //picks a random theme from the themes object
          Math.floor(Math.random() * Object.keys(themes).length)
        ],
      url: "",
    });
  }, []);
  return (
    <>
      {/* Restrutcted Version of the Tree Component*/}
      {tree && (
        <AuthContextProvider>
          <TreeContainer width={width} demoTree={false}>
            <CheckUser />
            <div
              style={{
                backgroundColor:
                  themes[tree.theme as keyof typeof themes].runner,
              }}
              className={styles["tree-runner"]}
            ></div>
            <div
              style={{
                top: 0,
                zIndex: "-2",
                position: "fixed",
                width: "100vw",
                height: "100%",
                backgroundColor: themes[tree.theme as keyof typeof themes].base,
              }}
            ></div>
            <h1
              style={{
                marginBottom: "0em",
                fontSize: "4em",
                color: themes[tree.theme as keyof typeof themes].headerText,
              }}
            >
              Welcome!
            </h1>
            <div style={{ marginTop: "0em", height: "10em" }}></div>
            {tree?.links.map((link, key) => (
              <LinkItem
                demo={false}
                width={width}
                theme={themes[tree.theme as keyof typeof themes]}
                key={key}
                link={link}
              />
            ))}
          </TreeContainer>
        </AuthContextProvider>
      )}
    </>
  );
}
