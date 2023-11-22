import React, { createContext, useState } from "react";

export const context = createContext();

export const UserContext = ({ children }) => {
    // loged in user's data
    const [user, setUser] = useState();
    // when any one contact selected then it store
    const [selectedContact, setSelectedContact] = useState();
    // all the users contact is store here
    const [contacts, setContacts] = useState([]);
    // all the groups is store here
    const [groups, setGroups] = useState([]);
    // it's used for how many pages(conatact per page can have 4) load
    const [page, setPage] = useState(1);
    // state for how many data can achive from database
    const [prevDataLength, setPrevDataLength] = useState(0);
    // state for if user have more data
    const [hasMore, setHasMore] = useState(true);
    // storing the notification
    const [notifications, setNotifications] = useState([]);
    return (
        <context.Provider
            value={{
                user,
                setUser,
                selectedContact,
                setSelectedContact,
                contacts,
                setContacts,
                page,
                setPage,
                prevDataLength,
                setPrevDataLength,
                hasMore,
                setHasMore,
                groups,
                setGroups,
                notifications,
                setNotifications,
            }}
        >
            {children}
        </context.Provider>
    );
};
