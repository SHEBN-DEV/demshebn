"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../SupabaseClient";
import withAuth from "../components/withAuth";
import Sidebar from "../components/Sidebar";

const MyProfile = () => {
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener el usuario autenticado
                const { data: { user }, error: userError } = await supabase.auth.getUser();

                if (userError || !user) {
                    console.error("Usuario no autenticado:", userError);
                    setLoading(false);
                    return;
                }

                // Consulta a la tabla profiles
                const { data: profileData, error: profileError } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                if (!profileError && profileData) {
                    setUserProfile(profileData);
                }

                // Consulta a la tabla edit_profile
                const { data: editProfileData, error: editProfileError } = await supabase
                    .from("edit_profile")
                    .select("*")
                    .eq("user_id", user.id)
                    .single();

                if (!editProfileError && editProfileData) {
                    setProfile(editProfileData);
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-white">Cargando perfil...</div>;
    if (!profile && !userProfile) return <div className="text-white">No se pudo cargar el perfil.</div>;

    const handleEditProfile = () => {
        router.push('/editProfile');
    };

    return (
        <div className="min-h-screen flex justify-center bg-black text-white">
            {/* Bloque 1 */}
            <div className="w-full lg:w-1/5">
                <Sidebar />
            </div>
            

            {/* Bloque 2 */}
            <div className="md:w-full">
                <div className="w-full h-64 bg-gradient-to-r from-[#090909] to-[#ff29d7]"></div>
                <div className="md:relative flex items-start bottom-9 left-0">
                    <div className="w-1/2 flex items-center pl-4">
                        <div className="md:relative w-1/2 md:w-1/4">
                            <img 
                                className="w-15 h-15 md:w-30 md:h-30 rounded-full border-4 border-[#1a1718]" 
                                src="/images/profile/woman.jpg" 
                                alt="Photo" 
                            />
                            <div className="w-3 h-3 md:w-5 md:h-5 bg-green-500 rounded-full md:absolute bottom-162 left-8 md:bottom-0 md:left-4"></div>
                        </div>
                        <div>
                            <p className="text-3xl font-bold">{userProfile?.full_name || "Nombre no disponible"}</p>
                            <p className="text-sm">{userProfile?.user_name || "Usuario no disponible"}</p>
                        </div>
                    </div>
                    <div className="w-1/2 md:relative flex justify-center pt-4">
                        <button 
                            onClick={handleEditProfile}
                            className="bg-black border border-white rounded-3xl px-8 py-2 text-sm font-semibold hover:bg-[#ff29d7] md:px-14 md:py-2"
                        >
                            EDIT PROFILE
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-10 p-4 md:py-10">
                    <div className="">
                        <p className="text-lg font-semibold">Experience</p>
                        <p className="text-base">{profile?.experience || "Experiencia no disponible"}</p>
                    </div>
                    <div className="w-5/6 border-b-2 border-gray-500 mx-auto"></div>
                    <div className="flex items-start justify-between">
                        <div className="w-1/2 flex flex-col gap-2">
                            <p className="text-lg font-semibold">About Me</p>
                            <p className="text-base">
                                {profile?.about || "Información no disponible"}
                            </p>
                            <a href="#" className="text-lg font-bold text-[#ff29d7] pt-6 hover:underline">Read More</a>
                        </div>
                        <div className="w-2/5 flex flex-col gap-2">
                            <p className="text-lg font-semibold">Location</p>
                            <div className="flex items-center gap-x-2">
                                <img className="w-10 h-10 rounded-full" src="/images/profile/fondo-inferior.png" alt="Pais" />
                                <p>{profile?.location || "Ubicación no disponible"}</p>
                            </div>
                            <p className="text-lg font-semibold pt-4">Portfolio</p>
                            <a href={profile?.portfolio_url || "#"} className="text-base hover:text-[#ff29d7]">
                                {profile?.portfolio_url || "Portfolio no disponible"}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withAuth(MyProfile);