import React from "react";
import defaultPtofile from "../Media/profile.png";

const GroupContact = ({ handleChildClick, group }) => {
    const { lastMessage, name, profile } = group;
    return (
        <div
            onClick={() => {
                handleChildClick(group);
            }}
            className="group-contact"
        >
            <div className="profileImg">
                <img
                    src={profile ? profile : defaultPtofile}
                    alt="profile"
                    width={100}
                />
            </div>
            <div className="group-info">
                <h3 className="name">{name}</h3>
                <div className="lastmessage">
                    {lastMessage && (
                        <p>
                            `${lastMessage.sender} : ${lastMessage.message}`
                        </p>
                    )}
                </div>
            </div>
            <div className="time">
                <p>
                    {lastMessage &&
                        new Date(lastMessage.time).toLocaleTimeString()}
                </p>
            </div>
        </div>
    );
};

export default GroupContact;
