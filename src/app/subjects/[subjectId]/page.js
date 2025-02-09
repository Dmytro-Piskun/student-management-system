import { getUser } from "@/server/authActions";
import { Suspense } from "react";
import StudentSubjects from "./StudentSubjects";
import TeacherSubjects from "./TeacherSubjects";
import { notFound } from 'next/navigation';
import Link from "next/link";
import prisma from "@/lib/prisma";
import Header from "./Header";

const SubjectPage = async ({ params }) => {

    const user = await getUser();

    const { role, id, username } = user;

    const { subjectId } = params;

    const subject = await prisma.subject.findUnique({
        where: {
            id: subjectId,
        },
    });


    if (!subject) {
        return notFound();
    }

    return (
        <Suspense fallback={<div className=" flex items-center justify-center h-1 min-h-screen">Loading...</div>}>
            <div className="p-6">

                <Link
                    href="/dashboard"
                    className="inline-flex items-center text-lg font-semibold text-gray-800 hover:text-gray-900 mb-8     group transition-colors"
                >
                    <span className="mr-1 inline-block relative w-3 h-3 group-hover:-translate-x-0.5 transition-transform">
                        <span className="absolute top-1/2 left-0 w-2 h-0.5 bg-current rotate-[-45deg] origin-left"></span>
                        <span className="absolute top-1/2 left-0 w-2 h-0.5 bg-current rotate-[45deg] origin-left"></span>
                    </span>
                    Dashboard
                </Link>



                <Header role={role} subject={subject} />


                {role === 'STUDENT' && <StudentSubjects userId={id} subjectId={subjectId} />}
                {role === 'TEACHER' && <TeacherSubjects userId={id} subjectId={subjectId} />}

            </div>
        </Suspense>
    );

};

export default SubjectPage;