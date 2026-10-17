import AuthGate from "@/components/AuthGate";
import Footer from "@/components/footer";
import Header from "@/components/Header";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <AuthGate>
        <Header />
        {children}
        <Footer />
      </AuthGate>
    </section>
  );
}
