import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import style from "../Styles/wraper.module.css";
import Chatpage from "../pages/Chatpage";
import Authentication from "../pages/Authentication";
import PersonalChat from "./PersonalChat";
import GroupChat from "./GroupChat";
import Login from "../pages/Login";
import Signin from "../pages/Signin";

const App = () => {
    return (
        <div className={style.wraper}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" exact element={<Authentication />}>
                            <Route index element={<Login />} />
                            <Route path="login" element={<Login />} />
                            <Route path="signin" element={<Signin />} />
                        </Route>
                        <Route path="/chatpage" element={<Chatpage />}>
                            <Route index element={<PersonalChat />} />
                            <Route
                                path="personalchat"
                                element={<PersonalChat />}
                            />
                            <Route path="groupchats" element={<GroupChat />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
        </div>
    );
};

export default App;
