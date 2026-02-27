import { ArrowDownRight, ArrowUpRight, DollarSign, Loader2 } from "lucide-react";
import { useTransactions } from "@/hooks/use-transactions";

export function KpiCards() {
  const { data: transactions, isLoading } = useTransactions();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-card rounded-2xl animate-pulse border border-white/5" />
        ))}
      </div>
    );
  }

  const txs = transactions || [];
  
  const totalIncome = txs
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const totalExpense = txs
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const balance = totalIncome - totalExpense;

  const cards = [
    {
      title: "Total Balance",
      amount: balance,
      icon: DollarSign,
      color: "text-primary",
      bgLight: "bg-primary/10",
      gradient: "from-primary/10 to-transparent",
    },
    {
      title: "Total Income",
      amount: totalIncome,
      icon: ArrowUpRight,
      color: "text-success",
      bgLight: "bg-success/10",
      gradient: "from-success/10 to-transparent",
    },
    {
      title: "Total Expenses",
      amount: totalExpense,
      icon: ArrowDownRight,
      color: "text-destructive",
      bgLight: "bg-destructive/10",
      gradient: "from-destructive/10 to-transparent",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, idx) => (
        <div 
          key={idx} 
          className="relative overflow-hidden bg-card rounded-2xl border border-white/5 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">{card.title}</p>
              <h3 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                ${card.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className={`p-3 rounded-xl ${card.bgLight} ${card.color}`}>
              <card.icon className="h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
