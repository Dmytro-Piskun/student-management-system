"use server";

import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getUser } from "./authActions";

export async function createStudentAccount(formData) {
    const session = await getUser();

    if (!session || session.role !== 'TEACHER') {
        return { error: 'Unauthorized' };
    }

    const username = formData.get("username");
    const password = formData.get("password");

    try {
        if (!username || !password) {
            throw new Error("Username and password are required");
        }

        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            throw new Error("Username already exists");
        }

        const teacher = await prisma.teacher.findFirst({
            where: { userId: session.id }
        });

        if (!teacher) {
            throw new Error("Teacher profile not found");
        }

        const hashedPassword = await hash(password, 10);

        const newStudent = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    username,
                    password: hashedPassword,
                    role: 'STUDENT'
                }
            });

            const student = await tx.student.create({
                data: {
                    userId: user.id,
                    teacherId: teacher.id
                }
            });

            return { user, student };
        });

        revalidatePath('/dashboard');

    } catch (error) {

        console.log("Error", error.message);

        return { error: error.message };
    }
}

export async function createSubject(formData) {
    const session = await getUser();

    if (!session || session.role !== 'TEACHER') {
        return { error: 'Unauthorized' };
    }

    const name = formData.get("name");

    try {
        if (!name) {
            throw new Error("Subject name is required");
        }

        const teacher = await prisma.teacher.findFirst({
            where: { userId: session.id }
        });

        if (!teacher) {
            throw new Error("Teacher profile not found");
        }

        const existingSubject = await prisma.subject.findFirst({
            where: {
                name,
                teacherId: teacher.id
            }
        });

        if (existingSubject) {
            throw new Error("Subject already exists");
        }

        const subject = await prisma.subject.create({
            data: {
                name,
                teacherId: teacher.id
            }
        });

        revalidatePath('/dashboard');

    } catch (error) {

        console.log("Error", error.message);

        return { error: error.message };
    }
}

export async function deleteSubject(subjectId) {
    const session = await getUser();

    if (!session || session.role !== 'TEACHER') {
        return { error: 'Unauthorized' };
    }

    try {
        if (!subjectId) {
            throw new Error("Subject ID is required");
        }

        const teacher = await prisma.teacher.findFirst({
            where: { userId: session.id }
        });

        if (!teacher) {
            throw new Error("Teacher profile not found");
        }

        const subject = await prisma.subject.findUnique({
            where: {
                id: subjectId,
                teacherId: teacher.id
            }
        });

        if (!subject) {
            throw new Error("Subject not found or unauthorized");
        }

        await prisma.subject.delete({
            where: { id: subjectId }
        });

        revalidatePath('/dashboard');
    } catch (error) {
        console.log("Error", error.message);

        return { error: error.message };
    }

}

export async function deleteStudentAccount(studentId) {
    const session = await getUser();

    if (!session || session.role !== 'TEACHER') {
        return { error: 'Unauthorized' };
    }

    try {
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: { user: true }, 
        });

        if (!student) {
            throw new Error('Student not found.');
        }

        await prisma.student.delete({
            where: { id: studentId },
            include: {
                submissions: true, 
            },
        });

        await prisma.user.delete({
            where: { id: student.userId },
        });


        revalidatePath('/dashboard');

    } catch (error) {
        console.log("Error", error.message);

        return { error: error.message };
    }
}

export async function createAssignment(formData, subjectId) {
    const session = await getUser();
  
    if (!session || session.role !== "TEACHER") {
      return { error: "Unauthorized" };
    }
  
    const title = formData.get("title");
    const instructions = formData.get("instructions");
    const dueDate = formData.get("dueDate");
  
    try {
      if (!title || !instructions || !dueDate || !subjectId) {
        throw new Error("All fields are required");
      }
  
      const teacher = await prisma.teacher.findUnique({
        where: { userId: session.id },
      });
  
      if (!teacher) {
        throw new Error("Teacher profile not found");
      }
  
      const subject = await prisma.subject.findUnique({
        where: {
          id: subjectId,
          teacherId: teacher.id,
        },
      });
  
      if (!subject) {
        throw new Error("Subject not found or unauthorized");
      }
  
      const existingAssignment = await prisma.assignment.findFirst({
        where: {
          subjectId,
          title,
        },
      });
  
      if (existingAssignment) {
        throw new Error("An assignment with this title already exists for the subject");
      }
  
      const assignment = await prisma.assignment.create({
        data: {
          title,
          instructions,
          dueDate: new Date(dueDate),
          subjectId,
        },
      });
  
      revalidatePath("/dashboard");
    } catch (error) {
      console.log("Error", error.message);
      return { error: error.message };
    }
  }


export async function deleteAssignment(assignmentId) {
    const session = await getUser();
    
    if (!session || session.role !== 'TEACHER') {
      return { error: 'Unauthorized' };
    }
    
    try {
      if (!assignmentId) {
        throw new Error("Assignment ID is required");
      }
  
      const teacher = await prisma.teacher.findUnique({
        where: { userId: session.id }
      });
  
      if (!teacher) {
        throw new Error("Teacher profile not found");
      }
  
      const assignment = await prisma.assignment.findFirst({
        where: { 
          id: assignmentId,
          subject: {
            teacherId: teacher.id 
          }
        }
      });
  
      if (!assignment) {
        throw new Error("Assignment not found or unauthorized");
      }
  
      await prisma.assignment.delete({
        where: { id: assignmentId }
      });
  
      revalidatePath('/dashboard');

    } catch (error) {
        console.log("Error", error.message);

        return { error: error.message };
    }
}

export async function gradeSubmission(formData, submissionId) {
  const session = await getUser();

  if (!session || session.role !== "TEACHER") {
    return { error: "Unauthorized" };
  }

  const grade = parseFloat(formData.get("grade"));

  try {
    if (!submissionId || isNaN(grade)) {
      throw new Error("Submission ID and valid grade are required");
    }

    if (grade < 0 || grade > 100) {
      throw new Error("Grade must be between 0 and 100");
    }

    const teacher = await prisma.teacher.findUnique({
      where: { userId: session.id },
    });

    if (!teacher) {
      throw new Error("Teacher profile not found");
    }

    const submission = await prisma.submission.findFirst({
      where: {
        id: submissionId,
        student: {
          teacherId: teacher.id,
        },
      },
    });

    if (!submission) {
      throw new Error("Submission not found or unauthorized");
    }

    await prisma.submission.update({
      where: { id: submissionId },
      data: { grade },
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.log("Error", error.message);
    return { error: error.message };
  }
}

export async function removeSubmissionGrade(submissionId) {
    const session = await getUser();
    
    if (!session || session.role !== 'TEACHER') {
      return { error: 'Unauthorized' };
    }
    
    try {
      if (!submissionId) {
        throw new Error("Submission ID is required");
      }
  
      const teacher = await prisma.teacher.findUnique({
        where: { userId: session.id }
      });
  
      if (!teacher) {
        throw new Error("Teacher profile not found");
      }
  
      const submission = await prisma.submission.findFirst({
        where: { 
          id: submissionId,
          student: {
            teacherId: teacher.id 
          }
        }
      });
  
      if (!submission) {
        throw new Error("Submission not found or unauthorized");
      }
  
      await prisma.submission.update({
        where: { id: submissionId },
        data: { grade: null }
      });
  
      revalidatePath('/dashboard');
    } catch (error) {
        console.log("Error", error.message);

        return { error: error.message };
    }
}