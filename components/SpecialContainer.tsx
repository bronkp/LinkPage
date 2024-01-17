import React, { ReactNode } from 'react'
type Props ={
  children:ReactNode;
}
const SpecialContainer:React.FC<Props> = ({children}) => {
  return (
    <div style={{position:"absolute",bottom:"3em"}}>{children}</div>
  )
}

export default SpecialContainer