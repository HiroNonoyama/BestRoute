import * as React from "react";
import * as ReactDOM from "react-dom";
import * as FontAwesome from "react-fontawesome";

import * as styles from "../../styles/components/UpButton.scss";

export function UpButton({ handleClick }) {
  return (
    <a className={styles.upButton} onClick={handleClick} role="button">
      <FontAwesome name="chevron-circle-up" size="3x" />
    </a>
  );
}
