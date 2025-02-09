"use client";

import { logout } from "@/server/authActions";
import Card from "@/components/ui/Card";
import { useTransition } from "react";
import { useToast } from "@/context/ToastContext";

export default function Header({ user }) {
  const { role, username } = user;
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const handleLogout = async () => {
    startTransition(async () => {
      const result = await logout();

      if (result?.error) {
        showToast(result.error, 'error');
      } else {
        showToast('Logged out successfully', 'success'); 
      }
    });
  };

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between p-4">
        <div>
          <h2 className="text-xl">{username}</h2>
          <p className="text-sm text-gray-600">
            Role: {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
          </p>
        </div>
        <button
          disabled={isPending}
          onClick={handleLogout} 
          className="w-40 flex justify-center p-2 bg-red-500 text-white rounded-md font-semibold transition-all duration-200 hover:bg-red-600 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Logging out..." : "Logout"}
        </button>
      </div>
    </Card>
  );
}