import React from "react";
import classNames from "classnames";
import FontAwesome from "react-fontawesome";

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

  _handleRemoveButton(index, random) {
    const { form } = this.state;
    const nextForm = form.filter((_, i) => i !== index);
    const target = document.querySelector(`div[data-index="${random}"]`)
      .classList;
    target.remove(styles.fadeout);
    setTimeout(() => target.add(styles.fadeout), 20);
    setTimeout(() => {
      this.setState({ form: nextForm });
    }, 300);
  }

  render() {
    const { form } = this.state;

    return (
      <div className={styles.container}>
        <div className={classNames(styles.wrap, styles.fadein)}>
          <TextInput placeholder="Tokyo station" label="START" />
        </div>
        {form.map((placeholder, index) => {
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
                  onClick={() => this._handleRemoveButton(index, random)}
                >
                  <FontAwesome name="times-circle" size="2x" />
                </a>
              )}
              <TextInput placeholder={placeholder} label={`VIA${index + 1}`} />
              {index === form.length - 1 && (
                <a className={styles.addButton} onClick={this._handleAddButton}>
                  <FontAwesome name="plus-circle" size="3x" />
                </a>
              )}
            </div>
          );
        })}
        <div className={classNames(styles.wrap, styles.fadein)}>
          <TextInput placeholder="Yokohama station" label="GOAL" />
        </div>
      </div>
    );
  }
}

export default Search;
