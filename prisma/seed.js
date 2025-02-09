const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.user.deleteMany();

  // Password hashing
  const passwordHash = async (password) => await bcrypt.hash(password, 10);

  // Teachers data
  const teachersData = [
    {
      username: `mr_johnson_${Date.now()}_1`,
      password: await passwordHash('teacher123'),
      subjects: ['Mathematics', 'Algebra', 'Geometry']
    },
    {
      username: `ms_smith_${Date.now()}_2`,
      password: await passwordHash('science123'),
      subjects: ['Biology', 'Chemistry', 'Environmental Science']
    },
    {
      username: `mr_williams_${Date.now()}_3`,
      password: await passwordHash('english123'),
      subjects: ['English Literature', 'Creative Writing', 'Grammar']
    },
    {
      username: `mrs_rodriguez_${Date.now()}_4`,
      password: await passwordHash('history123'),
      subjects: ['World History', 'Ancient Civilizations', 'Modern History']
    }
  ];

  // Create Teachers and their Subjects
  const teachersWithProfiles = [];
  for (const teacherData of teachersData) {
    const teacherUser = await prisma.user.create({
      data: {
        username: teacherData.username,
        password: teacherData.password,
        role: 'TEACHER'
      }
    });

    const teacher = await prisma.teacher.create({
      data: {
        userId: teacherUser.id
      }
    });

    // Create Subjects for this teacher
    const subjects = await Promise.all(
      teacherData.subjects.map(subjectName => 
        prisma.subject.create({
          data: {
            name: subjectName,
            teacherId: teacher.id
          }
        })
      )
    );

    teachersWithProfiles.push({ 
      user: teacherUser, 
      teacher: teacher, 
      subjects: subjects 
    });
  }

  // Students data
  const studentsData = [
    { 
      username: `alice_smith_${Date.now()}_1`, 
      password: await passwordHash('student123'),
      teacherIndex: 0 
    },
    { 
      username: `bob_jones_${Date.now()}_2`, 
      password: await passwordHash('student456'),
      teacherIndex: 0 
    },
    { 
      username: `charlie_brown_${Date.now()}_3`, 
      password: await passwordHash('student789'),
      teacherIndex: 1 
    },
    { 
      username: `diana_miller_${Date.now()}_4`, 
      password: await passwordHash('student101'),
      teacherIndex: 1 
    },
    { 
      username: `evan_thomas_${Date.now()}_5`, 
      password: await passwordHash('student112'),
      teacherIndex: 2 
    },
    { 
      username: `fiona_garcia_${Date.now()}_6`, 
      password: await passwordHash('student131'),
      teacherIndex: 2 
    },
    { 
      username: `george_martinez_${Date.now()}_7`, 
      password: await passwordHash('student141'),
      teacherIndex: 3 
    },
    { 
      username: `hannah_lee_${Date.now()}_8`, 
      password: await passwordHash('student151'),
      teacherIndex: 3 
    }
  ];

  // Create Students
  const studentsWithProfiles = [];
  for (const studentData of studentsData) {
    const studentUser = await prisma.user.create({
      data: {
        username: studentData.username,
        password: studentData.password,
        role: 'STUDENT'
      }
    });

    const student = await prisma.student.create({
      data: {
        userId: studentUser.id,
        teacherId: teachersWithProfiles[studentData.teacherIndex].teacher.id
      }
    });

    studentsWithProfiles.push({ 
      user: studentUser, 
      student: student,
      teacherIndex: studentData.teacherIndex 
    });
  }

  // Create Assignments for each subject
  const assignmentsData = [];
  for (const teacherProfile of teachersWithProfiles) {
    for (const subject of teacherProfile.subjects) {
      assignmentsData.push(
        ...["Homework", "Quiz", "Project"].map(type => ({
          title: `${subject.name} ${type}`,
          instructions: `Complete the ${type.toLowerCase()} for ${subject.name}`,
          dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000), // Random due date within next 30 days
          subjectId: subject.id
        }))
      );
    }
  }

  // Create Assignments
  const createdAssignments = await Promise.all(
    assignmentsData.map(assignment => 
      prisma.assignment.create({ data: assignment })
    )
  );

  // Group assignments by teacher
  const assignmentsByTeacher = teachersWithProfiles.map(teacherProfile => ({
    teacherId: teacherProfile.teacher.id,
    assignments: createdAssignments.filter(assignment => 
      teacherProfile.subjects.some(subject => subject.id === assignment.subjectId)
    )
  }));

  // Create Submissions
  const submissions = [];
  for (const student of studentsWithProfiles) {
    // Get assignments for the student's teacher
    const teacherAssignments = assignmentsByTeacher
      .find(t => t.teacherId === student.student.teacherId)
      .assignments;

    // Each student submits to 2-3 random assignments from their teacher's subjects
    const studentAssignments = teacherAssignments
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 2) + 2);

    for (const assignment of studentAssignments) {
      submissions.push({
        content: `Submission for ${assignment.title} by ${student.user.username}`,
        studentId: student.student.id,
        assignmentId: assignment.id,
        grade: Math.floor(Math.random() * 100) + 1 // Random grade between 0-10
      });
    }
  }

  // Create Submissions
  await prisma.submission.createMany({
    data: submissions
  });

  console.log('Seeding completed successfully');
  console.log(`Created:
  - Teachers: ${teachersWithProfiles.length}
  - Students: ${studentsWithProfiles.length}
  - Subjects: ${teachersWithProfiles.reduce((sum, t) => sum + t.subjects.length, 0)}
  - Assignments: ${createdAssignments.length}
  - Submissions: ${submissions.length}`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });