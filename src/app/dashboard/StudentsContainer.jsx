"use client";
import Card from "@/components/ui/Card";
import { useState, useTransition } from "react";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/context/ToastContext";
import { createStudentAccount, deleteStudentAccount } from "@/server/teacherActions";

export default function StudentsContainer({ students }) {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isPending, startTransition] = useTransition();
   const { showToast } = useToast();

   const handleAddStudent = (formData) => {
       startTransition(async () => {
           const result = await createStudentAccount(formData);

           if (result?.error) {
               showToast(result.error, 'error');
           } else {
               showToast('Student created successfully', 'success');
           }
           setIsModalOpen(false);
       });
   };

   const handleDeleteStudent = (studentId) => {
      
           startTransition(async () => {
               const result = await deleteStudentAccount(studentId);
               
               if (result?.error) {
                   showToast(result.error, 'error');
               } else {
                   showToast('Student deleted successfully', 'success');
               }
           });
       
   };

   return (
       <>
           <Card header={"Students"} className="relative">
               <button
                   onClick={() => setIsModalOpen(true)}
                   className="absolute top-6 right-6 text-3xl text-gray-600 hover:text-gray-900 transition-colors"
               >
                   +
               </button>

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
                                       <th className="px-6 py-3 text-right font-semibold text-gray-800 tracking-wider">
                                           Grade
                                       </th>
                                   </tr>
                               </thead>
                               <tbody className="bg-white divide-y divide-gray-200">
                                   {students.map((student) => {
                                       const grade = student.grade;
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
                                               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 group-hover:text-blue-600 relative">
                                                   <div className="flex items-center">
                                                       <span className="block hover:text-blue-600">
                                                           {student.username}
                                                       </span>
                                                       <button
                                                           onClick={() => handleDeleteStudent(student.id)}
                                                           disabled={isPending}
                                                           className="ml-2 text-red-600 hover:text-red-900 opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                       >
                                                           <svg 
                                                               xmlns="http://www.w3.org/2000/svg" 
                                                               className="h-5 w-5" 
                                                               viewBox="0 0 20 20" 
                                                               fill="currentColor"
                                                           >
                                                               <path 
                                                                   fillRule="evenodd" 
                                                                   d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" 
                                                                   clipRule="evenodd" 
                                                               />
                                                           </svg>
                                                       </button>
                                                   </div>
                                               </td>
                                               <td className="px-6 py-4 whitespace-nowrap text-right">
                                                   <div className="block hover:text-blue-600">
                                                       <span
                                                           className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${gradeClass}`}
                                                       >
                                                           {student.grade || "No grades"}
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
           <Modal
               isOpen={isModalOpen}
               onClose={() => setIsModalOpen(false)}
               title="Create New Student"
               width="w-96"
               className="mb-6"
           >
               <form action={handleAddStudent}>
                   <div className="mb-4">
                       <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
                       <input
                           type="text"
                           id="username"
                           name="username"
                           required
                           disabled={isPending}
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                           focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                           disabled:opacity-50 disabled:cursor-not-allowed"
                       />
                   </div>

                   <div className="mb-4">
                       <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
                       <input
                           type="password"
                           id="password"
                           name="password"
                           required
                           disabled={isPending}
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                           focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                           disabled:opacity-50 disabled:cursor-not-allowed"
                       />
                   </div>

                   <button
                       type="submit"
                       disabled={isPending}
                       className="w-full flex justify-center p-2 bg-gradient-to-r from-blue-300 to-sky-300 text-white 
                       rounded-md font-semibold transition-all duration-200 
                       hover:from-blue-400 hover:to-sky-400 hover:shadow-md hover:scale-[1.02] 
                       active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 
                       disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                       {isPending ? "Creating..." : "Create Student"}
                   </button>
               </form>
           </Modal>
       </>
   );
}