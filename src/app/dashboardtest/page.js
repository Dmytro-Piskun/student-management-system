import { logout, getUser } from "@/server/authActions";
import Student from "./Student";
import Teacher from "./Teacher";

export default async function TestPage() {

    const { role, id } = await getUser();

    return (
        <div>

            {role === 'STUDENT' && <Student userId={id} />}
            {role === 'TEACHER' && <Teacher userId={id} />}


            <form action={logout} className="flex flex-col gap-5 pb-6">
                <button type="submit" className="p-2 bg-gradient-to-r from-blue-300 to-sky-300  text-gray-600 rounded-md">Logout</button>
            </form>
        </div>
    );
}
