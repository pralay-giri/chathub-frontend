import React, { useContext, useState, useRef, useEffect } from "react";
import { context } from "../../context/UserContext";
import { TbEdit } from "react-icons/tb";
import { BiLogoGmail } from "react-icons/bi";
import { FaInfo } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { ImCross } from "react-icons/im";
import {
    BsArrowLeftShort,
    BsFillPersonFill,
    BsTelephoneFill,
} from "react-icons/bs";
import "../../Styles/profile.css";
import { getCookie, removeCookie } from "../../Cookie/cookieConfigure";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DEFAULT_PROFILE } from "../../utils/constant";

const ProfileModal = ({ closeModal }) => {
    const { user } = useContext(context);
    const [isVisibleNameChangeModal, setIsVisibleNameChangeModal] =
        useState(false);
    const [isChangeAboutVisible, setIsChangeAboutVisible] = useState(false);
    const [isChangePhoneVisible, setIsChangePhoneVisible] = useState(false);
    const navigator = useNavigate();
    const imgRef = useRef(null);

    const handleNameChange = () => {
        setIsVisibleNameChangeModal(true);
    };

    const handleAboutChange = () => {
        setIsChangeAboutVisible(true);
    };

    const handlePhoneChange = () => {
        setIsChangePhoneVisible(true);
    };

    const handleLogout = () => {
        removeCookie("token");
        navigator("/login");
    };
    useEffect(() => {}, [
        isVisibleNameChangeModal,
        isChangeAboutVisible,
        isChangePhoneVisible,
    ]);

    const changeData = async (type, inputData) => {
        const endPoint = `/contact/update/${type}`;
        if (!inputData) {
            alert("empty input field");
            return 0;
        }
        try {
            const responce = await axios.put(
                endPoint,
                { inputData },
                {
                    headers: {
                        Authorization: `Bearer ${getCookie("token")}`,
                    },
                }
            );
            if (!responce) {
                throw new Error("error in updating");
            }
            setIsChangeAboutVisible(false);
            setIsVisibleNameChangeModal(false);
            setIsChangePhoneVisible(false);
            user[type] = inputData;
        } catch (error) {
            alert(error.message);
        }
    };

    const EditJsx = ({ type }) => {
        const [inputData, setInputData] = useState("");
        return (
            <div className={`edit-${type}`}>
                <ImCross
                    onClick={() => {
                        setIsChangeAboutVisible(false);
                        setIsVisibleNameChangeModal(false);
                        setIsChangePhoneVisible(false);
                    }}
                    className="cross-btn"
                />
                <input
                    value={inputData}
                    type="text"
                    className={`new-${type}`}
                    autoFocus
                    placeholder={type}
                    onChange={(e) => {
                        setInputData(e.target.value);
                    }}
                />
                <button
                    onClick={() => {
                        changeData(type, inputData);
                    }}
                >
                    change
                </button>
            </div>
        );
    };

    return (
        user && (
            <div className="profile-bg">
                <div className="profile-div">
                    <div className="profile-header">
                        <BsArrowLeftShort
                            onClick={() => {
                                closeModal(false);
                            }}
                            className="profile-header-back-btn"
                        />
                        <p>Profile</p>
                    </div>
                    <div className="profile-pic">
                        <div className="pic">
                            <img
                                ref={imgRef}
                                src={DEFAULT_PROFILE}
                                alt="profile"
                                width={50}
                            />
                        </div>
                    </div>
                    <div className="profile-info">
                        <div className="profile-info-name">
                            <BsFillPersonFill />
                            <div className="name">
                                <p className="info-head">Name</p>
                                <p className="info-value">
                                    {user.name.toLowerCase()}
                                </p>
                            </div>
                            <TbEdit
                                className="edit-btn"
                                onClick={handleNameChange}
                            />
                        </div>
                        <div className="profile-info-about">
                            <FaInfo />
                            <div className="name">
                                <p className="info-head">About</p>
                                <p className="info-value">{user.about}</p>
                            </div>
                            <TbEdit
                                className="edit-btn"
                                onClick={handleAboutChange}
                            />
                        </div>
                        <div className="profile-info-gmail">
                            <BiLogoGmail />
                            <div className="gmail">
                                <p className="info-head">Gmail</p>
                                <p className="info-value">{user.gmail}</p>
                            </div>
                        </div>
                        <div className="profile-info-phone">
                            <BsTelephoneFill />
                            <div className="phone">
                                <p className="info-head">Phone</p>
                                <p className="info-value">
                                    {user.phone || "add your phone number"}
                                </p>
                            </div>
                            <TbEdit
                                className="edit-btn"
                                onClick={handlePhoneChange}
                            />
                        </div>
                    </div>
                    <div className="profile-footer">
                        <div
                            className="profile-footer-logout"
                            onClick={handleLogout}
                        >
                            <MdLogout />
                            log out
                        </div>
                    </div>
                    {isChangePhoneVisible && <EditJsx type={"phone"} />}
                    {isChangeAboutVisible && <EditJsx type={"about"} />}
                    {isVisibleNameChangeModal && <EditJsx type={"name"} />}
                </div>
            </div>
        )
    );
};

export default ProfileModal;
