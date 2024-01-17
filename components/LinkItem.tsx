import React from 'react'
import { ColorPallet, LinkType } from '../types/types'
import styles from '@/app/page.module.css';
type LinkItemProps ={
    link:LinkType;
    theme:ColorPallet;
}
const LinkItem:React.FC<LinkItemProps> = ({link,theme}) => {
  return (
    <div style={{backgroundColor:theme.link}}className={styles.linkItem}>

    <a style={{color:theme.text}}  href={link.link}>{link.name}</a>
    </div>
  )
}

export default LinkItem