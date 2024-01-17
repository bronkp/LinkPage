import React from 'react'
import { LinkType } from '../types/types'
import styles from '@/app/page.module.css';
type LinkItemProps ={
    link:LinkType
}
const LinkItem:React.FC<LinkItemProps> = ({link}) => {
  return (
    <div className={styles.linkItem}>

    <a  href={link.link}>{link.name}</a>
    </div>
  )
}

export default LinkItem