import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { getCookie } from "../Cookie/cookieConfigure";
import { context } from "../context/UserContext";
import Loadding from "./modals/Loadding";
import ErrorModal from "./modals/ErrorModal";
import GroupContact from "./GroupContact";

const GroupChat = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const { groups, setGroups, setSelectedContact } = useContext(context);

    const fetchGroups = async () => {
        try {
            setIsLoading(true);
            const responce = await axios.get("/contact/getGroups", {
                headers: {
                    authorization: `Bearer ${getCookie("token")}`,
                },
            });
            if (!responce) {
                throw new Error("error in fetching data");
            }

            setGroups(responce.data);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setIsError(false);
            setErrorMsg(error.message);
        }
    };

    useEffect(() => {
        if (!groups.length) {
            fetchGroups();
        }
    }, []);
    const handleError = () => {
        setIsError(false);
    };

    const handleContactClick = (group) => {
        setSelectedContact(group);
    };

    return (
        <div className="chatlist">
            {!groups.length && (
                <p className="no-contact">did't have any contacts</p>
            )}
            {groups.map((group, index) => (
                <GroupContact
                    group={group}
                    handleChildClick={handleContactClick}
                    key={index}
                />
            ))}
            {isLoading && <Loadding />}
            {isError && (
                <ErrorModal errorMsg={errorMsg} handleError={handleError} />
            )}
        </div>
    );
};

export default GroupChat;
