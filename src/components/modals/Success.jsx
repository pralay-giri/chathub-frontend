import React from "react";
import "../../Styles/errormodal_successmodal.css";

const Success = ({ closeModal, successMsg }) => {
    return (
        <div className="successmodal-background">
            <div className="successmodal">
                <h1 className="successmodal-header">Done</h1>
                <p className="successmodal-info">{successMsg}</p>
                <button
                    className="successmodal-btn"
                    onClick={() => {
                        closeModal(false);
                    }}
                    autoFocus
                >
                    ok
                </button>
            </div>
        </div>
    );
};

export default Success;
