import prisma from "@/lib/prisma";
import {addSubmission, removeSubmission} from "@/server/studentActions";

export default async function Student({ userId }) {

  const student = await prisma.student.findUnique({
    where: {
      userId: userId, // Filter by userId
    },
    include: {
      user: true, // Include the related user information
      teacher: {
        include: {
          user: true, // Include teacher's user details
          subjects: {
            include: {
              assignments: {
                include: {
                  submissions: {
                    where: {
                      student: {
                        userId: userId, // Filter submissions by the student's userId
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  
  if (!student) {
    return <div className="p-4 text-red-500">Student not found.</div>;
  }

  return (

    <>
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Student Profile</h1>

      {/* Student Info */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {student.user.username}
        </h2>
        <p className="text-gray-600">Role: {student.user.role}</p>
        {student.teacher && (
          <p className="text-gray-600">
            Teacher: {student.teacher.user.username}
          </p>
        )}
      </div>

      {/* Subjects > Assignments > Submissions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Subjects</h2>
        {student.teacher ? (
          student.teacher.subjects.map((subject) => (
            <div key={subject.id} className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Subject: {subject.name}
              </h3>

              {/* Assignments for the Subject */}
              <div className="ml-4">
                {subject.assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="bg-gray-50 p-4 rounded-lg mb-4"
                  >
                    <h4 className="text-md font-semibold text-gray-800">
                      Assignment: {assignment.title}
                    </h4>
                    <p className="text-gray-600">ID: {assignment.id}</p>
                    <p className="text-gray-600">{assignment.instructions}</p>
                    <p className="text-gray-600">
                      Due Date: {assignment.dueDate.toLocaleDateString()}
                    </p>

                    {/* Submissions for the Assignment */}
                    <div className="ml-4 mt-3">
                      <h5 className="text-sm font-bold text-gray-700 mb-2">
                        Submissions
                      </h5>
                      {assignment.submissions.length > 0 ? (
                        assignment.submissions.map((submission) => (
                          <div
                            key={submission.id}
                            className="bg-white p-3 rounded-lg shadow-sm mb-2"
                          >
                            <p className="text-gray-700">
                              ID: {submission.id}
                            </p>
                            <p className="text-gray-700">
                              Content: {submission.content}
                            </p>
                            <p className="text-gray-600">
                              Grade: {submission.grade ?? "Not graded"}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600">No submissions yet.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No teacher assigned.</p>
        )}
      </div>
    </div>

    <div className="space-y-8 p-6 bg-gray-100 min-h-screen">
      {/* Submit Assignment Form */}
      <form action={addSubmission} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Submit Assignment</h2>
        <div className="mb-4">
          <label htmlFor="assignmentId" className="block text-sm font-medium text-gray-700">
            Assignment ID:
          </label>
          <input
            type="text"
            id="assignmentId"
            name="assignmentId"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Submission Content:
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows="4"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Submit Assignment
        </button>
      </form>

      {/* Delete Submission Form */}
      <form action={removeSubmission} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Delete Submission</h2>
        <div className="mb-4">
          <label htmlFor="submissionId" className="block text-sm font-medium text-gray-700">
            Submission ID:
          </label>
          <input
            type="text"
            id="submissionId"
            name="submissionId"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Delete Submission
        </button>
      </form>
    </div>
    </>
  );
}

  // async function submitAssignment(formData) {
  //   "use server";

  //   try {

  //     const assignmentId = formData.get('assignmentId');
  //     const content = formData.get('content');
    
  //     const existingSubmission = await prisma.submission.findFirst({
  //       where: {
  //         assignmentId,
  //         studentId,
  //       },
  //     });
    
  //     if (existingSubmission) {
  //       throw new Error('You have already submitted this assignment.');
  //     }
    
  //     await prisma.submission.create({
  //       data: {
  //         content,
  //         assignmentId,
  //         studentId,
  //       },
  //     });
    

  //   } catch (error) {

  //     console.log(error);

  //   }

  // }

  // async function deleteSubmission(formData) {
  //   "use server";

  //   try {

  //     const submissionId = formData.get('submissionId');

  //     const submission = await prisma.submission.findUnique({
  //       where: { id: submissionId },
  //     });

  //     if (submission?.studentId !== studentId) {
  //       throw new Error('You do not have permission to delete this submission.');
  //     }

  //     await prisma.submission.delete({
  //       where: { id: submissionId },
  //     });

  //   } catch (error) {

  //     console.log(error);

  //   }
  // }
