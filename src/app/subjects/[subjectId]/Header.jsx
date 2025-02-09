"use client";

import { deleteSubject } from "@/server/teacherActions";
import { useTransition } from "react";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

export default function Header({ role,subject }) {
    const [isPending, startTransition] = useTransition();
    const { showToast } = useToast();
    const router = useRouter();


    const handleDeleteSubject = () => {
        startTransition(async () => {
            const result = await deleteSubject(subject.id);

            if (result?.error) {
                showToast(result.error, 'error');
            } else {
                showToast('Subject deleted successfully', 'success'); // Corrected message
                router.push("/dashboard");
            }
        });
    };

    return (
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-800 ">{subject.name}</h1>
            {role === "TEACHER" && <button
                onClick={() => handleDeleteSubject()}
                disabled={isPending}
                className="ml-2 text-red-600 hover:text-red-900 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>}
        </header>
    );
}