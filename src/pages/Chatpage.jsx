import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileArea from "../components/ProfileArea";
import MessageArea from "../components/MessageArea";
import ContactList from "../components/ContactList";
import { getCookie } from "../Cookie/cookieConfigure";
import { auth } from "../Cookie/auth";
import "../Styles/chatpage.css";
import { UserContext } from "../context/UserContext";

const Chatpage = () => {
    const navigator = useNavigate();
    // cheacking if the user has his token
    useEffect(() => {
        const token = getCookie("token");
        const userInfo = auth(token);
        if (!userInfo) {
            navigator("/login");
        }
    }, [navigator]);

    return (
        <UserContext>
            <div className="chatpageDiv">
                <ContactList />
                <MessageArea />
                <ProfileArea />
            </div>
        </UserContext>
    );
};

export default Chatpage;
