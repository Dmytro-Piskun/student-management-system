"use client";

import { register } from "@/server/authActions";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const RegisterForm = () => {
    const { showToast } = useToast();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    return (
        <form 
            action={async (formData) => {
                startTransition(async () => {
                    const result = await register(formData);

                    if (result?.error) {
                        showToast(result.error, 'error');
                    } else {
                        showToast('Registration successful', 'success');
                        router.push("/dashboard"); 
                    }
                });
            }} 
            className="flex flex-col gap-5 pb-6"
        >
            <input 
                type="text" 
                name="username" 
                required 
                disabled={isPending}
                placeholder="username" 
                className="p-2 outline-gray-200 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed" 
            />
            <input 
                type="password" 
                name="password" 
                required 
                disabled={isPending}
                placeholder="password" 
                className="p-2 outline-gray-200 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed" 
            />
            <button 
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center p-2 bg-gradient-to-r from-blue-300 to-sky-300 text-white 
                           rounded-md font-semibold transition-all duration-200 
                           hover:from-blue-400 hover:to-sky-400 hover:shadow-md hover:scale-[1.02] 
                           active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 
                           disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? "Registering..." : "Register"}
            </button>
        </form>
    );
};

export default RegisterForm;
