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
    useEffect(() => {
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

                responce.data.map((group) => {
                    group.profile = URL.createObjectURL(
                        new Blob([new Uint8Array(group.profile.data)])
                    );
                });

                console.log(responce.data);
                // preserving all the group data
                setGroups(responce.data);
                console.log(responce.data);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                setIsError(false);
                setErrorMsg(error.message);
            }
        };
        if(!groups.length){
            fetchGroups();
        }
    }, []);
    const handleError = () => {
        setIsError(false);
    };

    const handleContactClick = (group) => {
        console.log(group);
        setSelectedContact(group);
    };

    return (
        <div className="chatlist">
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
