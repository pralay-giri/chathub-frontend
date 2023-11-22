import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import logo from "../Media/chat.png";
import "../Styles/authentication.css";

function Authentication() {
    return (
        <div className="authenticationDiv">
            <img src={logo} alt="logo" />
            <div className="authenticationNav">
                <ul className="nav">
                    <li>
                        <NavLink
                            to="login"
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            login
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="signin"
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            signin
                        </NavLink>
                    </li>
                </ul>
                <Outlet />
            </div>
        </div>
    );
}

export default Authentication;
