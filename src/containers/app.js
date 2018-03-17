import React from "react";
import { render } from "react-dom";

import Search from "./Search";
import Map from "./Map";
import styles from "../../styles/containers/app.scss";
import { CONSTANT } from "../constants";

const App = () => {
  return (
    <div className={styles.wrapper}>
      <Search />
      <Map />
    </div>
  );
};

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
