import StudentAssignmentsContainer from "./StudentAssignmentsContainer";
import GradesContainer from "./GradesContainer";
import OverallGrade from "./OverallGrade";
import prisma from "@/lib/prisma";


export default async function StudentSubjects({ userId, subjectId }) {

  const student = await prisma.student.findUnique({
    where: { userId },
    include: {
      submissions: {
        where: {
          assignment: {
            subjectId: subjectId,
          },
        },
        include: {
          assignment: true, 
        },
      },
    },
  });

  const assignmentsData = await prisma.assignment.findMany({
    where: {
      subjectId: subjectId,
    },
    include: {
      submissions: {
        where: {
          studentId: student.id, 
        },
      },
    },
    orderBy: {
      dueDate: "asc", 
    }
  });

  const assignments = assignmentsData.map((assignment) => {
    const submission = assignment.submissions[0];
    return {
      id: assignment.id,
      subjectId: assignment.subjectId,
      title: assignment.title,
      dueDate: assignment.dueDate,
      submission,
      isSubmitted: !!submission, 
    };
  });



  const gradedSubmissions = student.submissions.filter(
    (submission) => submission.grade !== null
  );
  const overallGrade = Math.round(gradedSubmissions.length > 0
    ? gradedSubmissions.reduce((sum, submission) => sum + submission.grade, 0) /
    gradedSubmissions.length
    : null);


  return (
    <>
      <div className="flex gap-6 mb-6">
        <GradesContainer grades={gradedSubmissions} />
        <OverallGrade grade={overallGrade} />
      </div>
      <StudentAssignmentsContainer assignments={assignments} />
    </>
  );
}