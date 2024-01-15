import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import defaultPtofile from "../Media/profile.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import axios from "axios";
import { auth } from "../Cookie/auth";
import { getCookie } from "../Cookie/cookieConfigure";
import { generateKeys } from "../utils/cryptoGraphy";

function Signin() {
    const [phone, setPhone] = useState("");
    const [gmail, setGmail] = useState("");
    const [password, setPassword] = useState("");
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoadding, setLoadding] = useState(false);
    const navigate = useNavigate();

    // cheacking if the user has his sassion
    useEffect(() => {
        const token = getCookie("token");
        const user = auth(token);
        if (user) {
            navigate("/chatpage");
        }
    }, [navigate]);

    const handlePasswordInput = (e) => {
        e.preventDefault();
    };

    const handleSubmit = async (e) => {
        setLoadding(true);
        e.preventDefault();
        const fullName = `${firstName} ${lastName}`.toUpperCase();
        if (fullName && password && gmail) {
            const keys = await generateKeys();
            localStorage.setItem("privateKey", keys.privateKey);
            const payload = {
                name: fullName,
                password,
                gmail,
                phone,
                publicKey: keys.publicKey,
            };
            try {
                const responce = await axios.post(
                    "/createuser/signin",
                    payload
                );
                if (responce) {
                    console.log(responce);
                    setLoadding(false);
                    navigate("/login");
                }
            } catch (error) {
                setLoadding(false);
                alert(error?.response?.data);
            }
        } else {
            setLoadding(false);
            alert("plese fill the required field");
        }
    };

    return (
        <form id="signin" onSubmit={handleSubmit}>
            <div className="profileDiv">
                <img
                    src={defaultPtofile}
                    alt="profile"
                    width={100}
                    className="profile"
                    name="profilePhoto"
                />
            </div>
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
                    placeholder="phone"
                    onChange={(e) => {
                        setPhone(e.target.value);
                    }}
                />
            </div>
            <div className="gmail inputField">
                <input
                    type="email"
                    value={gmail}
                    required
                    placeholder="*gmail"
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
