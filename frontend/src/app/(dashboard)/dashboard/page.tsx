"use client"
import CreateTask from "@/features/dashboard/components/CreateTask"

const page = () => {
  return (
    <div className="space-y-10">
      <header className="flex w-full h-25 border">

      </header>
      <main>
        {/* mid */}
        <div className="max-w-2xl h-full">
          {/* add a tasks */}
          <CreateTask />
          {/* tasks list */}
          <div>

          </div>
        </div>
        {/* right */}
        <div>

        </div>
      </main>
    </div>
  )
}

export default page
