import React from "react";
import classNames from "classnames";

import TextInput from "../components/TextInput";
import styles from "../../styles/containers/Search.scss";

class Search extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      form: ["Tokyo tower"],
    };
    this._handleAddButton = this._handleAddButton.bind(this);
  }

  _handleAddButton() {
    const { form } = this.state;
    this.setState({ form: [...form, ""] });
  }

  _handleRemoveButton(index) {
    const { form } = this.state;
    const nextForm = form.filter((_, i) => i !== index);
    this.setState({ form: nextForm });
  }

  render() {
    const { form } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.wrap}>
          <TextInput placeholder="Tokyo station" label="START" />
        </div>
        {form.map((placeholder, index) => (
          <div className={styles.wrap}>
            {form.length > 1 && (
              <a
                className={styles.removeButton}
                onClick={() => this._handleRemoveButton(index)}
              >
                ✕
              </a>
            )}
            <TextInput placeholder={placeholder} label={`VIA${index + 1}`} />
            {index === form.length - 1 && (
              <a className={styles.addButton} onClick={this._handleAddButton}>
                ＋
              </a>
            )}
          </div>
        ))}
        <div className={styles.wrap}>
          <TextInput placeholder="Yokohama station" label="GOAL" />
        </div>
      </div>
    );
  }
}

export default Search;
