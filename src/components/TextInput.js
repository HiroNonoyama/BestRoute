import React, { Fragment } from "react";

import styles from "../../styles/components/TextInput.scss";
import WithAutoComplete from "../containers/WithAutoComplete";

const TextInput = ({ label, placeholder, randomId, autoComplete }) => {
  return (
    <Fragment>
      <label className={styles.label} htmlFor={`textInput-{label}`}>
        {label}：
      </label>
      <input
        className={styles.input}
        id={`textInput-${label}`}
        placeholder={placeholder}
        onChange={e => autoComplete(e.target.value)}
        data-input={randomId}
      />
    </Fragment>
  );
};

export default WithAutoComplete(TextInput);
