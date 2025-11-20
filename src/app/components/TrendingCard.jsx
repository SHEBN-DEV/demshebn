import { AiOutlineLike } from "react-icons/ai";
import { FaRegMessage } from "react-icons/fa6";
import { PiShareFat } from "react-icons/pi";

const TrendingCard = () => {

    const trending = [
        { id: 1, name: 'Trending 1', image: 'images/home/LogoRosa.png' },
       
    ];

    return(
        <div className="relative w-full bg-black rounded-xl p-4 md:p-6 shadow-gray-400 shadow-md">
            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-0">
                <img src="images/home/LogoRosa.png" 
                    alt="LogoRosa" 
                    className="size-12 sm:size-16 rounded-full object-cover"
                    loading="lazy" 
                />
                <div className="text-center sm:text-left sm:pl-4">
                    <p className="text-lg sm:text-xl font-bold">SHEBN</p>
                    <p className="text-sm sm:text-base">20 min ago</p>
                </div>
            </div>

            {/* Cuerpo */}
            <div className="flex flex-col md:flex-row mt-4 md:mt-6 gap-4 md:gap-0">
                <div className="w-full md:w-2/3 flex flex-col justify-center gap-2 md:pr-4">
                    <p className="text-sm md:text-base font-bold">Bolivia Blockchain Week.</p>
                    <p>Bolivia Blockchain Week is coming up this October 24th and 25th. 
                    Women of Bolivia, it's time to be part of the blockchain revolution!</p>
                    <p className="font-bold">Free tickets →</p> 
                    <p className="flex">http://boliviablockchainweek.la</p>
                </div>
                <div className="w-full md:w-1/3 flex justify-center mt-2 md:mt-0">
                    <img src="images/treding/LogoBolivia.png" alt="LogoBolivia" className="max-w-[120px] md:max-w-full"/>
                </div>
            </div>

            {/* Interaccion */}
            <div className="flex justify-between md:justify-start md:gap-20 mt-4 md:mt-6">
                <div className="flex items-center">
                    <AiOutlineLike /> <p className="pl-2">245</p>
                </div>
                <div className="flex items-center">
                    <FaRegMessage /> <p className="pl-2">99</p>
                </div>
                <div className="flex items-center">
                    <PiShareFat /> <p className="pl-2">222</p>
                </div>
            </div>

        </div>
    );
};

export default TrendingCard;