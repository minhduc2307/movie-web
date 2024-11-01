import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const useUserContext = () => {
    return useContext(UserContext);
};

const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(() => {
        const savedUserInfo = localStorage.getItem("userInfo");
        return savedUserInfo ? JSON.parse(savedUserInfo) : null;
    });

    useEffect(() => {
        if (userInfo) {
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
        } else {
            localStorage.removeItem("userInfo");
        }
    }, [userInfo]);

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
