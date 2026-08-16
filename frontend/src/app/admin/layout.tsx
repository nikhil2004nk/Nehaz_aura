import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-beige-light/10">
        {children}
      </main>
    </div>
  );
}
