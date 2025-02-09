import AssignmentContainer from "./AssignmentContainer";
import SubmissionsContainer from "./SubmissionsContainer";
import prisma from "@/lib/prisma";

export default async function TeacherAssignment({ userId, role, assignmentId }) {

  const assignment = await prisma.assignment.findUnique({
    where: {
      id: assignmentId,
    },
    include: {
      subject: true, 
      submissions: {
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

  const submissions = assignment.submissions.map((submission) => ({
    ...submission,
    assignment: {
      dueDate: assignment.dueDate, 
    },
  }));

  return (
    <>
      <AssignmentContainer assignment={assignment} role={role} />
      <SubmissionsContainer submissions={submissions} />
    </>
  );
}
