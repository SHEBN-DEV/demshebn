"use client"

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import CardProfile from "../components/CardProfile";
import PersonalData from "../components/PersonalData";
import EditDocuments from "../components/EditDocuments";
import EditPrivacy from "../components/EditPrivacy";



const editProfile = () => {
    const [activeSection, setActiveSection] = useState('personal'); // Estado para controlar qué sección mostrar

    const renderSection = () => {
        switch(activeSection) {
            case 'personal':
                return <PersonalData />;
            case 'documents':
                return <EditDocuments />;
            case 'privacy':
                return <EditPrivacy />;
            default:
                return <PersonalData />;
        }
    };

    return(
        <div className="min-h-screen bg-black text-white">
            <div className="flex flex-col lg:flex-row">
                {/* Sidebar */}
                <div className="w-full lg:w-1/5">
                    <Sidebar />
                </div>
                
                {/* Contenido principal */}
                <div className="w-full lg:w-4/5">
                    {/* Fondo degradado */}
                    <div className="w-full h-32 lg:h-45 bg-gradient-to-r from-[#090909] to-[#ff29d7]"></div>
                    
                    {/* Contenido del perfil */}
                    <div className="flex flex-col lg:flex-row px-4 lg:px-0 -mt-8 lg:-mt-16">
                        {/* Card del perfil */}
                        <div className="w-full lg:w-1/3 xl:w-1/4 mb-6 lg:mb-0 flex justify-center lg:block">
                            <CardProfile />
                        </div>
                        
                        {/* Secciones a editar */}
                        <div className="w-full flex flex-col items-center space-y-6 lg:pl-8">
                            <div className="w-full lg:w-5/6 bg-black rounded-xl"> 
                                {/* Navegación de pestañas */}
                                <div className="flex flex-col sm:flex-row items-center justify-around border-b border-gray-500">
                                    <button 
                                        onClick={() => setActiveSection('personal')}
                                        className={`cursor-pointer w-full sm:w-auto px-4 py-3 text-center ${
                                            activeSection === 'personal' 
                                            ? 'text-[#ff29d7] border-b-2 border-[#ff29d7]' 
                                            : 'text-white hover:text-gray-300'
                                        }`}
                                    >
                                        Personal Data
                                    </button>
                                    <button 
                                        onClick={() => setActiveSection('documents')}
                                        className={`cursor-pointer w-full sm:w-auto px-4 py-3 text-center ${
                                            activeSection === 'documents' 
                                            ? 'text-[#ff29d7] border-b-2 border-[#ff29d7]' 
                                            : 'text-white hover:text-gray-300'
                                        }`}
                                    >
                                        Documents
                                    </button>
                                    <button 
                                        onClick={() => setActiveSection('privacy')}
                                        className={`cursor-pointer w-full sm:w-auto px-4 py-3 text-center ${
                                            activeSection === 'privacy' 
                                            ? 'text-[#ff29d7] border-b-2 border-[#ff29d7]' 
                                            : 'text-white hover:text-gray-300'
                                        }`}
                                    >
                                        Privacy
                                    </button>
                                </div>

                                {/* Contenido de la sección */}
                                <div className="p-4 lg:p-6">
                                    {renderSection()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default editProfile;