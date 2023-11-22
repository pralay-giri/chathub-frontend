import React from "react";
import "../../Styles/errormodal_successmodal.css";

const ErrorModal = ({ handleError, errorMsg }) => {
    return (
        <div className="errormodal-background">
            <div className="errormodal">
                <h1 className="errormodal-header">Sorry!</h1>
                <p className="errormodal-info">{errorMsg}</p>
                <button
                    className="errormodal-btn"
                    onClick={() => {
                        handleError(false);
                    }}
                    autoFocus
                >
                    ok
                </button>
            </div>
        </div>
    );
};

export default ErrorModal;
