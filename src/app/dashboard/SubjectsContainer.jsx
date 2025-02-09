"use client";

import { useState, useTransition } from "react";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";
import { createSubject } from "@/server/teacherActions";

export default function SubjectsContainer({ subjects, role }) {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const { showToast } = useToast();


  const handleAddSubject = (formData) => {
    startTransition(async () => {
      const result = await createSubject(formData);

      if (result?.error) {
        showToast(result.error, 'error');
      } else {
        showToast('Subject created successfully', 'success');
      }
      setIsModalOpen(false);

    });
  };

  return (
    <>
      <Card header={"Subjects"} className="mb-6 group min-h-[30vh] relative">
        <div className={`flex ${subjects.length === 0 ? "justify-center items-center" : "gap-8 justify-start py-8 flex-wrap"} min-h-[20vh]`}>
          {subjects.length > 0 ? (
            <>
              {subjects.map((subject) => (
                <Link
                  href={`/subjects/${subject.id}`}
                  key={subject.id}
                  className="bg-white shadow-[0_0_2px_0_rgba(0,0,0,0.2)] 
                         flex-1 min-w-[216px] max-w-[240px] h-[144px] 
                         flex justify-center items-center rounded-lg 
                         transition duration-150 
                           hover:scale-[101%] break-words"
                >
                  {subject.name}
                </Link>
              ))}

              {role === "TEACHER" && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gray-50 hover:bg-gray-100 shadow-[0_0_2px_0_rgba(0,0,0,0.2)] 
                         hidden group-hover:flex opacity-0 group-hover:opacity-100 
                         duration-150 text-4xl text-gray-300 hover:text-gray-400 
                         flex-1 min-w-[216px] max-w-[240px] h-[144px] 
                         justify-center items-center rounded-lg"
                >
                  +
                </button>

              )}
            </>
          ) : (
            <>
              <p className="text-gray-500 text-center">No subjects available.</p>
              
              {role === "TEACHER" && (
                 <button
                 onClick={() => setIsModalOpen(true)}
                 className="absolute top-4 right-6 text-3xl text-gray-600 hover:text-gray-900 transition-colors"
             >
                 +
             </button>

              )}
            </>
          )}
        </div>
      </Card>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Subject"
        width="w-96"
        className="mb-6"
      >
        <form action={handleAddSubject}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Subject Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              disabled={isPending}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center p-2 bg-gradient-to-r from-blue-300 to-sky-300 text-white rounded-md font-semibold transition-all duration-200 hover:from-blue-400 hover:to-sky-400 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Adding..." : "Create Subject"}
          </button>
        </form>
      </Modal>
    </>
  );
}