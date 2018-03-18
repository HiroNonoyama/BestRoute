import * as React from "react";
import * as classNames from "classnames";
import * as FontAwesome from "react-fontawesome";

import * as styles from "../../styles/containers/Map.scss";

interface MapProps {
  isRightShow: boolean;
  isLeftShow: boolean;
  expand: () => void;
  shrink: () => void;
}

class Map extends React.PureComponent<MapProps> {
  componentWillReceiveProps(nextProps) {
    const { isLeftShow, isRightShow } = this.props;
    const [nextLeftShow, nextRightShow] = [
      nextProps.isLeftShow,
      nextProps.isRightShow,
    ];

    if (isRightShow !== nextRightShow) {
      if (nextRightShow) {
        this.rightShrink();
      } else {
        this.rightExpand();
      }
    }
  }

  rightExpand() {
    const target = this.ref.classList;
    target.add(styles.rightExpandAnimation);
    setTimeout(() => {
      target.remove(styles.rightShrink);
      target.add(styles.rightExpand);
      target.remove(styles.rightExpandAnimation);
    }, 600);
  }

  rightShrink() {
    const target = this.ref.classList;
    target.add(styles.rightShrinkAnimation);
    setTimeout(() => {
      target.remove(styles.rightExpand);
      target.add(styles.rightShrink);
      target.remove(styles.rightShrinkAnimation);
    }, 600);
  }

  leftExpand = () => {
    const target = this.ref.classList;
    target.add(styles.leftExpandAnimation);
    setTimeout(() => {
      target.remove(styles.leftShrink);
      this.props.expand();
      target.add(styles.leftExpand);
      target.remove(styles.leftExpandAnimation);
    }, 600);
  };

  leftShrink = () => {
    const target = this.ref.classList;
    target.add(styles.leftShrinkAnimation);
    setTimeout(() => {
      this.props.shrink();
      target.remove(styles.leftExpand);
      target.add(styles.leftShrink);
      target.remove(styles.leftShrinkAnimation);
    }, 600);
  };

  render() {
    const { isLeftShow } = this.props;
    return (
      <div
        className={styles.container}
        ref={ref => {
          this.ref = ref;
        }}
      >
        <a
          role="button"
          className={styles.button}
          onClick={isLeftShow ? this.leftExpand : this.leftShrink}
        >
          {!isLeftShow ? (
            <FontAwesome name="chevron-right" size="lg" />
          ) : (
            <FontAwesome name="chevron-left" size="lg" />
          )}
        </a>
        <div className={styles.map} id="map" />
      </div>
    );
  }
}

export default Map;
