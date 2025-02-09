import { getUser } from "@/server/authActions";
import { Suspense } from "react";
import { notFound } from 'next/navigation';
import Link from "next/link";
import prisma from "@/lib/prisma";
import StudentAssignment from "./StudentAssignment";
import TeacherAssignment from "./TeacherAssignment";

const AssignmentPage = async ({ params }) => {

    const user = await getUser();

    const { role, id, username } = user;

    const { subjectId, assignmentId } = params;


    const assignment = await prisma.assignment.findUnique({
        where: {
          id: assignmentId,
          subjectId: subjectId, 
        },
        include: {
          subject: true, 
        },
      });
    

    if (!assignment) {
        return notFound(); 
    }

    return (
   
            <Suspense fallback={<div className=" flex items-center justify-center h-1 min-h-screen">Loading...</div>}>
                <div className="p-6">

                    <Link
                        href={`/subjects/${assignment.subject.id}`}
                        className="inline-flex items-center text-lg font-semibold text-gray-800 hover:text-gray-900 mb-8     group transition-colors"
                    >
                        <span className="mr-1 inline-block relative w-3 h-3 group-hover:-translate-x-0.5 transition-transform">
                            <span className="absolute top-1/2 left-0 w-2 h-0.5 bg-current rotate-[-45deg] origin-left"></span>
                            <span className="absolute top-1/2 left-0 w-2 h-0.5 bg-current rotate-[45deg] origin-left"></span>
                        </span>
                        {assignment.subject.name}
                    </Link>

                    {role === 'STUDENT' && <StudentAssignment userId={id} role={role} assignmentId={assignmentId}/>}
                    {role === 'TEACHER' && <TeacherAssignment userId={id}  role={role} assignmentId={assignmentId} />}

                </div>
            </Suspense>
       
    );
};

export default AssignmentPage;