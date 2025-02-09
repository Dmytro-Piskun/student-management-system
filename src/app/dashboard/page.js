import { getUser } from "@/server/authActions";
import { Suspense } from "react";
import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";
import Header from "./Header";

const DashboardPage = async () => {

    const user = await getUser();

    const { role, id, username } = user;

    return (
        <Suspense fallback={<div className=" flex items-center justify-center h-1 min-h-screen">Loading...</div>}>
            <div className="p-6 ">
                <Header user={user} />
                {role === 'STUDENT' && <StudentDashboard user={user} />}
                {role === 'TEACHER' && <TeacherDashboard user={user} />}

            </div>
        </Suspense>
    );
};

export default DashboardPage;