import Card from "@/components/ui/Card";
import Link from "next/link";
import LoginForm from "./LoginForm";

const LoginPage = () => {

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="p-8">
                <h1 className="pb-6 text-center text-gray-700 font-semibold">Login</h1>
                <LoginForm />
                <Link className=" italic font-normal text-gray-500" href="/register">Register a Teacher Account</Link>
            </Card>
        </div>
    );
};

export default LoginPage;