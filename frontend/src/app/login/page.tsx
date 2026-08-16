import AdminLoginForm from "@/components/AdminLoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Decorative background elements matching the main site */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-beige-light/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-beige-light/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-50 pointer-events-none" />
      
      <div className="w-full relative z-10">
        <AdminLoginForm />
      </div>
    </div>
  );
}
