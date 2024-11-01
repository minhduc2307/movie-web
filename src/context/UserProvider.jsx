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
    const [favoriteList, setFavoriteList] = useState(() => {
        const savedFavoriteList = localStorage.getItem("favoriteList");
        return savedFavoriteList ? JSON.parse(savedFavoriteList) : [];
    });

    useEffect(() => {
        if (userInfo) {
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
        } else {
            localStorage.removeItem("userInfo");
        }
    }, [userInfo]);

    useEffect(() => {
        if (favoriteList) {
            localStorage.setItem("favoriteList", JSON.stringify(favoriteList));
        } else {
            localStorage.removeItem("favoriteList");
        }
    }, [favoriteList]);

    return (
        <UserContext.Provider
            value={{ userInfo, setUserInfo, favoriteList, setFavoriteList }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
