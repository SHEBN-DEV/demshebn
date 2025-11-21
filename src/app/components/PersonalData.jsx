import React, { useEffect } from "react";
import { useForm } from 'react-hook-form';
import { supabase } from "../SupabaseClient";
import InputField from "./inputField";

const PersonalData = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    // Cargar datos del usuario al montar el componente
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const {
                    data: { user },
                    error: authError,
                } = await supabase.auth.getUser();

                if (authError || !user) {
                    console.error("No se pudo obtener el usuario:", authError);
                    return;
                }

                // Obtener fullname desde profiles
                const { data: userProfile, error: userProfileError } = await supabase
                    .from("profiles")
                    .select("full_name")
                    .eq("id", user.id)
                    .single();

                if (userProfileError) {
                    console.error("Error al obtener fullname:", userProfileError);
                } else if (userProfile) {
                    setValue("FullName", userProfile.full_name);
                }

                // Obtener datos de edit_profile
                const { data, error } = await supabase
                    .from("edit_profile")
                    .select("*")
                    .eq("user_id", user.id)           
                    .maybeSingle();

                if (error) {
                    console.error("Error al obtener datos del perfil:", error);            
                } else if (data) {
                    // Cargar datos en el formulario
                    setValue("PhoneNum", data.phone);
                    setValue("Department", data.department);
                    setValue("country", data.country);
                    setValue("stateCountry", data.state_country);
                    setValue("city", data.city);
                    setValue("PostCode", data.postcode);
                } else {
                    console.log("No hay datos en edit_profile para este usuario");
                }
            } catch (error) {
                console.error("Error inesperado en fetchUserData:", error);
            }
        };

        fetchUserData();
    }, [setValue]);

    const handleDataSubmit = async (formData) => {
        try {
            const { FullName, PhoneNum, Department, country, stateCountry, city, PostCode } = formData;
            
            console.log("Datos del formulario:", formData);

            // Obtener usuario
            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser();

            if (authError || !user) {
                console.error("No se pudo obtener el usuario:", authError);
                alert("Error de autenticación");
                return;
            }

            console.log("Usuario ID:", user.id);

            // 1. Actualizar fullname en profiles
            const { error: updateFullNameError } = await supabase
                .from("profiles")
                .update({ full_name: FullName })
                .eq("id", user.id);

            if (updateFullNameError) {
                console.error("Error al actualizar full_name:", updateFullNameError);
                throw new Error(`Error al guardar el nombre: ${updateFullNameError.message}`);
            }

            console.log("Profiles actualizado correctamente");

            // 2. Preparar datos para edit_profile - CORREGIDO
            const editProfileData = {
                user_id: user.id,
                phone: PhoneNum ? Number(PhoneNum) : null, // Convertir a número
                department: Department,
                country: country,
                state_country: stateCountry,
                city: city,
                postcode: PostCode,
                updated_at: new Date().toISOString(),
            };

            console.log("Datos para edit_profile:", editProfileData);

            // 3. Usar UPSERT en lugar de UPDATE - CORREGIDO
            const { data, error: upsertError } = await supabase
                .from("edit_profile")
                .upsert(editProfileData) // Cambiado de update a upsert
                .select();

            if (upsertError) {
                console.error("Error completo al guardar datos:", {
                    message: upsertError.message,
                    details: upsertError.details,
                    hint: upsertError.hint,
                    code: upsertError.code
                });
                throw new Error(`Error al guardar los datos: ${upsertError.message}`);
            }

            console.log("Datos guardados correctamente:", data);
            alert("Datos actualizados con éxito");

        } catch (error) {
            console.error("Error en handleDataSubmit:", error);
            alert(error.message || "Hubo un error al guardar los cambios");
        }
    };

    return(
        <div className="flex justify-center items-center">
            <form onSubmit={handleSubmit(handleDataSubmit)} className="w-full md:w-5/6 py-12 flex flex-col gap-6 justify-center items-center">
                
                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <div className="w-full md:col-span-2">
                        <InputField 
                            type="text" 
                            label="FullName" 
                            name="FullName" 
                            register={register} 
                            rules={{ required: "First name is required"}} 
                            error={errors.FullName} 
                        />
                    </div>
                    
                    <InputField 
                        type="number" 
                        label="Phone Number" 
                        name="PhoneNum" 
                        register={register} 
                        rules={{ 
                            required: "Phone Number is required",
                            valueAsNumber: true // Importante para campos numéricos
                        }} 
                        error={errors.PhoneNum}
                    />
                    
                    <InputField 
                        type="text" 
                        label="Department" 
                        name="Department" 
                        register={register} 
                        rules={{ required: "Department is required"}} 
                        error={errors.Department}
                    />

                    <InputField 
                        type="text" 
                        label="Country" 
                        name="country" 
                        register={register} 
                        rules={{ required: "Country is required"}} 
                        error={errors.country}
                    />
                   
                    <InputField 
                        type="text" 
                        label="State/Province" 
                        name="stateCountry" 
                        register={register} 
                        rules={{ required: "State/Province is required"}} 
                        error={errors.stateCountry}
                    />
                    
                    <InputField 
                        type="text" 
                        label="City" 
                        name="city" 
                        register={register} 
                        rules={{ required: "City is required"}} 
                        error={errors.city}
                    />
                    
                    <InputField 
                        type="text" 
                        label="PostCode" 
                        name="PostCode" 
                        register={register} 
                        rules={{ required: "PostCode is required"}} 
                        error={errors.PostCode}
                    />
                </div>
                
                <div className="w-full">
                    <button 
                        type="submit"
                        className="px-4 py-2 bg-black border border-white rounded-3xl text-sm font-medium text-white hover:bg-[#ff29d7] hover:border-[#ff29d7] transition-colors"
                    >
                        UPDATE
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PersonalData;