import React from 'react'
import { ColorPallet, LinkType } from '../types/types'
import styles from '@/app/page.module.css';
type LinkItemProps ={
    link:LinkType;
    theme:ColorPallet;
    demo:Boolean;
    width:number;
}
const LinkItem:React.FC<LinkItemProps> = ({link,theme,demo,width}) => {
  return (
    <div style={{backgroundColor:theme.link, maxWidth:demo?"80em":"",minWidth:width>800?"40em":"70vw",width:width>800?"20em":"70vw"}}className={styles.linkItem}>
     
    <a style={{color:theme.text}}  href={link.link}>{link.name}</a>
    </div>
  )
}

export default LinkItem