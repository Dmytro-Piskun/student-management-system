import { Poppins } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/context/ToastContext";


const poppins = Poppins({
  weight: [
    '100', '200', '300', '400', '500', '600', '700', '800', '900'
  ], 
  subsets: ['latin'], 
});

export const metadata = {
  title: "Student Management System",
  description: "A system to track and analyze student progress across various academic activities",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={poppins.className + " bg-gray-50 min-h-screen"}
      >

        <ToastProvider>
        <div className="max-w-[120rem] mx-auto ">
            {children}
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
