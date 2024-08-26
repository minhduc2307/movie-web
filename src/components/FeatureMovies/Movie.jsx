const Movie = () => {
    return (
        <div>
            <img
                src="https://image.tmdb.org/t/p/original/1E5baAaEse26fej7uHcjOgEE2t2.jpg"
                alt=""
                className="aspect-video brightness-50 w-full h-[100vh] object-cover"
            />
            <div className="absolute bottom-[15%] left-8 w-1/2 sm:w-1/3">
                <div>
                    <h3 className="font-bold sm:text-[2vw] mb-2">Fast & Furious</h3>
                    <div className="flex items-center gap-4 text-[1.2vw]">
                        <p className="text-gray-400 border border-[#d2d1d6] inline-block p-2">18+</p>
                        <p className="">2024/08/16</p>
                    </div>
                </div>
                <div>
                    <div className="hidden sm:block text-[1.2vw] mt-5">
                        <p className="font-bold mb-2 text-[1.3vw]">Overview</p>
                        <p>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloremque voluptate reiciendis
                            dolorum pariatur ducimus repellendus beatae explicabo eum quibusdam hic.
                        </p>
                    </div>
                    <button className="mt-4 bg-slate-300/30 rounded py-2 px-4 text-[10px] lg:text-lg">Thông tin</button>
                </div>
            </div>
        </div>
    );
};
export default Movie;
