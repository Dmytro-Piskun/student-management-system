import Card from "@/components/ui/Card";

export default function OverallGrade({ grade }) {

  const gradeClass =  grade >= 70
    ? "bg-green-100 text-green-800 outline-green-200"
    : grade >= 50
      ? "bg-yellow-100 text-yellow-800 outline-yellow-200"
      : "bg-red-100 text-red-800 outline-red-200";
    

  return (
    <>
      {grade !== 0 &&
        <Card header={"Overall Grade"} className="w-80">
          <div className="w-full h-full flex items-center justify-center text-4xl font-semibold pb-6">
            <div className={`p-12 rounded-lg outline outline-3 outline-offset-[-1rem] ${gradeClass}`}>
              {grade}
            </div>
          </div>
        </Card>
      }
    </>
  )
}
