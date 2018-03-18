import * as React from "react";
import * as classNames from "classnames";
import * as FontAwesome from "react-fontawesome";

import * as styles from "../../styles/containers/Result.scss";

interface ResultProps {
  expand: () => void;
  shrink: () => void;
  isShowed: boolean;
}

export default class Result extends React.PureComponent<ResultProps> {
  private ref;

  fadeIn = () => {
    const target = this.ref.classList;
    target.remove(styles.fadeOut);
    setTimeout(() => {
      this.props.expand();
      target.add(styles.fadeIn);
    }, 10);
  };

  fadeOut = () => {
    const target = this.ref.classList;
    target.remove(styles.fadeIn);
    setTimeout(() => {
      this.props.shrink();
      target.add(styles.fadeOut);
    }, 10);
  };

  render() {
    const { isShowed } = this.props;
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
