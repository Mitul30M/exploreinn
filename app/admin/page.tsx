import { PartyPopper } from "lucide-react";

const AdminPage = () => {
  return (
    <main className="min-h-screen bg-background border-border/90 border-x-[1px] max-w-7xl m-auto">

      <h1 className=" mt-20 font-semibold text-primary w-max mx-auto text-center flex items-center gap-2">
        <PartyPopper />
        Admin Login Successful!
        You are viewing /overview page.
      </h1>
    </main>
  );
};

export default AdminPage;
