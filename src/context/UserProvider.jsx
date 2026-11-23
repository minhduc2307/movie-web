import { createContext, useContext, useEffect, useRef, useState } from "react";

const UserContext = createContext();

export const useUserContext = () => {
    return useContext(UserContext);
};

const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(() => {
        try {
            const savedUserInfo = localStorage.getItem("userInfo");
            return savedUserInfo ? JSON.parse(savedUserInfo) : null;
        } catch {
            return null;
        }
    });

    const [favoriteList, setFavoriteList] = useState(() => {
        try {
            const savedUserInfo = localStorage.getItem("userInfo");
            const parsedUser = savedUserInfo ? JSON.parse(savedUserInfo) : null;
            if (parsedUser?.email) {
                const saved = localStorage.getItem(
                    `user_favorites_${parsedUser.email}`
                );
                if (saved) return JSON.parse(saved);
                const legacy = localStorage.getItem("favoriteList");
                if (legacy) return JSON.parse(legacy);
                return [];
            }
            return [];
        } catch {
            return [];
        }
    });

    const currentEmailRef = useRef(userInfo?.email);

    useEffect(() => {
        const nextEmail = userInfo?.email;
        if (userInfo) {
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
        } else {
            localStorage.removeItem("userInfo");
        }

        if (nextEmail !== currentEmailRef.current) {
            currentEmailRef.current = nextEmail;
            if (nextEmail) {
                try {
                    const saved = localStorage.getItem(
                        `user_favorites_${nextEmail}`
                    );
                    setFavoriteList(saved ? JSON.parse(saved) : []);
                } catch {
                    setFavoriteList([]);
                }
            } else {
                setFavoriteList([]);
            }
        }
    }, [userInfo]);

    useEffect(() => {
        const email = userInfo?.email;
        if (email && email === currentEmailRef.current) {
            localStorage.setItem(
                `user_favorites_${email}`,
                JSON.stringify(favoriteList)
            );
        }
    }, [favoriteList, userInfo?.email]);

    return (
        <UserContext.Provider
            value={{ userInfo, setUserInfo, favoriteList, setFavoriteList }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
