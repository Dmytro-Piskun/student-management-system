"use client"
import Card from "@/components/ui/Card";
import { formatDate } from "@/utils/dateUtils";
import Link from "next/link";
import { useState, useTransition } from "react";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/context/ToastContext";
import { createAssignment } from "@/server/teacherActions";


export default function TeacherAssignmentsContainer({ assignments, subjectId }) {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const { showToast } = useToast();


  const handleCreateAssignment = (formData) => {
    startTransition(async () => {
      const result = await createAssignment(formData, subjectId);

      if (result?.error) {
        showToast(result.error, 'error');
      } else {
        showToast('Assignment created successfully', 'success');
      }
      setIsModalOpen(false);

    });
  };

  return (
    <>
      <Card header={"Assignments"} className="mb-6 relative" >

        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-6 right-6 text-3xl text-gray-600 hover:text-gray-900 transition-colors"
        >
          +
        </button>

        {assignments.length === 0 ? (
          <div className="min-h-[33vh] flex items-center justify-center">
            <p className="text-center text-gray-500 py-4">
              No assignments.
            </p>
          </div>
        ) : (
          <div className="w-full pt-8">
            <div className="max-h-80 overflow-y-auto relative">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="sticky top-0 bg-white z-10 shadow-sm">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-800 tracking-wider">
                      Assignment
                    </th>
                    <th className="px-6 py-3 text-right font-semibold text-gray-800 tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-right font-semibold text-gray-800 tracking-wider">
                      Submissions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignments.map((assignment) => {
                    return (
                      <tr
                        key={assignment.id}
                        className="group hover:bg-gray-50 transition-colors duration-300"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 group-hover:text-blue-600">
                          <Link
                            href={`/subjects/${assignment.subjectId}/assignments/${assignment.id}`}
                            className="block hover:text-blue-600"
                          >
                            {assignment.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500 group-hover:text-blue-600">
                          <Link
                            href={`/assignments/${assignment.id}`}
                            className="block hover:text-blue-600"
                          >
                            {formatDate(assignment.dueDate)}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <Link
                            href={`/assignments/${assignment.id}`}
                            className="block hover:text-blue-600"
                          >
                            {assignment.submissions.length}

                          </Link>
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
        title="Create New Assignment"
        width="w-96"
        className="mb-6"
      >
        <form action={handleCreateAssignment} >
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions:</label>
            <textarea
              id="instructions"
              name="instructions"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date:</label>
            <input
              type="datetime-local"
              id="dueDate"
              name="dueDate"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center p-2 bg-gradient-to-r from-blue-300 to-sky-300 text-white rounded-md font-semibold transition-all duration-200 hover:from-blue-400 hover:to-sky-400 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Assignment
          </button>
        </form>
      </Modal>
    </>
  );
}
