import React, { useEffect, useContext, useState, useCallback } from "react";
import axios from "axios";
import { context } from "../context/UserContext";
import { getCookie } from "../Cookie/cookieConfigure";
import Contact from "./Contact";

const LIMIT = 4;
function PersonalChat() {
    const {
        contacts,
        setContacts,
        page,
        setPage,
        setSelectedContact,
        hasMore,
        prevDataLength,
        setPrevDataLength,
        setHasMore,
    } = useContext(context);
    const [loadding, setLoadding] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoadding(true);
            const responce = await axios.get("/getallcontacts", {
                headers: {
                    Authorization: `Bearer ${getCookie("token")}`,
                },
                params: {
                    page,
                    limit: LIMIT,
                    prevDataLength,
                },
            });
            const contacts = responce?.data;
            if (contacts.length === 0) {
                setHasMore(false);
                setLoadding(false);
                return 0;
            }

            // setting the contacts with profile photo
            setContacts((prevContacts) => {
                return [...prevContacts, ...contacts];
            });
            setPrevDataLength(responce.data.length);
            setPage((prev) => prev + 1);
            setLoadding(false);
        } catch (error) {
            setLoadding(false);
        }
    }, [page, setContacts, setLoadding, setHasMore, setPage]);

    useEffect(() => {
        if (hasMore) {
            fetchData();
        }
    }, [page, setContacts, fetchData, hasMore]);

    const handleScroll = useCallback(
        (e) => {
            const chatListDiv = e.target;
            if (
                chatListDiv.offsetHeight + chatListDiv.scrollTop + 1 >=
                    chatListDiv.scrollHeight &&
                hasMore
            ) {
                setPage((prev) => prev + 1);
            }
        },
        [setPage, hasMore]
    );

    useEffect(() => {
        document
            .querySelector(".chatListdiv")
            .addEventListener("scroll", handleScroll);
    }, [handleScroll]);

    const handleSelectedContact = (contact) => {
        setSelectedContact(contact);
    };
    return (
        <div className="chatlist">
            {!contacts.length && (
                <p className="no-contact">did't have any contacts</p>
            )}
            {contacts.map((contact, index) => {
                return (
                    <Contact
                        key={index}
                        contact={contact}
                        onChildClick={handleSelectedContact}
                    />
                );
            })}
            {loadding && <p>loadding...</p>}
        </div>
    );
}

export default PersonalChat;
