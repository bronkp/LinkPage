import React from "react";
import styles from "@/app/page.module.css";
import { themes } from "../../../../utils/themes";
//allows the color pressed to effect the theme state
type ColorPickerProps = {
  pickColor: any;
};
const ColorPicker: React.FC<ColorPickerProps> = ({ pickColor }) => {
  return (
    <div className={styles["color-picker"]}>
      {/* maps through all the themes to display a button for each */}
      {Object.keys(themes).map((theme, key) => (
        <div
          key={key}
          onClick={() => pickColor(theme)}
          style={{
            display: "flex",
            justifyContent: "center",
            borderRadius: "100%",
            margin: "1em",
            alignItems: "center",
            width: "2em",
            height: "2em",
            backgroundColor: "white",
          }}
        >
          <div
            style={{
              borderWidth: "1em",
              borderColor: "white",
              borderRadius: "100%",
              backgroundColor: themes[theme as keyof typeof themes].demo,
              width: "1.4em",
              height: "1.4em",
            }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default ColorPicker;
