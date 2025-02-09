import prisma from "@/lib/prisma";
import { createStudentAccount, createSubject, deleteSubject, deleteStudentAccount, createAssignment, deleteAssignment, gradeSubmission, removeSubmissionGrade} from "@/server/teacherActions";


export default async function Teacher({ userId }) {

  const teacher = await prisma.teacher.findUnique({
    where: {
      userId: userId,
    },
    include: {
      user: true,
      subjects: {
        include: {
          assignments: {
            include: {
              submissions: {
                include: {
                  student: {
                    include: {
                      user: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      students: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!teacher) {
    return <div className="p-4 text-red-500">Teacher not found.</div>;
  }

  return (
    <>

      {/* <pre>{JSON.stringify(teacher, null, 2)}</pre> */}


      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Teacher Profile</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {teacher.user.username}
          </h2>
          <p className="text-gray-600">Role: {teacher.user.role}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Subjects</h2>
          {teacher.subjects.map((subject) => (
            <div key={subject.id} className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {subject.name}
                <span className="text-gray-600 text-sm font-semibold ml-2">
                  {subject.id}
                </span>
              </h3>

              <div className="ml-4">
                <h4 className="text-lg font-bold text-gray-700 mb-3">Assignments</h4>
                {subject.assignments.map((assignment) => (
                  <div key={assignment.id} className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h5 className="text-md font-semibold text-gray-800">
                      {assignment.title}
                      <span className="text-gray-600 text-sm font-semibold ml-2">
                        {assignment.id}
                      </span>

                    </h5>
                    <p className="text-gray-600">{assignment.instructions}</p>
                    <p className="text-gray-600">
                      Due Date: {assignment.dueDate.toLocaleDateString()}
                    </p>

                    <div className="ml-4 mt-3">
                      <h6 className="text-sm font-bold text-gray-700 mb-2">
                        Submissions
                      </h6>
                      {assignment.submissions.map((submission) => (
                        <div
                          key={submission.id}
                          className="bg-white p-3 rounded-lg shadow-sm mb-2"
                        >
                          <p className="text-gray-700">
                            Student: {submission.student.user.username}
                          </p>
                          <p className="text-gray-700">
                            ID: {submission.id}
                          </p>
                          <p className="text-gray-600">Content: {submission.content}</p>
                          <p className="text-gray-600">
                            Grade: {submission.grade ?? "Not graded"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Students</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teacher.students.map((student) => (
              <div
                key={student.id}
                className="bg-white shadow-md rounded-lg p-4"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {student.user.username}
                </h3>
                <p className="text-gray-600">Role: {student.user.role}</p>
                <p className="text-gray-600">ID: {student.user.id}</p>
                <p className="text-gray-600">Student ID: {student.id}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}

      <div className="space-y-8 p-6 bg-gray-100 min-h-screen">
        {/* Create new student accounts. */}
        <form action={createStudentAccount} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Create New Student Account</h2>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Create Student
          </button>
        </form>

        {/* Create new subjects. */}
        <form action={createSubject} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Create New Subject</h2>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Subject Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Create Subject
          </button>
        </form>

        {/* Delete subjects. */}
        <form action={deleteSubject} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Delete Subject</h2>
          <div className="mb-4">
            <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700">Subject ID:</label>
            <input
              type="text"
              id="subjectId"
              name="subjectId"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete Subject
          </button>
        </form>

        {/* Delete student accounts. */}
        <form action={deleteStudentAccount} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Delete Student Account</h2>
          <div className="mb-4">
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">Student ID:</label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete Student
          </button>
        </form>

        {/* Create new assignments. */}
        <form action={createAssignment} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Create New Assignment</h2>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions:</label>
            <textarea
              id="instructions"
              name="instructions"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date:</label>
            <input
              type="datetime-local"
              id="dueDate"
              name="dueDate"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700">Subject ID:</label>
            <input
              type="text"
              id="subjectId"
              name="subjectId"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Create Assignment
          </button>
        </form>

        {/* Delete assignments. */}
        <form action={deleteAssignment} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Delete Assignment</h2>
          <div className="mb-4">
            <label htmlFor="assignmentId" className="block text-sm font-medium text-gray-700">Assignment ID:</label>
            <input
              type="text"
              id="assignmentId"
              name="assignmentId"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete Assignment
          </button>
        </form>

        {/* Grade student submission. */}
        <form action={gradeSubmission} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Grade Submission</h2>
          <div className="mb-4">
            <label htmlFor="submissionId" className="block text-sm font-medium text-gray-700">Submission ID:</label>
            <input
              type="text"
              id="submissionId"
              name="submissionId"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700">Grade:</label>
            <input
              type="number"
              id="grade"
              name="grade"
              step="0.1"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Submit Grade
          </button>
        </form>

        {/* Remove grades. */}
        <form action={removeSubmissionGrade} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Remove Grade</h2>
          <div className="mb-4">
            <label htmlFor="submissionId" className="block text-sm font-medium text-gray-700">Submission ID:</label>
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
            Remove Grade
          </button>
        </form>
      </div>

    </>





  );
}



