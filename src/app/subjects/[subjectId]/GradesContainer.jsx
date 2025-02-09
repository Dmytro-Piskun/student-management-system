import Card from "@/components/ui/Card";
import Link from "next/link";

export default function GradesContainer({grades}) {


  
  return (    
    
    <Card header={"Grades"} className=" flex-1">

        {grades.length === 0 ? (
            <div className="min-h-[20vh] flex items-center justify-center">
                <p className="text-center text-gray-500 py-4">
                    No graded submissions.
                </p>
            </div>
        ) : (
            <div className="w-full pt-8">
                <div className="max-h-64 overflow-y-auto relative">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="sticky top-0 bg-white z-10 shadow-sm">
                            <tr>
                                <th className="px-6 py-3 text-left font-semibold text-gray-800 tracking-wider">
                                    Assignment
                                </th>
                                <th className="px-6 py-3 text-right font-semibold text-gray-800 tracking-wider">
                                    Grade
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {grades.map((grade) => {
                                const gradeValue = grade.grade;
                                const gradeClass = gradeValue ? gradeValue >= 70
                                    ? "bg-green-100 text-green-800"
                                    : gradeValue >= 50
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800";

                                return (
                                    <tr
                                        key={grade.id}
                                        className="group hover:bg-gray-50 transition-colors duration-300"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 group-hover:text-blue-600">
                                            <Link
                                                href={`/subjects/${grade.assignment.subjectId}/assignments/${grade.assignment.id}`}
                                                className="block hover:text-blue-600"
                                            >
                                                {grade.assignment.title}
                                            </Link>
                                        </td>
                                      
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Link
                                                href={`/subjects/${grade.assignment.subjectId}/assignments/${grade.assignment.id}`}
                                                className="block hover:text-blue-600"
                                            >
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${gradeClass}`}
                                                >
                                                    {gradeValue}
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
