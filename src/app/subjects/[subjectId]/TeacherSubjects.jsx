import prisma from "@/lib/prisma";
import TeacherAssignmentsContainer from "./TeacherAssignmentsContainer";
import StudentsContainer from "./StudentsContainer";


export default async function TeacherSubjects({ userId, subjectId }) {

  const teacher = await prisma.teacher.findUnique({
    where: { userId },
    include: {
      students: {
        include: {
          user: true, 
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
      },
    },
  });

  const assignments = await prisma.assignment.findMany({
    where: {
      subjectId: subjectId, 
    },
    include: {
      submissions: true, 
    },
    orderBy: {
      dueDate: "desc", 
    }
  });

  const students = teacher.students.map((student) => {
    const submissions = student.submissions;
    const grades = submissions
      .map((submission) => submission.grade) 
      .filter((grade) => grade !== null); 

    const averageGrade = Math.round(grades.length > 0
      ? grades.reduce((sum, grade) => sum + grade, 0) / grades.length
      : null); 

    return {
      id: student.id, 
      username: student.user.username, 
      submissionsCount: submissions.length, 
      averageGrade: averageGrade, 
    };
  });

  return (
    <>
      <TeacherAssignmentsContainer assignments={assignments} subjectId={subjectId} />
      <StudentsContainer students={students} />
    </>
  );
}
