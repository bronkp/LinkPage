import React from 'react'
import styles from '@/app/page.module.css';
import { ColorPallet } from '../types/types';
type HeaderProps = {
    name:string
    pfp:string
    theme:ColorPallet
    demo:Boolean
}
const Header:React.FC<HeaderProps> = ({name,pfp,theme,demo}) => {
  return (
    <>
    <div style={{backgroundColor:theme.headerBack}} className={styles.header}>{name}</div>
    {pfp&&<div className={styles.pfp} style={{backgroundImage:`url(${pfp})`,marginTop:demo?"0em":"10em"}}></div>}
    </>

  )
}

export default Header