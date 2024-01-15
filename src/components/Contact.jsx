import React from "react";
import { DEFAULT_PROFILE } from "../utils/constant";
const Contact = ({ contact, onChildClick }) => {
    const handleClick = () => {
        onChildClick(contact);
    };
    const { name, lastActive, status, phone } = contact;

    return (
        <div className="contact" onClick={handleClick}>
            <div className="profileImg">
                {name ? (
                    <p className="profile-text">{name[0]}</p>
                ) : (
                    <img
                        className="profile-image"
                        src={DEFAULT_PROFILE}
                        alt="profile"
                    />
                )}
            </div>
            <div className="contact-info">
                <h1 className="name">
                    {name ? name.split(" ")[0].toLowerCase() : phone}
                </h1>
            </div>
            <div className="status">
                {status === "online" ? (
                    <span className="onlineIndecator"></span>
                ) : (
                    <p className="lastseen">
                        {lastActive ? (
                            <>
                                <span>
                                    {new Date(lastActive).toLocaleDateString()}
                                </span>
                                <span>
                                    {new Date(lastActive).toLocaleTimeString()}
                                </span>
                            </>
                        ) : null}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Contact;
