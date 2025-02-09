"use client";

import { formatDateTime } from "@/utils/dateUtils";
import { addSubmission, removeSubmission } from "@/server/studentActions";
import { deleteAssignment } from "@/server/teacherActions";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import Card from "@/components/ui/Card";

export default function AssignmentContainer({ assignment, role }) {
    const [isPending, startTransition] = useTransition();
    const { showToast } = useToast();
    const router = useRouter();
    

    const isStudent = role === "STUDENT";
    const isSubmited = isStudent ? assignment.submissions?.length > 0 : false;
    const [content, setContent] = useState(isSubmited ? assignment.submissions[0]?.content : '');

    const isOverdue = isStudent ? new Date(assignment.dueDate) < new Date() : false;

    const submissionDate = isSubmited ? new Date(assignment.submissions[0].createdAt) : null;
    const wasSubmittedLate = submissionDate && submissionDate > new Date(assignment.dueDate);

    let gradeClass = "";
    let grade = null;

    if (isSubmited) {
        grade = assignment.submissions[0].grade;
        if (!grade) {
            gradeClass = " text-gray-600";
        } else if (grade >= 70) {
            gradeClass = "bg-green-100 text-green-800";
        } else if (grade >= 50) {
            gradeClass = "bg-yellow-100 text-yellow-800";
        } else {
            gradeClass = "bg-red-100 text-red-800";
        }
    }

    const handleAddSubmission = (formData) => {
        startTransition(async () => {
            const result = await addSubmission(formData, assignment.id);

            if (result?.error) {
                showToast(result.error, 'error');
            } else {
                showToast('Assignment submitted successfully', 'success');
            }
        });
    };

    const handleRemoveSubmission = () => {
        startTransition(async () => {
            const result = await removeSubmission(assignment.submissions[0]?.id);

            if (result?.error) {
                showToast(result.error, 'error');
            } else {
                showToast('Assignment removed successfully', 'success');
            }
        });
    }

    const handleDeleteAssignment = () => {
        startTransition(async () => {
            const result = await deleteAssignment(assignment.id);

            if (result?.error) {
                showToast(result.error, 'error');
            } else {
                showToast('Assignment deleted successfully', 'success');
                router.push(`/subjects/${assignment.subjectId}`);
            }
        });
    }

    return (
        <Card header={assignment.title} className="relative mb-6">
            <div className="p-6 space-y-4">
                <div className="text-sm text-gray-500">
                    Task is due {formatDateTime(assignment.dueDate)}
                </div>

                <div>
                    <h3 className="font-medium mb-2">Instructions</h3>
                    <p className="text-sm text-gray-600 w-1/2 max-w-[50rem] break-words">
                        {assignment.instructions}
                    </p>
                </div>
                <div className="space-y-4">
                    {isStudent && (
                        <form action={handleAddSubmission}>
                            <div>
                                <h3 className="font-medium mb-2">{isSubmited ? "Submission" : "Submission Text"}</h3>
                                <textarea
                                    name="content"
                                    className="h-80 p-2 text-sm resize-y w-1/2 max-w-[50rem] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Add your submission here..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    readOnly={isSubmited}
                                    disabled={isSubmited || isPending}
                                />
                            </div>
                            {isSubmited ? (
                                <div className="absolute top-6 right-6">
                                    <div className="flex justify-center items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="text-sm whitespace-nowrap">
                                                <span className="text-gray-500">Submitted: </span>
                                                <span className="text-gray-600">
                                                    {formatDateTime(submissionDate)}
                                                    {wasSubmittedLate && " (Late)"}
                                                </span>
                                            </div>
                                            <div className="w-full h-full flex items-center justify-center text-md">
                                                <div className={`px-3 py-2 rounded-lg whitespace-nowrap ${gradeClass}`}>
                                                    {grade ? `Grade: ${grade}` : " Not graded"}
                                                </div>
                                            </div>
                                        </div>

                                        {!grade && (
                                            <button
                                                onClick={() => handleRemoveSubmission()}
                                                disabled={isPending}
                                                className="flex w-full justify-center p-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-md font-semibold transition-all duration-200 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                            >
                                                {isPending ? "Removing..." : "Remove submission"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className={`absolute top-6 right-12 w-40 flex justify-center p-2 text-white rounded-md font-semibold transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${isOverdue
                                            ? "bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 focus:ring-orange-300"
                                            : "bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 focus:ring-green-300"
                                            }`}
                                    >
                                        {isPending
                                            ? "Submitting..."
                                            : isOverdue
                                                ? "Submit Late"
                                                : "Submit"
                                        }
                                    </button>
                                </div>
                            )}
                        </form>
                    )}
                    {!isStudent && (
                        <div className="absolute top-6 right-6">

                            <button
                                onClick={() => handleDeleteAssignment()}
                                disabled={isPending}
                                className="flex w-full justify-center p-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-md font-semibold transition-all duration-200 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                {isPending ? "Removing..." : "Remove Assignment"}
                            </button>

                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}