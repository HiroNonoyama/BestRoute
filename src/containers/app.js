import React from "react";
import { render } from "react-dom";

import Search from "./Search";
import Map from "./Map";
import Result from "./Result";
import styles from "../../styles/containers/app.scss";
import { CONSTANT } from "../constants";

class App extends React.PureComponent {
  state = { isLeftShow: true, isRightShow: false, result: {} };

  mapLeftExpand = () => {
    this.setState({ isLeftShow: false });
  };

  mapLeftShrink = () => {
    this.setState({ isLeftShow: true });
  };

  rightExpand = () => {
    this.setState({ isRightShow: true });
  };

  rightShrink = () => {
    this.setState({ isRightShow: false });
  };

  setResult = result => {
    this.setState({ result });
  };

  render() {
    const { isRightShow, isLeftShow, result } = this.state;
    return (
      <div className={styles.wrapper}>
        <Search setResult={this.setResult} />
        <Map
          {...this.state}
          expand={this.mapLeftExpand}
          shrink={this.mapLeftShrink}
        />
        <Result
          isShowed={isRightShow}
          result={result}
          expand={this.rightExpand}
          shrink={this.rightShrink}
        />
      </div>
    );
  }
}

const setup = () => {
  const script = document.createElement("script");
  const URL = `https://maps.googleapis.com/maps/api/js?key=${
    CONSTANT.API_KEY
  }&libraries=places,directions`;
  script.src = URL;
  document.head.appendChild(script);

  render(<App />, document.getElementById("react-entry"));
};

setup();
