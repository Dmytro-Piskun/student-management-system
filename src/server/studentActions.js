"use server"

import prisma from '@/lib/prisma';
import { getUser } from './authActions';
import { revalidatePath } from 'next/cache';

export async function addSubmission(formData,assignmentId) {
    const session = await getUser();

    if (!session || session.role !== 'STUDENT') {
        return { error: 'Unauthorized' };
    }

    const content = formData.get("content");

    try {
        if (!assignmentId || !content) {
            throw new Error("Submission content is required");
        }

        const student = await prisma.student.findUnique({
            where: { userId: session.id }
        });

        if (!student) {
            throw new Error("Student profile not found");
        }

        const existingSubmission = await prisma.submission.findUnique({
            where: {
                studentId_assignmentId: {
                    studentId: student.id,
                    assignmentId: assignmentId
                }
            }
        });

        if (existingSubmission) {
            throw new Error("You cant submit this assignment");
        }

        const submission = await prisma.submission.create({
            data: {
                content,
                studentId: student.id,
                assignmentId: assignmentId
            }
        });

        revalidatePath('/dashboard');

    } catch (error) {
        console.log("Error:", error.message);
        return { error: error.message };
    }
}

export async function removeSubmission(submissionId) {
    const session = await getUser();

    if (!session || session.role !== 'STUDENT') {
        return { error: 'Unauthorized' };
    }

    try {
        if (!submissionId) {
            throw new Error("Submission ID is required");
        }

        const student = await prisma.student.findUnique({
            where: { userId: session.id }
        });

        if (!student) {
            throw new Error("Student profile not found");
        }

        const submission = await prisma.submission.findFirst({
            where: {
                id: submissionId,
                studentId: student.id
            }
        });

        if (!submission) {
            throw new Error("Submission not found or unauthorized");
        }

        if (submission.grade !== null) {
            throw new Error("Cannot remove a graded submission");
        }

        await prisma.submission.delete({
            where: { id: submissionId }
        });

        revalidatePath('/dashboard');

    } catch (error) {
        console.log("Error:", error.message);
        return { error: error.message };
    }
}
