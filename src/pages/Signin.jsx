import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import defaultPtofile from "../Media/profile.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import axios from "axios";
import { auth } from "../Cookie/auth";
import { getCookie } from "../Cookie/cookieConfigure";
const API = "http://localhost:5500/createuser/signin";

function Signin() {
    const [phone, setPhone] = useState("");
    const [gmail, setGmail] = useState("");
    const [fileData, setFileData] = useState();
    const [profile, setProfile] = useState();
    const [password, setPassword] = useState("");
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoadding, setLoadding] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = useRef("");

    // cheacking if the user has his sassion
    useEffect(() => {
        const token = getCookie("token");
        const user = auth(token);
        if(user){
            navigate("/chatpage");
        }
    }, [navigate]);

    // previewing the selected photo for profile
    const handleProfilePhoto = (e) => {
        if (e.target.files.length) {
            const url = URL.createObjectURL(e.target.files[0]);
            setFileData(e.target.files[0]);
            setProfile(url);
        }
    };

    // removing the default file input btn
    const getInputFile = () => {
        fileInputRef.current.click();
    };

    // preventing the default beheaver of button on form
    const handlePasswordInput = (e) => {
        e.preventDefault();
    };

    // requesting API
    const handleSubmit = async (e) => {
        setLoadding(true);
        e.preventDefault();
        const fullName = `${firstName} ${lastName}`.toUpperCase();
        if (fullName && phone && password && profile) {
            const fromData = new FormData();
            fromData.set("name", fullName);
            fromData.set("phone", phone);
            fromData.set("password", password);
            fromData.set("gmail", gmail);
            fromData.set("profilePhoto", fileData);
            try {
                const responce = await axios.post("/createuser/signin", fromData);
                if (responce) {
                    setLoadding(false);
                    navigate("/login");
                }
            } catch (error) {
                console.log(error);
                setLoadding(false);
                alert("Registration faild");
            }
        } else {
            setLoadding(false);
            alert("field empty");
        }
    };

    return (
        <form id="signin" onSubmit={handleSubmit}>
            <div
                className="profileDiv"
                onMouseEnter={(e) => {
                    const elm = document.createElement("div");
                    elm.innerText = "select profile";
                    elm.className = "hoverDiv";
                    elm.setAttribute(
                        "style",
                        "position: absolute; background-color: var(--online-indecator);font-size: 10px;border-radius: 3px; opacity: .8;"
                    );
                    document.body.appendChild(elm);
                }}
                onMouseMove={(e) => {
                    const element = document.querySelector(".hoverDiv");
                    if (element) {
                        element.style.top = `${e.clientY}px`;
                        element.style.left = `${e.clientX}px`;
                    }
                }}
                onMouseOut={(e) => {
                    const element = document.querySelector(".hoverDiv");
                    if (element) {
                        document.body.removeChild(element);
                    }
                }}
            >
                <img
                    src={profile ? profile : defaultPtofile}
                    alt="profile"
                    width={100}
                    className="profile"
                    onClick={getInputFile}
                    name="profilePhoto"
                />
            </div>
            <input
                type="file"
                accept="image/*"
                onChange={handleProfilePhoto}
                hidden
                ref={fileInputRef}
                className="file-input"
            />
            <div className="firstName inputField">
                <input
                    type="text"
                    value={firstName}
                    placeholder="*fistName"
                    required
                    onChange={(e) => {
                        setFirstName(e.target.value);
                    }}
                />
            </div>
            <div className="lastName inputField">
                <input
                    type="text"
                    value={lastName}
                    placeholder="*lastName"
                    required
                    onChange={(e) => {
                        setLastName(e.target.value);
                    }}
                />
            </div>
            <div className="phone inputField">
                <input
                    type="number"
                    value={phone}
                    placeholder="*phone"
                    required
                    onChange={(e) => {
                        setPhone(e.target.value);
                    }}
                />
            </div>
            <div className="gmail inputField">
                <input
                    type="email"
                    value={gmail}
                    placeholder="gmail"
                    onChange={(e) => {
                        setGmail((prev) => e.target.value);
                    }}
                />
            </div>
            <div className="password inputField">
                <input
                    type={isPasswordVisible ? "text" : "password"}
                    value={password}
                    placeholder="*password"
                    autoComplete="password"
                    required
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                <button onClick={handlePasswordInput}>
                    {isPasswordVisible ? (
                        <FaEyeSlash
                            id="hidePassword"
                            onClick={() => setIsPasswordVisible(false)}
                        />
                    ) : (
                        <FaEye
                            id="showPassword"
                            onClick={() => setIsPasswordVisible(true)}
                        />
                    )}
                </button>
            </div>
            <button type="submit">
                {isLoadding ? "loadding..." : "signin"}
            </button>
            <p className="info">
                already have account <Link to="/login">login</Link>
            </p>
        </form>
    );
}

export default Signin;
