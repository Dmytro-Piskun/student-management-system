import Card from "@/components/ui/Card";

export default function StudentsContainer({students}) {

  return (
    <Card header={"Student Grades"} className=" flex-1">

    {students.length === 0 ? (
        <div className="min-h-[20vh] flex items-center justify-center">
            <p className="text-center text-gray-500 py-4">
                No students.
            </p>
        </div>
    ) : (
        <div className="w-full pt-8">
            <div className="max-h-64 overflow-y-auto relative">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="sticky top-0 bg-white z-10 shadow-sm">
                        <tr>
                            <th className="px-6 py-3 text-left font-semibold text-gray-800 tracking-wider">
                                Username
                            </th>
                            <th className="px-6 py-3 text-center font-semibold text-gray-800 tracking-wider">
                                Submissions
                            </th>
                            <th className="px-6 py-3 text-right font-semibold text-gray-800 tracking-wider">
                                Grade
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {students.map((student) => {
                            const grade = student.averageGrade;
                            const gradeClass = grade ? grade >= 70
                                ? "bg-green-100 text-green-800"
                                : grade >= 50
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800";

                            return (
                                <tr
                                    key={student.id}
                                    className="group hover:bg-gray-50 transition-colors duration-300"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 group-hover:text-blue-600">
                                        <div
                                            className="block hover:text-blue-600"
                                        >
                                            {student.username}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-900 group-hover:text-blue-600">
                                        <div
                                            className="block hover:text-blue-600"
                                        >
                                            {student.submissionsCount}
                                        </div>
                                    </td>
                                  
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div
                                            className="block hover:text-blue-600"
                                        >
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${gradeClass}`}
                                            >
                                                 {grade || "No grades"}
                                            </span>
                                        </div>
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
