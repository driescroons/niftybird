import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Game from "./Game";

import "./index.css";
import { useStore } from "./store";

ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById("root")
);

function Main() {
  const colors = useStore((store) => store.colors);
  return (
    <>
      <App />
      {colors.length > 0 && <Game />}
    </>
  );
}
