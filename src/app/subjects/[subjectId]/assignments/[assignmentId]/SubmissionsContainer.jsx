"use client";

import { useState, useTransition } from "react";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import { formatDateTime } from "@/utils/dateUtils";
import { useToast } from "@/context/ToastContext";
import { gradeSubmission, removeSubmissionGrade } from "@/server/teacherActions";

export default function SubmissionsContainer({ submissions }) {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const getSubmissionStatus = (submission) => {
    if (submission.grade !== null) {
      return {
        label: "Graded",
        class: "bg-blue-100 text-blue-800"
      };
    }

    const submissionDate = new Date(submission.createdAt);
    const dueDate = new Date(submission.assignment.dueDate);

    return submissionDate > dueDate
      ? {
        label: "Submitted Late",
        class: "bg-orange-100 text-orange-800"
      }
      : {
        label: "Submitted",
        class: "bg-green-100 text-green-800"
      };
  };

  const handleGradeSubmission = async (formData) => {
    startTransition(async () => {

      const result = await gradeSubmission(formData ,selectedSubmission.id);

      if (result?.error) {
        showToast(result.error, 'error');
      } else {
        showToast('Student created successfully', 'success');
      }
      setIsModalOpen(false);
    });
  };

  const handleRemoveSubmissionGrade = async () => {


 startTransition(async () => {
               const result = await removeSubmissionGrade(selectedSubmission.id);
               
               if (result?.error) {
                   showToast(result.error, 'error');
               } else {
                   showToast('Student deleted successfully', 'success');
               }
               setIsModalOpen(false);
           });

  };

  return (
    <>
      <Card header="Submissions">
        {submissions.length === 0 ? (
          <div className="min-h-[30vh] flex items-center justify-center">
            <p className="text-center text-gray-500 py-4">
              No submissions yet.
            </p>
          </div>
        ) : (
          <div className="w-full pt-8">
            <div className="max-h-80 overflow-y-auto relative">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="sticky top-0 bg-white z-10 shadow-sm">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-800 tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-800 tracking-wider">
                      Submission Date
                    </th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-800 tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-right font-semibold text-gray-800 tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission) => {
                    const status = getSubmissionStatus(submission);

                    return (
                      <tr
                        key={submission.id}
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setIsModalOpen(true);
                        }}
                        className="group hover:bg-gray-50 transition-colors duration-300 cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {submission.student.user.username}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                          {formatDateTime(submission.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                          {submission.grade !== null ? `${submission.grade}%` : "-"}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.class}`}
                          >
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Grade Submission"
        width="w-96"
      >
        <form action={handleGradeSubmission}>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Student</h3>
              <p className="text-gray-600">{selectedSubmission?.student.user.username}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Submission Content</h3>
              <p className="text-gray-600 max-h-40 overflow-y-auto">
                {selectedSubmission?.content}
              </p>
            </div>

            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700">Grade (0-100)</label>
              <input
                type="number"
                id="grade"
                name="grade"
                min="0"
                max="100"
                defaultValue={selectedSubmission?.grade || ""}
                required
                disabled={isPending}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 flex justify-center p-2 bg-gradient-to-r from-blue-300 to-sky-300 text-white 
                rounded-md font-semibold transition-all duration-200 
                hover:from-blue-400 hover:to-sky-400 hover:shadow-md hover:scale-[1.02] 
                active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 
                disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Updating..." : selectedSubmission?.grade !== null ? "Update Grade" : "Grade"}
              </button>

              {selectedSubmission?.grade !== null && (
                <button
                  type="button"
                  onClick={handleRemoveSubmissionGrade}
                  disabled={isPending}
                  className="flex-1 flex justify-center p-2 bg-gradient-to-r from-red-300 to-rose-300 text-white 
                  rounded-md font-semibold transition-all duration-200 
                  hover:from-red-400 hover:to-rose-400 hover:shadow-md hover:scale-[1.02] 
                  active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 
                  disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "Removing..." : "Remove Grade"}
                </button>
              )}
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}