import React, { ReactNode } from 'react'
type Props ={
  children:ReactNode;
}
const SpecialContainer:React.FC<Props> = ({children}) => {
  return (
    <div>{children}</div>
  )
}

export default SpecialContainer