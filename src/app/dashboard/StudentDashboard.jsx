import prisma from "@/lib/prisma";
import SubjectsContainer from "./SubjectsContainer";
import AssignmentsContainer from "./AssignmentsContainer";

export default async function StudentDashboard({ user }) {

  const { id: userId } = user;

  const student = await prisma.student.findUnique({
    where: { userId },
    include: {
      teacher: {
        include: {
          subjects: {
            orderBy: {
              createdAt: 'asc', 
            },
          },
        },
      },
    },
  });
  
    
      const subjects = student?.teacher?.subjects.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) || [];
    
      const assignments = await prisma.assignment.findMany({
        where: {
          subjectId: {
            in: subjects.map((subject) => subject.id), 
          },
          NOT: {
            submissions: {
              some: {
                studentId: student.id, 
              },
            },
          },
        },
        include: {
          subject: true, 
        },
        orderBy: {
          dueDate: "asc", 
        }
      });

    return (
        <>
            <SubjectsContainer subjects={subjects} />
            <AssignmentsContainer assignments={assignments} />
        </>
    );
}
