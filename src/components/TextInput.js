import React, { Fragment } from "react";

import styles from "../../styles/components/TextInput.scss";

const TextInput = ({ label, placeholder }) => {
  return (
    <Fragment>
      <label className={styles.label} htmlFor={`textInput-{label}`}>
        {label}：
      </label>
      <input
        className={styles.input}
        id={`textInput-${label}`}
        placeholder={placeholder}
      />
    </Fragment>
  );
};

export default TextInput;
