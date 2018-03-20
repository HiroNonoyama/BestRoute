import * as React from "react";
import * as classNames from "classnames";
import * as FontAwesome from "react-fontawesome";

import * as styles from "../../styles/containers/TextInputArea.scss";
import TextInputWithAutoComplete from "../components/TextInput";

interface Form {
  placeholder: string;
  value: string;
  formattedAddress: string;
}

interface TextInputProps {
  firstForm: Form;
  lastForm: Form;
  form: Form[];
  searchDirection: () => void;
  handleRemoveButton: (index: number, random: number) => void;
  handleInput: (key1: string, key2: string, key3: number) => void;
  handleSearchPress;
  handleAddButton;
}

export default function TextInputArea({
  firstForm,
  lastForm,
  form,
  searchDirection,
  handleRemoveButton,
  handleInput,
  handleSearchPress,
  handleAddButton,
}: TextInputProps) {
  const _pressRemoveButton = (index, random) => {
    const target = document.querySelector(`div[data-index="${random}"]`)
      .classList;
    target.remove(styles.fadeout);
    setTimeout(() => target.add(styles.fadeout), 1);
    handleRemoveButton(index, random);
  };
  return (
    <React.Fragment>
      <div className={classNames(styles.wrap, styles.fadein)}>
        <TextInputWithAutoComplete
          placeholder={firstForm.placeholder}
          label="START"
          value={firstForm.value}
          handleInput={e => handleInput(e.value, e.formattedAddress, -1)}
          handleEnter={searchDirection}
        />
      </div>
      {form.map(({ placeholder, value }, index) => {
        const random = Math.random();
        return (
          <div
            className={classNames(styles.wrap, styles.fadein)}
            key={index}
            data-index={random}
          >
            {form.length > 1 && (
              <a
                className={styles.removeButton}
                onClick={() => _pressRemoveButton(index, random)}
              >
                <FontAwesome name="times-circle" size="lg" />
              </a>
            )}
            <TextInputWithAutoComplete
              placeholder={placeholder}
              label={`VIA${index + 1}`}
              value={value}
              handleInput={e => handleInput(e.value, e.formattedAddress, index)}
              handleEnter={searchDirection}
            />
            {index === form.length - 1 && (
              <button
                className={styles.addButton}
                onClick={handleAddButton}
                id="addButton"
                type="button"
              >
                <FontAwesome name="plus-circle" size="2x" />
              </button>
            )}
          </div>
        );
      })}
      <div className={classNames(styles.wrap, styles.fadein)}>
        <TextInputWithAutoComplete
          placeholder={lastForm.placeholder}
          label="GOAL"
          value={lastForm.value}
          handleInput={e => handleInput(e.value, e.formattedAddress, -2)}
          handleEnter={searchDirection}
        />
      </div>
      <div className={styles.searchButtonWrap}>
        <input
          className={styles.searchButton}
          type="button"
          value="検索"
          onClick={handleSearchPress}
        />
      </div>
    </React.Fragment>
  );
}
