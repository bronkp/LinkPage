import React, { ReactNode } from 'react'
import styles from '@/app/page.module.css'
type Props = {

    children: ReactNode;
    demoTree:boolean;
    width:number
  };
const TreeContainer:React.FC<Props> = ({children,demoTree,width}) => {
  return (
    <div style={{paddingLeft:0,}} className={demoTree?styles.demoContainer:styles.treeContainer}>{children}</div>
  )
}

export default TreeContainer