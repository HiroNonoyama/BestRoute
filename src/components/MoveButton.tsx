import * as React from "react";
import * as ReactDOM from "react-dom";
import * as FontAwesome from "react-fontawesome";

import * as styles from "../../styles/components/MoveButton.scss";

export function MoveButton({ handleTopClick, handleBottomClick }) {
  return (
    <React.Fragment>
      <a className={styles.upButton} onClick={handleTopClick} role="button">
        <FontAwesome
          name="chevron-circle-up"
          size="2x"
          className={styles.icon}
        />
      </a>
      <a
        className={styles.downButton}
        onClick={handleBottomClick}
        role="button"
      >
        <FontAwesome
          name="chevron-circle-down"
          size="2x"
          className={styles.icon}
        />
      </a>
    </React.Fragment>
  );
}
