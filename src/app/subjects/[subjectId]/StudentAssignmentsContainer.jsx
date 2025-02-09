import Card from "@/components/ui/Card";
import { formatDate } from "@/utils/dateUtils";
import Link from "next/link";

export default function StudentAssignmentsContainer({ assignments }) {
  const sortedAssignments = [...assignments].sort((a, b) => {
    if (a.isSubmitted !== b.isSubmitted) {
      return a.isSubmitted ? 1 : -1; 
    }
    return new Date(a.dueDate) - new Date(b.dueDate);
  });


  const getAssignmentStatus = (assignment) => {
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    
    if (assignment.isSubmitted) {
      const submissionDate = new Date(assignment.submission?.createdAt);
      if (submissionDate > dueDate) {
        return {
          label: "Submitted Late",
          class: "bg-orange-100 text-orange-800"
        };
      }
      return {
        label: "Submitted",
        class: "bg-green-100 text-green-800"
      };
    }
    
    return dueDate < now ? {
      label: "Overdue",
      class: "bg-red-100 text-red-800"
    } : {
      label: "Pending",
      class: "bg-yellow-100 text-yellow-800"
    };
  };

  return (
    <Card header={"Assignments"}>
      {sortedAssignments.length === 0 ? (
        <div className="min-h-[30vh] flex items-center justify-center">
          <p className="text-center text-gray-500 py-4">
            No upcoming assignments.
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
                  <th className="px-6 py-3 text-center font-semibold text-gray-800 tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-800 tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAssignments.map((assignment) => {
                  const status = getAssignmentStatus(assignment);

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
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500 group-hover:text-blue-600">
                        <Link
                          href={`/subjects/${assignment.subjectId}/assignments/${assignment.id}`}
                          className="block hover:text-blue-600"
                        >
                          {formatDate(assignment.dueDate)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Link
                          href={`/subjects/${assignment.subjectId}/assignments/${assignment.id}`}
                          className="block hover:text-blue-600"
                        >
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.class}`}
                          >
                            {status.label}
                          </span>
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
  );
}