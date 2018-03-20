import * as React from "react";

import * as styles from "../../styles/components/TextInput.scss";
import WithAutoComplete from "./WithAutoComplete";

const ENTER_CHAR_CODE = 13;

interface textInputProps {
  label: string;
  value: string;
  placeholder: string | undefined;
  randomId: number;
  autoComplete: (value: string) => void;
  handleInput: (obj: { value: string; formattedAddress: string }) => void;
  handleEnter: () => void;
}

const TextInput = ({
  label,
  value,
  placeholder,
  randomId,
  autoComplete,
  handleInput,
  handleEnter = () => {},
}: textInputProps) => {
  return (
    <React.Fragment>
      <label className={styles.label} htmlFor={`textInput-{label}`}>
        {label}
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
    </React.Fragment>
  );
};

export default WithAutoComplete(TextInput);
