import React, { Fragment } from "react";

import styles from "../../styles/components/TextInput.scss";
import WithAutoComplete from "../containers/WithAutoComplete";

const ENTER_CHAR_CODE = 13;

const TextInput = ({
  label,
  value,
  placeholder,
  randomId,
  autoComplete,
  handleInput,
  handleEnter = () => {},
}) => {
  return (
    <Fragment>
      <label className={styles.label} htmlFor={`textInput-{label}`}>
        {label}：
      </label>
      <input
        className={styles.input}
        id={`textInput-${label}`}
        placeholder={placeholder}
        onChange={e => {
          handleInput({ value: e.target.value, formattedAddress: "" });
          autoComplete(e.target.value);
        }}
        data-input={randomId}
        value={value}
        onKeyPress={e => {
          if (e.charCode === ENTER_CHAR_CODE) handleEnter();
        }}
      />
    </Fragment>
  );
};

export default WithAutoComplete(TextInput);
