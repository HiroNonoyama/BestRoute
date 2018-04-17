import React from "react";
import { render } from "react-dom";

import Search from "./Search";
import Map from "./Map";
import Result from "./Result";
import { MoveButton } from "../components/MoveButton";
import styles from "../../styles/containers/app.scss";

let API_KEY;
if (process.env.NODE_ENV === "production") {
  API_KEY = process.env.API_KEY;
} else {
  const { CONSTANT } = require("../constants");
  API_KEY = CONSTANT.API_KEY;
}

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

  goToTop = () => {
    document.getElementsByTagName("body")[0].scrollTop = 0;
    document.getElementsByTagName("html")[0].scrollTop = 0;
  };

  goToBottom = () => {
    document.getElementsByTagName("body")[0].scrollTop = 1000;
    document.getElementsByTagName("html")[0].scrollTop = 1000;
  };

  render() {
    const { isRightShow, isLeftShow, result } = this.state;
    return (
      <div
        className={styles.wrapper}
        ref={ref => {
          this.root = ref;
        }}
      >
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
        <MoveButton
          handleTopClick={this.goToTop}
          handleBottomClick={this.goToBottom}
        />
      </div>
    );
  }
}

const setup = () => {
  const script = document.createElement("script");
  const URL = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places,directions`;
  script.src = URL;
  document.head.appendChild(script);

  render(<App />, document.getElementById("react-entry"));
};

setup();
