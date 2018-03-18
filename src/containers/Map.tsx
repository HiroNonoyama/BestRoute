import * as React from "react";
import * as classNames from "classnames";

import * as styles from "../../styles/containers/Map.scss";

interface MapProps {
  isRightShow: boolean;
  isLeftShow: boolean;
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
        this.shrink();
      } else {
        this.expand();
      }
    }
  }

  expand() {
    const target = this.ref.classList;
    target.remove(styles.shrink);
    setTimeout(() => target.add(styles.expand), 10);
  }

  shrink() {
    const target = this.ref.classList;
    target.remove(styles.expand);
    setTimeout(() => target.add(styles.shrink), 10);
  }

  render() {
    return (
      <div
        className={styles.container}
        ref={ref => {
          this.ref = ref;
        }}
      >
        <div className={styles.map} id="map" />
      </div>
    );
  }
}

export default Map;
