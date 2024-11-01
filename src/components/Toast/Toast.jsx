import { createRoot } from "react-dom/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./toast.css";
import {
    faCheckCircle,
    faCircleInfo,
    faClose,
    faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

export function toast({
    title = "",
    message = "",
    type = "success",
    duration = 3000,
}) {
    const main = document.getElementById("toast");
    const icons = {
        success: faCheckCircle,
        info: faCircleInfo,
        warning: faTriangleExclamation,
        error: faTriangleExclamation,
    };
    const icon = icons[type];
    if (main) {
        const toastContainer = document.createElement("div");
        toastContainer.classList.add("toast-container");
        const delay = (duration / 1000).toFixed();

        const autoRemoveId = setTimeout(() => {
            main.removeChild(toastContainer);
        }, duration + 1000);

        toastContainer.addEventListener("click", (e) => {
            if (e.target.closest(".toast__close")) {
                main.removeChild(toastContainer);
                clearTimeout(autoRemoveId);
            }
        });

        const root = createRoot(toastContainer);
        root.render(
            <div
                className={`toast toast--${type}`}
                style={{
                    animation: `slideInLeft ease 0.3s, fadeOut linear 1s ${delay}s forwards`,
                }}
            >
                <div className="toast__icon">
                    <FontAwesomeIcon icon={icon} />
                </div>
                <div className="toast__body">
                    <h3 className="toast__title">{title}</h3>
                    <p className="toast__msg">{message}</p>
                </div>
                <div className="toast__close">
                    <FontAwesomeIcon icon={faClose} />
                </div>
            </div>,
        );
        main.appendChild(toastContainer);
    }
}

export const showSuccessToast = (
    title = "Thành công",
    message = "",
    duration = 3000,
) => {
    toast({
        title: title,
        message: message,
        type: "success",
        duration: duration,
    });
};

export const showErrorToast = () => {
    toast({
        title: "Thất bại",
        message: "Có lỗi xảy ra",
        type: "error",
        duration: 5000,
    });
};
const Toast = () => {
    return (
        <div>
            <div id="toast"></div>
        </div>
    );
};
export default Toast;
