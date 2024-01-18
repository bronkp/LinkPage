import React from 'react'
import styles from '@/app/page.module.css';
import { themes } from '../../../../utils/themes';
type ColorPickerProps ={
    pickColor:any,
}
const ColorPicker:React.FC = ({pickColor}) => {
  return (
 
  <div className={styles["color-picker"]}>
{themes.map((theme)=>(
    <div onClick={()=>pickColor(theme)} style={{display:"flex",justifyContent:"center",borderRadius:"100%",margin:"1em", alignItems:"center" , width:"2em",height:"2em", backgroundColor:"white"}}>

    <div style={{borderWidth:"1em",borderColor:"white",borderRadius:"100%",backgroundColor:theme.demo,width:"1.4em",height:"1.4em", }}>
        
    </div>
    </div>
))}
  </div>
  
  )
}

export default ColorPicker