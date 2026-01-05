"use client";

import { useState, useEffect } from "react";
import { IoIosArrowDroprightCircle, IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// Hook personalizado para detectar tamaño de pantalla
const useScreenSize = () => {
    const [screenSize, setScreenSize] = useState({
      width: typeof window !== 'undefined' ? window.innerWidth : 0,
      height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });
  
    useEffect(() => {
      const handleResize = () => {
        setScreenSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    return screenSize;
};

const FriendCard = () => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const screenSize = useScreenSize();

    // Calcula friendsPerPage dinámicamente según el ancho de pantalla
    const getFriendsPerPage = () => {
        if (screenSize.width < 640) return 2;    // móvil: 2 amigos
        if (screenSize.width < 1024) return 3;   // tablet: 3 amigos
        return 3;                                // desktop: 4 amigos
    };

    const friendsPerPage = getFriendsPerPage();
    
    /* Lista de amigos prueba*/
    const friends = [
        { id:'1', name: 'Daniela Beyo1', role: 'Developer', status: 'Open to door', image: '/images/profile/woman.jpg' },
        { id:'2', name: 'Selena Lo2', role: 'Marketing', status: 'CMO VueWallet', image: '/images/profile/woman.jpg' },
        { id:'3', name: 'Camila Cabello3', role: 'UX Designer', status: '16 projects', image: '/images/profile/woman.jpg' },
        { id:'4', name: 'Journa list4', role: 'Journalist', status: '30 contents', image: '/images/profile/woman.jpg' },
        { id:'5', name: 'Daniela Beyo5', role: 'Developer', status: 'Open to door', image: '/images/profile/woman.jpg' },
        { id:'6', name: 'Selena Lo6', role: 'Marketing', status: 'CMO VueWallet', image: '/images/profile/woman.jpg' },
        { id:'7', name: 'Camila Cabello7', role: 'UX Designer', status: '16 projects', image: '/images/profile/woman.jpg' },
        { id:'8', name: 'Journalist8', role: 'Journalist', status: '30 contents', image: '/images/profile/woman.jpg' },
        { id:'9', name: 'Daniela Beyo9', role: 'Developer', status: 'Open to door', image: '/images/profile/woman.jpg' },
        { id:'10', name: 'Selena Lo10', role: 'Marketing', status: 'CMO VueWallet', image: '/images/profile/woman.jpg' },
    ];

    // Calcula amigos visibles
    const visibleFriends = friends.slice(currentIndex, currentIndex + friendsPerPage);

    // Verifica si hay más amigos
    const hasNext = currentIndex + friendsPerPage < friends.length;
    const hasPrev = currentIndex > 0;

    const handleNext = () => {
        if (hasNext) {
        setCurrentIndex(currentIndex + friendsPerPage);
        }
    };

    const handlePrev = () => {
        if (hasPrev) {
        setCurrentIndex(currentIndex - friendsPerPage);
        }
    };

    return (
        <div className="relative w-full bg-black rounded-xl p-4 md:p-6 shadow-gray-400 shadow-md">

            {/* Botón Atrás - solo visible cuando hay amigos atrás */}
            {hasPrev && (
            <button 
                onClick={handlePrev}
                className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-700 rounded-full p-1 md:p-2 transition-colors z-10">
                <IoIosArrowBack className="text-white size-5 md:size-6" />
            </button>
            )}
            
            {/* Grid responsive que se adapta al layout de la página */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
                {visibleFriends.map(friend => (
                    <div 
                        key={friend.id}
                        className="flex flex-col items-center">
                        
                        {/* Imagen principal */}
                        <img 
                            src={friend.image} 
                            alt={friend.name}
                            className="size-30 md:size-36 rounded-full mb-3 md:mb-4 object-cover"
                            loading="lazy"
                        />
                        

                        {/* Información */}
                        <div className="flex items-start w-full">
                            <img 
                                src={friend.image} 
                                alt={`avatar ${friend.name}`}
                                className="size-4 md:size-5 rounded-full object-cover flex-shrink-0"
                                loading="lazy"
                            />
                            <p className="text-xs sm:text-sm font-semibold pl-2 truncate">{friend.name}</p>
                        </div>
                        <p className="w-full text-[10px] px-7 items-start">{friend.role} + {friend.status}</p>
                        
                        {/* Botón ver perfil*/}
                        <button className="w-full px-7 flex hover:opacity-80 transition-opacity group/profile mx-auto">
                            <p className="text-[10px] text-[#ff29d7] pr-1">See Profile</p>
                            <IoIosArrowDroprightCircle className="fill-[#ff29d7] size-4 group-hover/profile:translate-x-0.5 transition-transform"/> 
                        </button>
                    </div>
                ))}
            </div>

            {/* Flecha Adelante - solo visible cuando hay más amigos */}
            {hasNext && (
            <button 
                onClick={handleNext}
                className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-700 rounded-full p-1 md:p-2 transition-colors z-10">
                <IoIosArrowForward className="text-white size-5 md:size-6" />
            </button>
            )}
        </div>
    );
};

export default FriendCard;