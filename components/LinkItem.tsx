import React, { useState } from "react";
import { ColorPallet, LinkType } from "../types/types";
import styles from "@/app/page.module.css";
type LinkItemProps = {
  link: LinkType;
  theme: ColorPallet;
  demo: Boolean;
  width: number;
};
const LinkItem: React.FC<LinkItemProps> = ({ link, theme, demo, width }) => {
  const [isHover,setIsHovered]=useState(false)
  return (
    <>
     
      <a  id="linkItem"className={styles.linkItem} 
      onMouseEnter={()=>setIsHovered(true)}
      onMouseLeave={()=>setIsHovered(false)}
      style={
       
        {
          
         
        color:theme.text,
        borderColor: theme.text,
        borderWidth:theme.linkStyle=="solid"?"0em":"0.3em",
        backgroundColor: theme.linkStyle=="solid"?theme.link:isHover?theme.link:"",
        maxWidth: demo ? "80em" : "",
        minWidth: width > 800 ? "30em" : "70vw",
        width: width > 800 ? "20em" : "70vw",
      }} href={link.link}>
        {link.name}
      </a>
  </>
  );
};

export default LinkItem;
