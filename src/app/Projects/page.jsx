"use client"
import React from "react";
import Sidebar from "../components/Sidebar";
import Discover from "../components/Discover";
import TrendingCards from "../components/TrendingCards";
import CategoryGrid from "../components/CategoryGrid";
//import withAuth from "../components/withAuth";


const Projects = () => {

    return(
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#1a1718] text-white">
            {/* bloque 1 */}
            <div className="w-full lg:w-1/5">
                <Sidebar />
            </div>

            {/* bloque 2 */}
            <div className="w-full flex flex-col py-2">
                <div className="w-full px-4 md:px-6 lg:px-10 xl:w-full">
                    <Discover />
                    <p className="text-2xl font-bold my-4 mt-2 lg:mt-4">Trending</p>
                    <TrendingCards />
                </div>
                
                <div className="mt-6 lg:mt-8">
                    <CategoryGrid />
                </div>
            </div>
        </div>
    );
};

export default Projects;