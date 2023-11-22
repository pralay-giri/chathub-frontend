import React from "react";
import { ImCross } from "react-icons/im";
import "../../Styles/notification.css";

const NotificationModal = ({
    notifications,
    deleteNotification,
    closeNotificationModal,
}) => {
    return (
        <div className="notification-model">
            <div className="notification-header">
                <p className="title">notifications</p>
                <ImCross
                    onClick={() => {
                        closeNotificationModal();
                    }}
                    className="notification-modal-close-btn"
                />
            </div>
            <div className="notification-container">
                {notifications.length ? (
                    notifications.map((notification) => {
                        return (
                            <div className="notification">
                                <div className="notification-content">
                                    <h2 className="sender-name">
                                        {notification.sender.split(" ")[0]}
                                    </h2>
                                    <p className="message">
                                        {notification.messageContent}
                                        <span className="timestamp">
                                            {new Date(
                                                notification.timeStamp
                                            ).toLocaleDateString()}
                                        </span>
                                    </p>
                                </div>
                                <ImCross
                                    onClick={() =>
                                        deleteNotification(notification)
                                    }
                                    className="notification-delete"
                                />
                            </div>
                        );
                    })
                ) : (
                    <p className="no-notification">did't have any notification</p>
                )}
            </div>
        </div>
    );
};

export default NotificationModal;
