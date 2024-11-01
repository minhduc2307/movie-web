import { createContext, useContext, useEffect, useState } from "react";

const ModalContext = createContext();

export const useModalContext = () => {
    return useContext(ModalContext);
};

const ModalProvider = ({ children }) => {
    const [showModal, setShowModal] = useState(false);
    const [content, setContent] = useState();

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [showModal]);

    const openPopup = (content) => {
        setShowModal(true);
        setContent(content);
    };

    return (
        <ModalContext.Provider value={{ openPopup }}>
            {children}
            {showModal && (
                <div className="fixed inset-0">
                    <div className="absolute inset-0 bg-slate-800/60"></div>
                    <div
                        className="absolute inset-0 flex cursor-pointer items-center justify-center"
                        onClick={() => setShowModal(false)}
                    >
                        {content}
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
};
export default ModalProvider;
