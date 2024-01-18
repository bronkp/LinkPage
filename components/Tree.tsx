"use client";
import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { tree } from "next/dist/build/templates/app-page";
import Header from "./Header";
import LinkItem from "./LinkItem";
import Special from "./Special";
import SpecialContainer from "./SpecialContainer";
import TreeContainer from "./TreeContainer";
import { ColorPallet, TreeType } from "../types/types";
import Navbar from "./Navbar";
import styles from '@/app/page.module.css';
type TreeProps = {
  demo?: TreeType;
  setTheme?:React.SetStateAction<ColorPallet>;
};
const Tree: React.FC<TreeProps> = ({ demo,setTheme }) => {
  const [tree, setTree] = useState<TreeType>();
  
  const [loading, setLoading] = useState(true);
  const [pfp, setPFP] = useState("");
  let context = useAuthContext();
  const params = useParams();
  const { uid } = params;
  const colorful = {
    base:"#CE5374",
    text:"white",
    link:"#9C0D38",
    runner:"#DDF0FF"
  }
  const tangerine = {
    base:"#EFECCA",
    text:"black",
    link:"#F7FF58",
    runner:"#FF934F",
    headerBack:"#5E565A"
  }
  const blau = {
    base:"#4C7081",
    text:"white",
    link:"#385F71",
    runner:"#F5F0F6",
    headerBack:"#2B4162"
  }
  const pink ={
    base:"#D99AC5",
    text:"white",
    link:"#7FE3FF",
    runner:"#DCCDE8",
    headerBack:"#B37BA4"
  }
  const green = {
    base:"#5DA28C",
    text:"white",
    link:"#484349",
    runner:"#F7F0F0",
    headerBack:"#109648"
  }
  const fetchData = async () => {
    try {
      //@ts-ignore
      const { data, error } = await context.client
        .from("TreePages")
        .select()
        .eq("url", uid);
      let newTree = data[0];
      let url = context.client?.storage
        .from("tree-pfps")
        .getPublicUrl(newTree?.pfp!);
      newTree.pfp = url?.data.publicUrl;
      setTree(newTree);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (demo) {
      setLoading(false);

      let edittedDemo = { ...demo };
      setTree(edittedDemo);
      setLoading(false);
    } else {
      fetchData();
    }

    console.log(demo);
  }, []);
  let theme = green
  const themes = []
  useEffect(() => {
    setTree(demo);
  }, [demo]);
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
      {!demo&&<Navbar theme={theme}/>}
      {!loading && (
        <TreeContainer width={width} demoTree={demo ? true : false}>
          <div  style={{backgroundColor:tree.theme.runner}} className={styles["tree-runner"]}></div>
          <div style={{top:0,zIndex:"-2",position:"fixed",width:width>800||width<600?"100vw":"100%",height:width>800||width<600?"100vh":"100%", backgroundColor:tree.theme.base}}></div>
          <Header width={width} demo={demo?true:false}  theme={tree.theme} pfp={tree.pfp} name={tree!.name} />
          

          {tree?.links.map((link, key) => (
            <LinkItem width={width} demo={demo?true:false} theme={tree.theme} key={key} link={link} />
            ))}
           
          <SpecialContainer>
            {tree?.special_links?.map((special, key) => (
              <Special key={key} special={special} />
            ))}
          </SpecialContainer>
        </TreeContainer>
      )}
    </>
  );
};

export default Tree;
