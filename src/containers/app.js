import React from "react";
import { render } from "react-dom";

import Search from "./Search";
import Map from "./Map";
import styles from "../../styles/containers/app.scss";
import { API_KEY } from "../constants";

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
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places,directions`;
  document.head.appendChild(script);

  render(<App />, document.getElementById("react-entry"));
};

setup();
