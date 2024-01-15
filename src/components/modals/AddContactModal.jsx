import React, { useContext, useState } from "react";
import "../../Styles/addContactModal.css";
import { ImCross } from "react-icons/im";
import axios from "axios";
import { getCookie } from "../../Cookie/cookieConfigure";
import { context } from "../../context/UserContext";

function AddContactModal({ closeModal, handleError, handleSuccess }) {
    const [inputData, setInputData] = useState("");
    const { setHasMore } = useContext(context);

    const handleClick = async (e) => {
        e.preventDefault();
        const payload = {
            email: inputData,
        };
        try {
            const response = await axios.post("/contact/addcontact", payload, {
                headers: {
                    Authorization: `Bearer ${getCookie("token")}`,
                },
            });
            setHasMore(true);
            closeModal(false);
            handleSuccess(true);
        } catch (error) {
            closeModal(false);
            handleError(error.response.data);
        }
    };

    return (
        <div className="add-contact-modal-background">
            <div id="add-contact-modal">
                <div id="add-contact-modal-head">
                    <p>add your contact</p>
                    <button
                        onClick={() => {
                            closeModal(false);
                        }}
                    >
                        <ImCross />
                    </button>
                </div>
                <input
                    type="email"
                    value={inputData}
                    autoFocus
                    onChange={(e) => {
                        setInputData(e.target.value);
                    }}
                    placeholder="email"
                    id="add-contact-modal-body"
                />
                <div id="add-contact-modal-footer">
                    <button id="closeBtn" onClick={handleClick}>
                        Add
                    </button>
                    <button
                        id="closeBtn"
                        onClick={() => {
                            closeModal(false);
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddContactModal;
