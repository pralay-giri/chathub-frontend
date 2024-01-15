import React, { useState, useContext, useEffect } from "react";
import "../Styles/contactList.css";
import { FaSistrix } from "react-icons/fa6";
import { BiMessageSquareAdd } from "react-icons/bi";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import AddContactModal from "./modals/AddContactModal";
import { context } from "../context/UserContext";
import ErrorModal from "./modals/ErrorModal";
import axios from "axios";
import { getCookie } from "../Cookie/cookieConfigure";
import { auth } from "../Cookie/auth";
import ProfileModal from "./modals/ProfileModal";
import Loadding from "./modals/Loadding";
import Success from "./modals/Success";
import { ImCross } from "react-icons/im";
import { MdOutlineGroupAdd } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import Contact from "./Contact";
import CreateGroup from "./modals/CreateGroup";
import NotificationModal from "./modals/NotificationModal";
import { DEFAULT_PROFILE } from "../utils/constant";

const ContactList = () => {
    const navigator = useNavigate();
    const [error, setError] = useState();
    const [success, setSuccess] = useState(false);
    const [loadding, setLoadding] = useState(true);
    const {
        user,
        setUser,
        setSelectedContact,
        notifications,
        setNotifications,
    } = useContext(context);
    const [showProfile, setShowProfile] = useState(false);
    const [contactInputField, setContactInputField] = useState("");
    const [isAddContactModalVisible, setIsAddContactModalVisible] =
        useState(false);
    const [isUserSearchName, setIsUserSearchName] = useState(false);
    const [searchedContact, setSearchedContact] = useState();
    const [exitSearchContact, setExitSearchContact] = useState(false);
    const [isSearchLoadding, setIsSearchLoadding] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errormsg, setErrormsg] = useState("");
    const [isCreateGroupModalVisible, setIsCreateGroupModalVisible] =
        useState(false);
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        const token = getCookie("token");
        const isVarifiedToken = auth(token);
        if (!isVarifiedToken) {
            navigator("/login");
            return;
        }
        const fetchData = async () => {
            setLoadding(true);
            try {
                const responce = await axios.get("/getusercredential", {
                    headers: {
                        Authorization: `Bearer ${getCookie("token")}`,
                    },
                });
                const credential = responce?.data?.credential;

                setUser((prev) => {
                    return { ...credential };
                });
            } catch (error) {
                setIsError(true);
                setErrormsg(error.message);
            }
            setLoadding(false);
        };
        fetchData();
    }, [setLoadding, setUser, success]);

    const handleSearchInput = (e) => {
        setContactInputField(e.target.value);
    };

    const searchContact = async () => {
        if (contactInputField) {
            setIsSearchLoadding(true);
            setExitSearchContact(true);
            setIsUserSearchName(true);

            const payload = {
                phone: contactInputField,
            };
            try {
                const responce = await axios.get("/contact/searchuser", {
                    headers: {
                        Authorization: `Bearer ${getCookie("token")}`,
                    },
                    params: payload,
                });
                if (!responce.data) throw new Error("not found");
                const unit8Array = new Uint8Array(responce.data.profile.data);
                const profileLink = URL.createObjectURL(new Blob([unit8Array]));
                const { name, gmail, lastActive, phone, status } =
                    responce.data;
                const contact = {
                    name,
                    gmail,
                    phone,
                    status,
                    lastActive,
                    profile: profileLink,
                };
                setSearchedContact((prev) => contact);
            } catch (error) {
                setErrormsg("not found");
                setIsError(true);
            }
            setIsSearchLoadding(false);
        } else {
            alert("enter a valid name");
        }
    };

    const closeSearchContact = () => {
        setExitSearchContact(false);
        setIsUserSearchName(false);
        setSearchedContact([]);
    };

    const handleSelectedContact = () => {
        setSelectedContact(searchedContact);
    };

    const closeErrorModel = (value) => {
        setIsError(value);
        setExitSearchContact(false);
        setIsUserSearchName(false);
        setSearchedContact([]);
    };

    const closeModal = () => {
        setIsCreateGroupModalVisible((prev) => false);
    };

    const deleteNotification = (noti) => {
        setNotifications((prev) => {
            return notifications.filter(
                (notification) => notification !== noti
            );
        });
    };

    const closeNotificationModal = () => {
        setShowNotification(false);
    };

    useEffect(() => {}, [notifications]);
    return (
        <div className="contactListArea">
            <div>
                <div className="contactLlstHead">
                    <button
                        className="profile"
                        onClick={() => {
                            setShowProfile(true);
                        }}
                    >
                        <img src={DEFAULT_PROFILE} alt="profile" width={50} />
                    </button>
                    <p className="user-name">{user?.name?.toLowerCase()}</p>
                    <button
                        onClick={() => {
                            setIsAddContactModalVisible(true);
                        }}
                        className="contactBtn"
                    >
                        <BiMessageSquareAdd />
                    </button>
                    <button
                        className="contactBtn"
                        onClick={() => {
                            setIsCreateGroupModalVisible(true);
                        }}
                    >
                        <MdOutlineGroupAdd />
                    </button>
                    <button
                        className="contactBtn notification-btn"
                        id={notifications.length ? "active-nofication" : null}
                        onClick={() => {
                            setShowNotification((prev) => !prev);
                        }}
                    >
                        <IoMdNotifications />
                    </button>
                </div>
                <div id="contactSearchDiv">
                    <input
                        type="text"
                        value={contactInputField}
                        onChange={handleSearchInput}
                        placeholder="search contact by number"
                        id="contactSearchInput"
                    />
                    {exitSearchContact ? (
                        <ImCross id="searchIcon" onClick={closeSearchContact} />
                    ) : (
                        <FaSistrix id="searchIcon" onClick={searchContact} />
                    )}
                </div>
                <h1 id="chatHeading">Chats</h1>
            </div>
            {isSearchLoadding && <Loadding />}
            {isError && (
                <ErrorModal errorMsg={errormsg} handleError={closeErrorModel} />
            )}
            {isUserSearchName ? (
                searchedContact ? (
                    <Contact
                        contact={searchedContact}
                        onChildClick={handleSelectedContact}
                    />
                ) : (
                    "no contacts"
                )
            ) : (
                <div className="chatListdiv">
                    <ul className="navigation">
                        <li>
                            <NavLink
                                to="personalchat"
                                className={({ isActive }) =>
                                    isActive ? "active" : ""
                                }
                            >
                                Personal
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="groupchats"
                                className={({ isActive }) =>
                                    isActive ? "active" : ""
                                }
                            >
                                Group
                            </NavLink>
                        </li>
                    </ul>
                    <Outlet />
                </div>
            )}
            {loadding && <Loadding />}
            {isAddContactModalVisible && (
                <AddContactModal
                    closeModal={setIsAddContactModalVisible}
                    handleError={setError}
                    handleSuccess={setSuccess}
                />
            )}
            {error && <ErrorModal handleError={setError} errorMsg={error} />}
            {success && (
                <Success
                    closeModal={setSuccess}
                    successMsg={"contact added successfull"}
                />
            )}
            {showProfile && <ProfileModal closeModal={setShowProfile} />}
            {isCreateGroupModalVisible && (
                <CreateGroup closeModal={closeModal} />
            )}
            {showNotification && (
                <NotificationModal
                    notifications={notifications}
                    deleteNotification={deleteNotification}
                    closeNotificationModal={closeNotificationModal}
                />
            )}
        </div>
    );
};

export default ContactList;
