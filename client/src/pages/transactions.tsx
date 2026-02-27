import { AppSidebar } from "@/components/app-sidebar";
import { TransactionList } from "@/components/transaction-list";
import { TransactionForm } from "@/components/transaction-form";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Transactions() {
  return (
    <div className="flex flex-col flex-1 min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>
              Transactions
            </h1>
            <p className="text-sm text-muted-foreground hidden sm:block">Manage and filter all your historical records</p>
          </div>
        </div>
        <TransactionForm />
      </header>
      
      <main className="flex-1 p-6 overflow-y-auto max-w-5xl mx-auto w-full">
        <TransactionList />
      </main>
    </div>
  );
}
