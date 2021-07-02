import React, { ReactElement } from "react";
import styles from "./Marquee.module.css";

interface Props {
  delayShorthand: string;
  topShorthand: string;
  url: string;
  text: string;
  direction: "left" | "right";
}

const Marquee = ({ delayShorthand, url, text, topShorthand, direction }: Props): ReactElement => (
    <a className={styles.marquee} href={url} style={{
        animationDelay: delayShorthand,
        top: topShorthand,
        animationDirection: direction === "left" ? "normal" : "reverse",
    }}>{text}</a>
);

export default Marquee;
