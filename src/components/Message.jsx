import React, { useContext } from "react";
import { context } from "../context/UserContext";

const Message = ({ message }) => {
    const { user } = useContext(context);
    return (
        <>
            <div className={user.id === message.sender._id ? "message right" : "message left"}>
                {message.messageContent}
                <p className="info">
                    <span>
                        {message.sender.name.split(" ")[0].toLowerCase()}
                    </span>
                    <span>
                        {new Date(message.timeStamp).toLocaleTimeString()}
                    </span>
                </p>
            </div>
        </>
    );
};

export default Message;
