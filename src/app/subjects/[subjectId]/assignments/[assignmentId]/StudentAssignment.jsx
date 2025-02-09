import AssignmentContainer from "./AssignmentContainer";
import prisma from "@/lib/prisma";


export default async function StudentAssignment({ userId ,role,assignmentId }) {

    const assignment = await prisma.assignment.findUnique({
        where: {
          id: assignmentId,
        },
        include: {
          subject: true, 
          submissions: {
            where: {
              student: {
                userId: userId, 
              },
            },
            include: {
              student: {
                include: {
                  user: true, 
                },
              },
            },
          },
        },
      });

    return (
        <>
            <AssignmentContainer assignment={assignment} role={role} />
        </>
    );
}