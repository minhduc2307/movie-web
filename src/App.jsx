import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function App() {
    return (
        <div>
            <header className="flex py-5 bg-slate-950 text-white justify-between px-8 text-[1vw] font-medium">
                <div className="flex items-center">
                    <h1 className="uppercase text-red-500 font-bold text-[1.4vw]">
                        <a href="/">Mọt phim</a>
                    </h1>
                    <nav className="mx-6">
                        <ul className="flex gap-4">
                            <li>
                                <a href="#!">Phim</a>
                            </li>
                            <li>
                                <a href="#!">TV</a>
                            </li>
                        </ul>
                    </nav>
                    <a href="#!">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </a>
                </div>
                <div className="flex items-center gap-5">
                    <a href="#!">Đăng nhập</a>
                    <a href="#!" className="h-11 px-5 bg-[#ffb700] text-[#171c28] flex items-center justify-center rounded-2xl ml-5">Đăng ký</a>
                </div>
            </header>
        </div>
    );
}

export default App;
