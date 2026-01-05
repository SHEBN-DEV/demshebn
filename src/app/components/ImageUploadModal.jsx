// components/ImageUploadModal.jsx
"use client"

import { useState, useEffect } from "react";
import { supabase } from "../SupabaseClient";

const ImageUploadModal = ({ isOpen, onClose, onUploadSuccess, userId }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadMessage, setUploadMessage] = useState({ text: "", type: "" });
    const [dragOver, setDragOver] = useState(false);

    // Configuración
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const BUCKET_NAME = 'avatars';

    // Cerrar con Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') handleClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    // Reset al cerrar
    useEffect(() => {
        if (!isOpen) resetModal();
    }, [isOpen]);

    const validateFile = (file) => {
        if (!file) return { valid: false, message: 'No se seleccionó ningún archivo' };

        if (!ALLOWED_TYPES.includes(file.type)) {
            return {
                valid: false,
                message: 'Solo se permiten imágenes JPG, PNG, GIF o WebP'
            };
        }

        if (file.size > MAX_FILE_SIZE) {
            return {
                valid: false,
                message: `La imagen es demasiado grande (máximo 5MB)`
            };
        }

        return { valid: true, message: '' };
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        processFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        processFile(file);
    };

    const processFile = (file) => {
        const validation = validateFile(file);
        if (!validation.valid) {
            setUploadMessage({ text: validation.message, type: "error" });
            return;
        }

        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setUploadMessage({ text: "", type: "" });
    };

    const handleUpload = async () => {
        if (!selectedFile || !userId) return;

        setUploading(true);
        setUploadProgress(0);

        try {
            // 1. Generar nombre único para el archivo
            const fileExt = selectedFile.name.split('.').pop();
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 15);
            const fileName = `${userId}/${timestamp}-${randomString}.${fileExt}`;

            // 2. Subir a Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(fileName, selectedFile, {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: selectedFile.type,
                });

            if (uploadError) throw uploadError;

            setUploadProgress(50);

            // 3. Obtener URL pública
            const { data: { publicUrl } } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(fileName);

            setUploadProgress(75);

            // 4. Actualizar edit_profile con avatar_url
            const { error: updateError } = await supabase
                .from('edit_profile')
                .upsert({
                    user_id: userId,
                    avatar_url: publicUrl,
                    updated_at: new Date().toISOString(),
                }, {
                    onConflict: 'user_id'
                });

            if (updateError) throw updateError;

            setUploadProgress(100);

            // 5. Mostrar mensaje de éxito
            setUploadMessage({ 
                text: "¡Foto de perfil actualizada exitosamente!", 
                type: "success" 
            });

            // 6. Llamar callback si existe
            if (onUploadSuccess) {
                await onUploadSuccess(publicUrl);
            }

            // 7. Cerrar modal después de 1.5 segundos
            setTimeout(() => {
                handleClose();
            }, 1500);

        } catch (error) {
            console.error("Error en la subida:", error);
            
            // Mensajes de error más amigables
            let errorMessage = "Error al subir la imagen";
            if (error.message.includes("storage/object-not-found")) {
                errorMessage = "Error: El bucket no está configurado correctamente";
            } else if (error.message.includes("storage/unauthorized")) {
                errorMessage = "No tienes permisos para subir imágenes";
            } else if (error.message.includes("storage/object-too-large")) {
                errorMessage = "La imagen es demasiado grande";
            } else {
                errorMessage = `Error: ${error.message}`;
            }

            setUploadMessage({ 
                text: errorMessage, 
                type: "error" 
            });
            setUploadProgress(0);
        } finally {
            setUploading(false);
        }
    };

    const removePreview = () => {
        setSelectedFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl("");
        }
        setUploadMessage({ text: "", type: "" });
    };

    const resetModal = () => {
        setSelectedFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl("");
        setUploadProgress(0);
        setUploadMessage({ text: "", type: "" });
        setUploading(false);
        setDragOver(false);
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Fondo oscuro */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
                onClick={handleClose}
            >
                {/* Contenedor del modal */}
                <div 
                    className="bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-xl shadow-black/50 max-w-md w-full p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Encabezado */}
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">
                            Actualizar Foto de Perfil
                        </h3>
                        <button 
                            onClick={handleClose}
                            className="text-gray-400 hover:text-white transition-colors"
                            disabled={uploading}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Contenido */}
                    <div className="mb-6">
                        {/* Área de subida */}
                        <div
                            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
                                ${dragOver ? 'border-[#ff29d7] bg-[#ff29d7]/10' : 'border-gray-600 hover:border-[#ff29d7]'}
                                ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                                bg-black/30`}
                            onClick={() => !uploading && document.getElementById('fileInput').click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileSelect}
                                disabled={uploading}
                            />
                            
                            {previewUrl ? (
                                <div className="relative inline-block">
                                    <img
                                        src={previewUrl}
                                        alt="Vista previa"
                                        className="w-40 h-40 rounded-lg object-cover border-2 border-gray-700 mx-auto"
                                    />
                                    {!uploading && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removePreview();
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-gray-300 mb-2">
                                        {uploading ? 'Subiendo...' : 'Arrastra una imagen o haz clic aquí'}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        Formatos: JPG, PNG, GIF, WebP • Máx. 5MB
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Barra de progreso */}
                        {uploading && (
                            <div className="mt-4">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-[#ff29d7]">
                                        Subiendo...
                                    </span>
                                    <span className="text-sm font-medium text-[#ff29d7]">
                                        {uploadProgress}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-2">
                                    <div
                                        className="bg-[#ff29d7] h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Mensajes */}
                        {uploadMessage.text && (
                            <div className={`mt-4 p-3 rounded-lg ${
                                uploadMessage.type === 'error' 
                                    ? 'bg-red-900/30 text-red-300 border border-red-800'
                                    : 'bg-green-900/30 text-green-300 border border-green-800'
                            }`}>
                                {uploadMessage.text}
                            </div>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors font-medium"
                            disabled={uploading}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={!selectedFile || uploading}
                            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                !selectedFile || uploading
                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#ff29d7] hover:bg-[#ff5ce1] text-white'
                            }`}
                        >
                            {uploading ? 'Subiendo...' : 'Subir Imagen'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ImageUploadModal;