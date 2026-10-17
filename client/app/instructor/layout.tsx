import AuthGate from "@/components/AuthGate";
import InstructorSidebar from "./_components/InstructorSideBar";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row justify-center">
      <AuthGate>
        <InstructorSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </AuthGate>
    </div>
  );
}
