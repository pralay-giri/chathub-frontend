import React, { useState, useContext, useEffect, useRef } from "react";
import { UserContext, context } from "../context/UserContext";
import {
    BsTelephoneFill,
    BsEmojiSmile,
    BsThreeDotsVertical,
} from "react-icons/bs";
import { BiSolidVideo } from "react-icons/bi";
import { VscSend } from "react-icons/vsc";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import axios from "axios";
import { getCookie } from "../Cookie/cookieConfigure";
import Message from "./Message";
import Loadding from "../components/modals/Loadding";
import { io } from "socket.io-client";
import Setting from "./modals/Setting";
import "../Styles/message-area.css";

// Rest of your code
var socket, selectedConversation;
const URL = "http://localhost:5500";

const MessageArea = () => {
    const { selectedContact, contacts, setContacts, setNotifications, user } =
        useContext(context);
    const [inputMessage, setInputMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isLoadding, setIsLoadding] = useState(false);
    const messageAreaRef = useRef(null);
    const [isSettingVisible, setIsSettingVisible] = useState(false);

    useEffect(() => {
        socket = io(URL, { auth: { token: `Bearer ${getCookie("token")}` } });

        socket.on("connect", () => {
            console.log("socket connected...");
        });
        socket.emit("set-up");
        return () => {
            socket.off("connect");
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        socket.on("new-message-received", (message) => {
            if (
                selectedConversation &&
                selectedConversation === message.conversationId
            ) {
                setMessages((prev) => [...prev, message]);
            } else {
                const newNotification = {
                    sender: message.sender.name,
                    messageContent: message.messageContent,
                    timeStamp: message.timeStamp,
                };
                setNotifications((prev) => {
                    const notification = [...prev, newNotification];
                    return notification;
                });
            }
        });

        // socket for seting contact to online
        socket.on("online", (id) => {
            contacts.forEach((contact) => {
                if (contact._id === id) {
                    contact.status = "online";
                    const newContactsArray = contacts;
                    setContacts((prev) => [...newContactsArray]);
                    return;
                }
            });
        });

        // socket for seting contact to offline
        socket.on("offline", (id) => {
            contacts.forEach((contact) => {
                if (contact._id === id) {
                    contact.status = "offline";
                    contact.lastActive = new Date();
                    const newContactsArray = contacts;
                    setContacts((prev) => [...newContactsArray]);
                    return;
                }
            });
        });

        socket.on("connect_error", (error) => {
            console.log("token needed");
            socket.disconnect();
        });

        return () => {
            socket.off("new-message-received");
            socket.off("online");
            socket.off("offline");
        };
    });

    const sendMsg = async () => {
        if (!inputMessage) return;
        if (
            selectedContact.hasOwnProperty("isGroupChat") &&
            selectedContact.isGroupChat
        ) {
            try {
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: {
                            name: user.name,
                            _id: user.id,
                        },
                        messageContent: inputMessage,
                        timeStamp: new Date(),
                    },
                ]);
                setInputMessage((prev) => "");
                const responce = await axios.post(
                    "/contact/newGrouopMessage",
                    {
                        selectedGroupId: selectedContact.id,
                        message: inputMessage,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${getCookie("token")}`,
                        },
                    }
                );

                socket.emit("new-message", responce.data);
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: {
                            name: user.name,
                            _id: user.id,
                        },
                        messageContent: inputMessage,
                        timeStamp: new Date(),
                    },
                ]);
                setInputMessage((prev) => "");

                const responce = await axios.post(
                    "/contact/newSingleMessage",
                    {
                        gmail: selectedContact.gmail,
                        message: inputMessage,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${getCookie("token")}`,
                        },
                    }
                );
                socket.emit("new-message", responce.data);
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        const fetchSingleChatMsg = async () => {
            try {
                setIsLoadding(true);
                const responce = await axios.get("/contact/getSingleChatMsg", {
                    headers: {
                        authorization: `Bearer ${getCookie("token")}`,
                    },
                    params: {
                        gmail: selectedContact.gmail,
                    },
                });
                setIsLoadding(() => false);
                if (typeof responce.data === "string") {
                    socket.emit("join-chat", responce.data);
                    selectedConversation = responce.data;
                    return 0;
                }
                setMessages((prev) => [...prev, ...responce.data]);
                selectedConversation = responce.data[0].conversationId;
                socket.emit("join-chat", responce.data[0].conversationId);
            } catch (error) {
                setIsLoadding(() => false);
                console.log(error);
            }
        };

        const fetchGroupChatMsg = async () => {
            try {
                setIsLoadding(true);
                const responce = await axios.get("/contact/getGroupChatMsg", {
                    headers: {
                        authorization: `Bearer ${getCookie("token")}`,
                    },
                    params: {
                        groupId: selectedContact.id,
                    },
                });
                setIsLoadding(false);
                if (typeof responce.data === "string") {
                    socket.emit("join-chat", responce.data);
                    selectedConversation = responce.data;
                    return 0;
                }
                setMessages((prev) => [...prev, ...responce.data]);
                selectedConversation = responce.data[0].conversationId;
                socket.emit("join-chat", responce.data[0].conversationId);
            } catch (error) {
                setIsLoadding(false);
                console.log(error);
            }
        };

        if (selectedContact) {
            if (selectedContact.hasOwnProperty("isGroupChat")) {
                fetchGroupChatMsg();
            } else {
                fetchSingleChatMsg();
            }
        }
        return () => {
            setMessages((prev) => []);
        };
    }, [selectedContact]);

    useEffect(() => {
        messageAreaRef.current?.scrollTo(
            0,
            messageAreaRef.current.scrollHeight
        );
    }, [messages]);

    const openMessageSetting = () => {
        setIsSettingVisible((prev) => !prev);
    };

    const closeSettingModal = () => {
        setIsSettingVisible(() => false);
    };

    const deleteAllChat = async () => {
        if (!messages.length) {
            return;
        }
        const selectedContactId = selectedContact._id;
        try {
            const responce = await axios.delete("/contact/deleteAllChat", {
                headers: {
                    Authorization: `Bearer ${getCookie("token")}`,
                },
                params: {
                    selectedContactId,
                },
            });
            setMessages((prev) => []);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div
            className="message-container"
            style={
                selectedContact
                    ? { backgroundColor: "#63a7be" }
                    : {
                          border: "1px solid",
                          color: "var(--text-color)",
                          display: "grid",
                          placeItems: "center",
                          height: "100%",
                      }
            }
        >
            {selectedContact ? (
                <React.Fragment>
                    <div className="message-container-header">
                        <div className="profile-container">
                            <p>{selectedContact.name[0]}</p>
                        </div>
                        <p className="message-container-header-name">
                            {selectedContact.name.split(" ")[0].toLowerCase()}
                            <span
                                className={
                                    selectedContact.status === "online"
                                        ? "clr-g"
                                        : null
                                }
                            >
                                {selectedContact.isGroupChat
                                    ? null
                                    : selectedContact.status === "online"
                                    ? "online"
                                    : new Date(
                                          selectedContact.lastActive
                                      ).toLocaleTimeString()}
                            </span>
                        </p>
                        <BsTelephoneFill
                            className="message-container-header-call"
                            style={{ display: "none" }}
                        />
                        <BiSolidVideo
                            className="message-container-header-video-call"
                            style={{ display: "none" }}
                        />
                        <BsThreeDotsVertical
                            className="message-container-header-video-call"
                            onClick={() => openMessageSetting()}
                        />
                    </div>
                    <div className="message-area" ref={messageAreaRef}>
                        {messages.length ? (
                            messages.map((message, index) => {
                                return (
                                    <Message key={index} message={message} />
                                );
                            })
                        ) : (
                            <span className="no-message">no messages</span>
                        )}
                        {isLoadding && <Loadding />}
                        {isSettingVisible && (
                            <Setting
                                closeSettingModal={closeSettingModal}
                                deleteAllChat={deleteAllChat}
                            />
                        )}
                    </div>
                    <div className="message-container-input-area">
                        <BsEmojiSmile
                            className="emoji-btn"
                            onClick={() => {
                                setShowEmojiPicker((prev) => !prev);
                            }}
                            focusable={true}
                        />
                        <input
                            type="text"
                            name="message"
                            value={inputMessage}
                            autoFocus
                            onChange={(e) => {
                                setInputMessage((prev) => e.target.value);
                            }}
                            placeholder="Type Here"
                        />

                        <VscSend className="send-btn" onClick={sendMsg} />
                    </div>
                    {showEmojiPicker && (
                        <div className="emoji-picker">
                            <Picker
                                data={data}
                                onEmojiSelect={(e) => {
                                    setInputMessage((prev) => prev + e.native);
                                }}
                                className="picker"
                            />
                        </div>
                    )}
                </React.Fragment>
            ) : (
                <h3 className="non-selected-text">
                    click any contact to see the message
                </h3>
            )}
        </div>
    );
};

export default MessageArea;
