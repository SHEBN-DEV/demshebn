"use client"
import React from "react";
import Sidebar from "../components/Sidebar";
import OnlineFriendsList from "../components/OnlineFriendsList";
import FriendCard from "../components/FriendCard";
import TrendingCard from "../components/TrendingCard";
import withAuth from "../components/withAuth";

const ProfileFriends = () => {

    return(
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#0a0a0a] text-white">
            
            {/* Bloque 1 */}
            <div className="w-full lg:w-1/5">
                <Sidebar />
            </div>
            

            {/* Bloque 2 */}
            <div className="w-full lg:w-3/5 flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-6">

                {/* ---Nuevo Bloque--- */}
                <div className="px-2 sm:px-4">
                    <p className="text-xl sm:text-2xl font-bold">Find a Friend</p>
                </div>

                {/* Carrusel Friends */}
                <div className="px-2 sm:px-4">
                    <FriendCard />
                </div>
                
                <div className="px-2 sm:px-4 pt-2">
                    <p className="text-xl sm:text-2xl font-bold">Trending</p>
                </div>
                
                <div className="px-2 sm:px-4">
                    <TrendingCard />
                </div>
            </div>

            {/* Bloque 3 */}
            <div className="w-full lg:w-1/5">
                <OnlineFriendsList />
            </div>
        </div>
    );
};

export default withAuth(ProfileFriends);