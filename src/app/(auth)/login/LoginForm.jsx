"use client";

import { useToast } from "@/context/ToastContext";
import { login } from "@/server/authActions";
import { useRouter } from "next/navigation";
import { useTransition } from "react"

const LoginForm = () => {

    const [isPending, startTransition] = useTransition();

    const router = useRouter();

    const { showToast } = useToast()

    return (
        <form action={async (formData) => {

            startTransition(async () => {
                const result = await login(formData);

                if (result?.error) {

                    showToast(result.error, 'error')

                }
                else {
                    showToast('Loged in succesesfully', 'success')
                    router.push("/dashboard");
                }
            })



        }} className="flex flex-col gap-5 pb-6">
            <input type="text" disabled={isPending} name="username" required placeholder="username" className="p-2 outline-gray-200 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed" />
            <input type="password" disabled={isPending} name="password" required placeholder="password" className="p-2 outline-gray-200 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed" />
            <button disabled={isPending} type="submit" className="w-full flex justify-center p-2 bg-gradient-to-r from-blue-300 to-sky-300 text-white rounded-md font-semibold transition-all duration-200 hover:from-blue-400 hover:to-sky-400 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {isPending ? "Loging in...":"Log in"}
            </button>
        </form>

    );
};

export default LoginForm;