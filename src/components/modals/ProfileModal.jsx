import React, { useContext, useState, useRef } from "react";
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
    BsCameraFill,
} from "react-icons/bs";
import "../../Styles/profile.css";
import { getCookie, removeCookie } from "../../Cookie/cookieConfigure";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfileModal = ({ closeModal }) => {
    const { user } = useContext(context);
    const [isMouseEnter, setIsMouseEnter] = useState(false);
    const [isVisibleNameChangeModal, setIsVisibleNameChangeModal] =
        useState(false);
    const [isChangeAboutVisible, setIsChangeAboutVisible] = useState(false);
    const navigator = useNavigate();
    const fileInputRef = useRef(null);
    const imgRef = useRef(null);

    const handleProfileHover = (e) => {
        setIsMouseEnter(true);
    };

    const handleMouseLeave = (e) => {
        setIsMouseEnter(false);
    };

    const handleProfileChangeClick = () => {
        fileInputRef.current.click();
    };

    const handleNameChange = () => {
        setIsChangeAboutVisible(false);
        setIsVisibleNameChangeModal(true);
    };

    const handleAboutChange = () => {
        setIsVisibleNameChangeModal(false);
        setIsChangeAboutVisible(true);
    };

    const handleLogout = () => {
        removeCookie("token");
        navigator("/login");
    };

    const changeData = async (type, inputData) => {
        const endPoint = `/contact/update/${type}`;
        if (!inputData) {
            alert("empty input field");
            return 0;
        }
        const data =
            type === "name" ? { name: inputData } : { about: inputData };
        try {
            console.log(data);
            const responce = await axios.put(endPoint, data, {
                headers: {
                    Authorization: `Bearer ${getCookie("token")}`,
                },
            });
            if (!responce) {
                throw new Error("error in updating");
            }
            setIsChangeAboutVisible(false);
            setIsVisibleNameChangeModal(false);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleProfileUpdate = async (e) => {
        const file = e.target.files[0];
        const fromData = new FormData();
        try {
            fromData.set("profile", file);
            const responce = await axios.put("/contact/update/profile", fromData, {
                headers: {
                    Authorization: `Bearer ${getCookie("token")}`,
                },
            });
            if (!responce) throw new Error("error in updating");
            imgRef.current.src = URL.createObjectURL(file);
            console.log(responce);
        } catch (error) {
            console.log(error);
        }
    };

    const EditJsx = ({ type }) => {
        const [inputData, setInputData] = useState();
        return (
            <div className={`edit-${type}`}>
                <ImCross
                    onClick={() => {
                        setIsChangeAboutVisible(false);
                        setIsVisibleNameChangeModal(false);
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
                    <div
                        className={
                            isMouseEnter ? "profile-pic overlay" : "profile-pic"
                        }
                        onClick={handleProfileChangeClick}
                        onMouseEnter={handleProfileHover}
                        onMouseLeave={handleMouseLeave}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            ref={fileInputRef}
                            onChange={handleProfileUpdate}
                            className="photo-input"
                        />
                        <div className="pic">
                            <img
                                ref={imgRef}
                                src={user.profile}
                                alt="profile"
                                width={50}
                            />
                        </div>
                        {isMouseEnter && (
                            <BsCameraFill className="profile-camera" />
                        )}
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
                                <p className="info-value">{user.phone}</p>
                            </div>
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
                    {isChangeAboutVisible && <EditJsx type={"about"} />}
                    {isVisibleNameChangeModal && <EditJsx type={"name"} />}
                </div>
            </div>
        )
    );
};

export default ProfileModal;
