import * as React from "react";
import * as classNames from "classnames";
import * as FontAwesome from "react-fontawesome";

import * as styles from "../../styles/containers/Result.scss";

interface ResultProps {}

interface ResultState {
  isShowed: boolean;
}

export default class Result extends React.PureComponent<
  ResultProps,
  ResultState
> {
  private ref;
  state = { isShowed: false };

  fadeIn = () => {
    const target = this.ref.classList;
    target.remove(styles.fadeOut);
    setTimeout(() => {
      target.add(styles.fadeIn);
      this.setState({ isShowed: true });
    }, 10);
  };

  fadeOut = () => {
    const target = this.ref.classList;
    target.remove(styles.fadeIn);
    setTimeout(() => {
      target.add(styles.fadeOut);
      this.setState({ isShowed: false });
    }, 10);
  };

  render() {
    const { isShowed } = this.state;
    return (
      <div
        ref={ref => {
          this.ref = ref;
        }}
        className={styles.container}
      >
        <a
          role="button"
          className={styles.button}
          onClick={isShowed ? this.fadeOut : this.fadeIn}
        >
          {isShowed ? (
            <FontAwesome name="chevron-right" size="lg" />
          ) : (
            <FontAwesome name="chevron-left" size="lg" />
          )}
        </a>
      </div>
    );
  }
}
