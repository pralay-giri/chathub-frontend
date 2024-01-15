import React, { useContext, useEffect, useState } from "react";
import { context } from "../context/UserContext";
import "../Styles/profileArea.css";
import { FaInfo } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { GrGroup } from "react-icons/gr";
import { RxExit } from "react-icons/rx";
import "../Styles/profileArea.css";
import axios from "axios";
import { getCookie } from "../Cookie/cookieConfigure";
import GroupContact from "../components/GroupContact";
import Contact from "./Contact";

function ProfileArea() {
    const { selectedContact, setSelectedContact, contacts, setContacts, user } =
        useContext(context);
    const [allParticipantsDetails, setAllParticipantsDetails] = useState([]);
    const [isLoadding, setIsLoading] = useState(false);
    const [commonGroups, setCommonGroup] = useState([]);

    const fetchDataForGroup = async () => {
        const gmails = [
            ...new Set(
                selectedContact.participants.map(
                    (participant) => participant.gmail
                )
            ),
        ];
        try {
            setIsLoading(true);
            const responce = await axios.get("/contact/findUserByNumber", {
                headers: {
                    authorization: `Bearer ${getCookie("token")}`,
                },
                params: { gmails: gmails },
            });

            setAllParticipantsDetails([...new Set(responce.data)]);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

    const fetchCommonGroup = async () => {
        try {
            setIsLoading(true);
            const responce = await axios.get("/contact/findCommonGroup", {
                headers: {
                    authorization: `Bearer ${getCookie("token")}`,
                },
                params: { id: selectedContact._id },
            });
            if (!responce) {
                throw new Error("not found");
            }

            setCommonGroup((prev) => responce.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedContact && selectedContact.isGroupChat) {
            fetchDataForGroup();
        } else if (selectedContact && !selectedContact.isGroupChat) {
            fetchCommonGroup();
        }
    }, [selectedContact]);

    const handleChildClick = (contact) => {
        if (contact.phone !== user.phone) {
            setSelectedContact(contact);
        }
    };

    const handleDeleteChat = async () => {
        try {
            setIsLoading(true);
            const responce = await axios.delete("/contact/deleteChat", {
                headers: {
                    authorization: `Bearer ${getCookie("token")}`,
                },
                params: {
                    gmail: selectedContact.gmail,
                },
            });
            if (!responce) {
                throw new Error("error in fetching data");
            }
            setContacts((prev) => {
                return [
                    ...new Set(
                        contacts.filter((contact) => {
                            return contact.gmail !== selectedContact.gmail;
                        })
                    ),
                ];
            });
            setSelectedContact((prev) => null);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

    return (
        <div
            className="profile-area"
            style={{ border: selectedContact ? "none" : "1px solid" }}
        >
            {selectedContact ? (
                selectedContact.isGroupChat ? (
                    <div className="profile-area-info-container">
                        <div className="profile-pic-area">
                            <div className="pic">
                                <p className="profile-text">
                                    {selectedContact.name[0]}
                                </p>
                                <p className="profile-name">
                                    {selectedContact.name}
                                </p>
                            </div>
                        </div>
                        <div className="profile-body">
                            <p className="profile-body-header">participants</p>
                            {allParticipantsDetails.map((participant) => {
                                return (
                                    participant._id !== user.id && (
                                        <Contact
                                            contact={participant}
                                            onChildClick={setSelectedContact}
                                            key={participant.gmail}
                                        />
                                    )
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="profile-area-info-container">
                        <div className="profile-pic-area">
                            <div className="pic">
                                <div className="profile-container">
                                    <p className="profil-text">
                                        {selectedContact.name[0]}
                                    </p>
                                </div>
                                <p className="profile-name">
                                    {selectedContact.name}
                                </p>
                                <p className="profile-number">
                                    {selectedContact.phone}
                                </p>
                            </div>
                        </div>
                        <div className="profile-info-about">
                            <FaInfo />
                            <div className="about">
                                <p className="about-head">About</p>
                                <p className="about-value">
                                    {selectedContact.about}
                                </p>
                            </div>
                        </div>
                        <div className="profile-info-match">
                            <p className="group-info">
                                <GrGroup className="group-icon" />
                                <span>Groups in common</span>
                            </p>
                            <div className="groups-name">
                                {commonGroups &&
                                    commonGroups.map((group, index) => {
                                        return (
                                            <GroupContact
                                                key={index}
                                                handleChildClick={
                                                    handleChildClick
                                                }
                                                group={group}
                                            />
                                        );
                                    })}
                                {isLoadding && <span>loadding...</span>}
                            </div>
                        </div>
                        <div className="profile-footer">
                            <div
                                className="profile-chat"
                                onClick={handleDeleteChat}
                            >
                                <MdDelete />
                                <p className="block-text">Delete chat</p>
                            </div>
                        </div>
                    </div>
                )
            ) : (
                <h3 className="non-selected-text">
                    select a contact to view profile
                </h3>
            )}
        </div>
    );
}

export default ProfileArea;
