import React, { useState, useContext, useCallback } from "react";
import { ImCross } from "react-icons/im";
import { GoPersonAdd } from "react-icons/go";
import "../../Styles/createGroupModal.css";
import { getCookie } from "../../Cookie/cookieConfigure";
import axios from "axios";
import { context } from "../../context/UserContext";
import Loadding from "../modals/Loadding";
import ErrorModal from "./ErrorModal";
import defaultPtofile from "../../Media/profile.png";
import { DEFAULT_PROFILE } from "../../utils/constant";
const CreateGroup = ({ closeModal }) => {
    const { contacts } = useContext(context);

    const [groupName, setGroupName] = useState("");
    const [gmail, setGmail] = useState("");
    const [selectedContact, setSelectedContact] = useState([]);
    const [isLoadding, setIsLoadding] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const ContactModal = useCallback((props) => {
        const { contact, onChildClick } = props;
        return (
            <div className="contactModal-container">
                <img
                    src={DEFAULT_PROFILE}
                    alt="img"
                    className="contactModal-img"
                    width={20}
                />
                <p className="contactModal-name">
                    {contact.name.split(" ")[0].toLowerCase()}
                </p>
                <ImCross
                    id="delete-contact-btn"
                    onClick={() => onChildClick(contact)}
                />
            </div>
        );
    }, []);

    const handleAdduser = async () => {
        let isFound = false;
        setIsLoadding(true);
        if (!gmail) {
            alert("enter valid gmail");
            return 0;
        }

        // checking if the contact is in the contact list
        if (contacts.length) {
            contacts.forEach((contact) => {
                if (contact.gmail === gmail) {
                    setSelectedContact((prev) => [
                        ...new Set([...prev, contact]),
                    ]);
                    isFound = true;
                    return 0;
                }
            });
            if (isFound) {
                setIsLoadding(false);
                return;
            }
        }

        // if not found in contact list then search in data base
        try {
            const responce = await axios.get("/contact/searchuser", {
                headers: {
                    Authorization: `Bearer ${getCookie("token")}`,
                },
                params: {
                    gmail,
                },
            });

            const user = {
                name: responce.data.name,
                gmail: responce.data.gmail,
            };
            setSelectedContact((prev) => [...new Set([...prev, user])]);
        } catch (error) {
            setIsLoadding(false);
            alert("not found");
        }
        setIsLoadding(false);
    };

    const handleClick = ({ name }) => {
        setSelectedContact((prev) =>
            selectedContact.filter((contact) => contact.name !== name)
        );
    };

    const handleCreateGroup = async () => {
        if (!(groupName && selectedContact.length)) {
            alert("some input field is empty");
            return 0;
        }
        try {
            setIsLoadding(true);
            const payload = {
                groupName,
                contacts: [...selectedContact],
            };
            const responce = await axios.post("/contact/createGroup", payload, {
                headers: {
                    Authorization: `Bearer ${getCookie("token")}`,
                },
            });
            if (!responce) throw new Error("Can't create group");
            setIsLoadding(false);
            closeModal();
        } catch (error) {
            console.log(error);
            setIsLoadding(false);
            setIsError(true);
            setErrorMsg(error.message);
        }
    };

    return (
        <div className="create-group-modal-background">
            <div className="create-group-modal">
                <div className="create-group-modal-header">
                    <div className="title">create group</div>
                    <ImCross
                        id="modal-close-btn"
                        onClick={() => {
                            closeModal();
                        }}
                    />
                </div>
                <div className="profile-area">
                    <img
                        src={defaultPtofile}
                        alt="profile"
                        width={100}
                        className="group-profile"
                        name="profilePhoto"
                    />
                </div>
                <div className="create-group-modal-body">
                    <input
                        type="text"
                        className="group-name-input"
                        value={groupName}
                        placeholder="group name"
                        onChange={(e) => {
                            setGroupName(e.target.value);
                        }}
                    />
                    <div className="select-contact-input">
                        <input
                            type="email"
                            className="group-name-input"
                            value={gmail}
                            placeholder="gmail"
                            onChange={(e) => {
                                setGmail(e.target.value);
                            }}
                        />
                        <GoPersonAdd
                            className="add-icon"
                            onClick={handleAdduser}
                        />
                    </div>
                    <div className="selected-contacts">
                        {selectedContact.map((contact, index) => {
                            return (
                                <ContactModal
                                    key={index}
                                    contact={contact}
                                    onChildClick={handleClick}
                                />
                            );
                        })}
                    </div>
                </div>
                <div className="create-group-modal-footer">
                    <button id="group-create-btn" onClick={handleCreateGroup}>
                        create
                    </button>
                    <button
                        id="group-modal-close-btn"
                        onClick={() => {
                            closeModal();
                        }}
                    >
                        close
                    </button>
                </div>
            </div>
            {isLoadding && <Loadding />}
            {isError && (
                <ErrorModal errorMsg={errorMsg} handleError={setIsError} />
            )}
        </div>
    );
};

export default CreateGroup;
