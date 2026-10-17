import Footer from "@/components/footer";
import Header from "@/components/Header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
