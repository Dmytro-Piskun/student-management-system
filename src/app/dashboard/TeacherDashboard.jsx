import SubjectsContainer from "./SubjectsContainer";
import StudentsContainer from "./StudentsContainer";
import prisma from "@/lib/prisma";

export default async function TeacherDashboard({ user }) {

  const { id: userId, role } = user;

  const teacher = await prisma.teacher.findUnique({
    where: {
      userId: userId,
    },
    include: {
      user: true,
      subjects: true,
      students: {
        include: {
          user: true,
          submissions: {
            include: {
              assignment: true,
            },
          },
        },
      },
    },
  });

  const subjects = teacher?.subjects || [];

  const students = teacher?.students.map((student) => {
    const grades = student.submissions
      .map((submission) => submission.grade) 
      .filter((grade) => grade !== null); 

    const averageGrade =
      grades.length > 0
        ? Math.round(grades.reduce((sum, grade) => sum + grade, 0) / grades.length)
        : null; 

    return {
      id: student.id,
      username: student.user.username, 
      grade: averageGrade, 
    };
  }) || [];

  console.log(students);

  return (
    <>
      <SubjectsContainer subjects={subjects} role={role} />
      <StudentsContainer students={students} />
    </>
  );
}
