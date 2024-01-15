import React from "react";
import defaultPtofile from "../Media/profile.png";

const GroupContact = ({ handleChildClick, group }) => {
    const { lastMessage, name } = group;
    return (
        <div
            onClick={() => {
                handleChildClick(group);
            }}
            className="group-contact"
        >
            <div className="profileImg">
                <p>{name[0]}</p>
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
