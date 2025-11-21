import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { supabase } from "../SupabaseClient";
import PrivacySection from "./PrivacySection";

const EditPrivacy = () => {
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: {errors},
    } = useForm();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [currentUserData, setCurrentUserData] = useState({
        user_name: '',
        email: ''
    });

    // Estados de visibilidad - MOVER ARRIBA del useEffect
    const [showChangeUsername, setShowChangeUsername] = useState(false);
    const [showChangeEmail, setShowChangeEmail] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);

    // Cargar datos del usuario al montar el componente
    useEffect(() => {
        const fetchUserData = async () => {
            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser();

            if (authError || !user) {
                console.error("No se pudo obtener el usuario:", authError);
                return;
            }

            // Obtener username y email desde profiles
            const { data: userProfile, error: userProfileError } = await supabase
                .from("profiles")
                .select("user_name, email")
                .eq("id", user.id)
                .single();

            if (userProfileError) {
                console.error("Error al obtener datos del perfil:", userProfileError);
            } else if (userProfile) {
                setCurrentUserData({
                    user_name: userProfile.user_name || '',
                    email: userProfile.email || ''
                });
                
                // Cargar datos en el formulario
                setValue("CurrentUser", userProfile.user_name || "");
                setValue("CurrentEmail", userProfile.email || "");
            }
        };

        fetchUserData();
    }, [setValue]);

    const handlePrivacySubmit = async (data) => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            
            if (authError || !user) {
                setMessage({ type: 'error', text: 'User not authenticated' });
                return;
            }

            let changesMade = false;

            // Actualizar username si se proporcionó uno nuevo
            if (data.NewUser && data.NewUser !== data.CurrentUser) {
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ user_name: data.NewUser })
                    .eq('id', user.id);

                if (updateError) {
                    setMessage({ type: 'error', text: `Error updating username: ${updateError.message}` });
                    return;
                }
                changesMade = true;
                setCurrentUserData(prev => ({ ...prev, user_name: data.NewUser }));
                setValue("CurrentUser", data.NewUser);
                // Cerrar el formulario de username después de guardar
                setShowChangeUsername(false);
            }

            // Actualizar email si se proporcionó uno nuevo
            if (data.NewEmail && data.NewEmail !== data.CurrentEmail) {
                // 1. Actualizar en auth.users (Supabase Authentication)
                const { error: emailError } = await supabase.auth.updateUser({
                    email: data.NewEmail
                });

                if (emailError) {
                    setMessage({ type: 'error', text: `Error updating email: ${emailError.message}` });
                    return;
                }

                // 2. Actualizar en la tabla profiles
                const { error: updateProfileError } = await supabase
                    .from('profiles')
                    .update({ email: data.NewEmail })
                    .eq('id', user.id);

                if (updateProfileError) {
                    setMessage({ type: 'error', text: `Error updating email in profile: ${updateProfileError.message}` });
                    return;
                }

                changesMade = true;
                setCurrentUserData(prev => ({ ...prev, email: data.NewEmail }));
                setValue("CurrentEmail", data.NewEmail);
                setMessage({ type: 'success', text: 'A confirmation link has been sent to your new email' });
                // Cerrar el formulario de email después de guardar
                setShowChangeEmail(false);
            }

            if (!changesMade) {
                setMessage({ type: "info", text: "No changes have been provided" });
            } else if (!data.NewEmail) {
                setMessage({ type: "success", text: "Data updated successfully" });
            }

        } catch (error) {
            setMessage({ type: "error", text: `Error: ${error.message}` });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (data) => {
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            // Validar que las contraseñas coincidan
            if (data.NewPassword !== data.ConfirmPassword) {
                setMessage({ type: "error", text: "Passwords do not match" });
                return;
            }
    
            const { error } = await supabase.auth.updateUser({
                password: data.NewPassword,
            });
    
            if (error) {
                setMessage({ type: "error", text: `Error updating password: ${error.message}` });
                return;
            } else {
                setMessage({ type: "success", text: "Password updated successfully" });
    
                // Limpiar campos de contraseña
                setValue("NewPassword", "");
                setValue("ConfirmPassword", "");
                setShowChangePassword(false);
            }
        } catch (error) {
            setMessage({ type: "error", text: `Error: ${error.message}` });
        } finally {
            setLoading(false);
        }
    };

    const toggleChangeUsername = () => {
        setShowChangeUsername(!showChangeUsername);
        setMessage({ type: "", text: "" });
    };

    const toggleChangeEmail = () => {
        setShowChangeEmail(!showChangeEmail);
        setMessage({ type: "", text: "" });
    };

    const toggleChangePassword = () => {
        setShowChangePassword(!showChangePassword);
        setMessage({ type: "", text: "" });
    };

    return(
        <div className="w-full flex justify-center items-center ">
            <form onSubmit={handleSubmit(handlePrivacySubmit)} className="w-full flex flex-col gap-6 justify-center items-center">
                <div className="w-5/6 grid grid-cols-1 gap-8 my-8">

                    {/* Mensajes de estado */}
                    {message.text && (
                        <div className={`w-full p-3 rounded-lg ${
                            message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-300' :
                            message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-300' :
                            'bg-blue-100 text-blue-700 border border-blue-300'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    <PrivacySection
                        title="User Name"
                        value={currentUserData.user_name || "Not set"}
                        showForm={showChangeUsername}
                        toggleForm={toggleChangeUsername}
                        fields={[
                            { 
                                label: "Current User Name", 
                                name: "CurrentUser", 
                                type: "text",
                                rules: { required: "Current User name is required" } 
                            },
                            { 
                                label: "New User Name", 
                                name: "NewUser", 
                                type: "text",
                                rules: { required: "New User name is required" } 
                            },
                        ]}
                        errors={errors}
                        register={register}
                        onSubmit={handleSubmit(handlePrivacySubmit)}
                    />

                    <PrivacySection
                        title="Email"
                        value={currentUserData.email || "Not set"}
                        showForm={showChangeEmail}
                        toggleForm={toggleChangeEmail}
                        fields={[
                            { 
                                label: "Current Email", 
                                name: "CurrentEmail", 
                                type: "email",
                                rules: { 
                                    required: "Current Email is required",
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: "Invalid email"
                                    }
                                } 
                            },
                            { 
                                label: "New Email", 
                                name: "NewEmail", 
                                type: "email",
                                rules: { 
                                    required: "New Email is required",
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: "Invalid email"
                                    }
                                } 
                            },
                        ]}
                        errors={errors}
                        register={register}
                        onSubmit={handleSubmit(handlePrivacySubmit)}
                    />

                    <PrivacySection
                        title="Password"
                        value="********"
                        showForm={showChangePassword}
                        toggleForm={toggleChangePassword}
                        fields={[
                            { 
                                label: "New Password", 
                                name: "NewPassword", 
                                type: "password", 
                                rules: { 
                                    required: "New Password is required", 
                                    minLength: { 
                                        value: 6, 
                                        message: "Minimum 6 characters" 
                                    }
                                }
                            },
                            { 
                                label: "Confirm Password", 
                                name: "ConfirmPassword", 
                                type: "password",
                                rules: { 
                                    required: "Please confirm your password", 
                                    validate: value => value === getValues("NewPassword") || "Passwords do not match"
                                }
                            },
                        ]}
                        errors={errors}
                        register={register}
                        onSubmit={handleSubmit(handlePasswordSubmit)}
                    />
                </div>
            </form>
        </div>
    );
};

export default EditPrivacy;