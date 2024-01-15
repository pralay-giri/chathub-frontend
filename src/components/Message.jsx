import React, { useContext, useState } from "react";
import { context } from "../context/UserContext";

const Message = (props) => {
    const { user } = useContext(context);
    const { message } = props;
    console.log("render");
    return (
        <div>
            <div
                className={
                    user?.id === message?.sender?._id
                        ? "message right"
                        : "message left"
                }
            >
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
        </div>
    );
};

export default Message;
