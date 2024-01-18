import React, { ReactNode } from "react";
import { SpecialType } from "../types/types";
import { FaYoutube, FaInstagram, FaTwitch } from "react-icons/fa";
import styles from "@/app/page.module.css";
import { IconType } from "react-icons";
type SpecialProps = {
  special: SpecialType;
};
interface Icons {
  [name: string]: ReactNode;
}
const Special: React.FC<SpecialProps> = ({ special }) => {
  let fontSize = "4em";
  let icons: Icons = {
    Instagram: <FaInstagram fontSize={fontSize} />,
    Twitch: <FaTwitch fontSize={fontSize} />,
  };
  return (
    <a className={styles.specialIcon} href={special.link}>
      {icons[special.type]}
    </a>
  );
};

export default Special;
