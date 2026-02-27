import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";

import Dashboard from "@/pages/dashboard";
import Transactions from "@/pages/transactions";
import NotFound from "@/pages/not-found";
import { AppSidebar } from "@/components/app-sidebar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/transactions" component={Transactions} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* We force dark mode by not toggling .dark and using root vars, but adding dark class to be safe with Shadcn */}
        <div className="dark flex h-screen w-full overflow-hidden bg-background text-foreground">
          <SidebarProvider style={style as React.CSSProperties}>
            <AppSidebar />
            <Router />
          </SidebarProvider>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
