import React from 'react'
import styles from '@/app/page.module.css';
type HeaderProps = {
    name:string
    pfp:string
}
const Header:React.FC<HeaderProps> = ({name,pfp}) => {
  return (
    <>
    <div className={styles.header}>{name}</div>
    {pfp&&<div className={styles.pfp} style={{backgroundImage:`url(${pfp})`}}></div>}
    </>

  )
}

export default Header