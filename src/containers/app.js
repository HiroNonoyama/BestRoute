import React from "react";
import { render } from "react-dom";

import Search from "./Search";
import styles from "../../styles/containers/app.scss";

const App = () => {
  return (
    <div className={styles.wrapper}>
      <Search />
    </div>
  );
};

render(<App />, document.getElementById("react-entry"));
