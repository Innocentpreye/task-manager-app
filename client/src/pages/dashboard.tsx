import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { KpiCards } from "@/components/kpi-cards";
import { DashboardCharts } from "@/components/dashboard-charts";
import { TransactionList } from "@/components/transaction-list";
import { TransactionForm } from "@/components/transaction-form";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Dashboard() {
  return (
    <div className="flex flex-col flex-1 min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>
            Overview
          </h1>
        </div>
        <TransactionForm />
      </header>
      
      <main className="flex-1 p-6 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
        <KpiCards />
        
        <DashboardCharts />

        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>
              Recent Transactions
            </h2>
            <Link href="/transactions" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 group">
              View All 
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="bg-card border border-white/5 rounded-2xl p-6 shadow-xl">
            <TransactionList limit={5} />
          </div>
        </div>
      </main>
    </div>
  );
}
