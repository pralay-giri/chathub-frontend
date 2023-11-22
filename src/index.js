import React from "react";
import ReactDom from "react-dom/client";
import App from "./components/App";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

if(process.env.NODE_ENV === 'production'){
    disableReactDevTools();
}

const root = ReactDom.createRoot(document.querySelector("#root"));
root.render(<App />);
