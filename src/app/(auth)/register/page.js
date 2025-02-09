import Card from "@/components/ui/Card";
import Link from "next/link";
import RegisterForm from "./RegisterForm";

const RegisterPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="p-8">
                <h1 className="pb-6 text-center text-gray-700 font-semibold">Register</h1>
                <RegisterForm />
                <Link className=" italic font-normal text-gray-500" href="/login">Login to Existing Account</Link>
            </Card>
        </div>
    );
};

export default RegisterPage;