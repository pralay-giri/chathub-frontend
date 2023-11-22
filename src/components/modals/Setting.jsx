import React from "react";
import { ImCross } from "react-icons/im";
import { MdDelete } from "react-icons/md";
import "../../Styles/setting.css";

const Setting = ({ closeSettingModal, deleteAllChat}) => {
    return (
        <div className="message-setting-background">
            <div className="message-setting">
                <div className="header">
                    <p className="header-text">setting</p>
                    <ImCross onClick={() => closeSettingModal()} className="close-btn"/>
                </div>
                <section className="setting-container">
                    <p className="settings" onClick={deleteAllChat}><MdDelete /> delete all chat</p>
                </section>
            </div>
        </div>
    );
};

export default Setting;
