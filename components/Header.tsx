import React from 'react'
import styles from '@/app/page.module.css';
import { ColorPallet } from '../types/types';
type HeaderProps = {
    name:string
    pfp:string
    theme:ColorPallet
}
const Header:React.FC<HeaderProps> = ({name,pfp,theme}) => {
  return (
    <>
    <div style={{backgroundColor:theme.headerBack}} className={styles.header}>{name}</div>
    {pfp&&<div className={styles.pfp} style={{backgroundImage:`url(${pfp})`}}></div>}
    </>

  )
}

export default Header