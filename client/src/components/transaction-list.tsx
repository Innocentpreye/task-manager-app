import { useState } from "react";
import { format } from "date-fns";
import { Trash2, Search, ArrowUpRight, ArrowDownRight, Filter } from "lucide-react";
import { useTransactions, useDeleteTransaction } from "@/hooks/use-transactions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TransactionList({ limit }: { limit?: number }) {
  const { data: transactions, isLoading } = useTransactions();
  const deleteTx = useDeleteTransaction();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-20 bg-card rounded-xl animate-pulse border border-white/5" />
        ))}
      </div>
    );
  }

  let filtered = transactions || [];

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(t => 
      t.description.toLowerCase().includes(term) || 
      t.category.toLowerCase().includes(term)
    );
  }

  if (categoryFilter !== "all") {
    filtered = filtered.filter(t => t.category === categoryFilter);
  }

  // Sort by date descending
  filtered = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (limit) {
    filtered = filtered.slice(0, limit);
  }

  const categories = Array.from(new Set(transactions?.map(t => t.category) || []));

  return (
    <div className="space-y-6">
      {!limit && (
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search transactions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-card border-white/10 h-11 rounded-xl"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[200px] bg-card border-white/10 h-11 rounded-xl">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border/50">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12 px-4 bg-card/50 rounded-2xl border border-white/5 border-dashed">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 mb-4">
            <Receipt className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-foreground">No transactions found</p>
          <p className="text-muted-foreground mt-1">Try adjusting your filters or add a new transaction.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((tx) => {
            const isIncome = tx.type === "income";
            return (
              <div 
                key={tx.id} 
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-card border border-white/5 hover:border-white/10 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${isIncome ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                    {isIncome ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-base leading-tight">{tx.description}</h4>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/5 text-xs font-medium text-foreground/80">
                        {tx.category}
                      </span>
                      <span>•</span>
                      <span>{format(new Date(tx.date), "MMM dd, yyyy")}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 pl-14 sm:pl-0">
                  <span className={`text-lg font-bold ${isIncome ? 'text-success' : 'text-foreground'}`} style={{ fontFamily: "var(--font-display)" }}>
                    {isIncome ? "+" : "-"}${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deleteTx.mutate(tx.id)}
                    disabled={deleteTx.isPending}
                    className="opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Just need Receipt icon for empty state
import { Receipt } from "lucide-react";
