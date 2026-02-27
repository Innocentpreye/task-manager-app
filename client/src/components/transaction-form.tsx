import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateTransaction } from "@/hooks/use-transactions";
import { Loader2, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";

// Matches categories from implementation notes
const categories = ["Food", "Rent", "Transport", "Tech", "Utilities", "Salary", "Other"] as const;

const formSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Must be a valid positive number",
  }),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function TransactionForm() {
  const [open, setOpen] = useState(false);
  const createTx = useCreateTransaction();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "expense",
      amount: "",
      category: "",
      description: "",
    },
  });

  const type = watch("type");

  const onSubmit = (data: FormValues) => {
    createTx.mutate(
      {
        ...data,
        amount: Number(data.amount),
      },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover-elevate">
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glass-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl tracking-tight">New Transaction</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Record a new income or expense to track your finances.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4 p-1 bg-black/20 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setValue("type", "expense")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                type === "expense" 
                  ? "bg-destructive text-destructive-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <ArrowDownRight className="h-4 w-4" />
              Expense
            </button>
            <button
              type="button"
              onClick={() => setValue("type", "income")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                type === "income" 
                  ? "bg-success text-success-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <ArrowUpRight className="h-4 w-4" />
              Income
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-muted-foreground">Amount</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                <Input 
                  id="amount" 
                  placeholder="0.00" 
                  className="pl-8 bg-black/20 border-white/10 focus:ring-primary/30 h-12 text-lg rounded-xl"
                  {...register("amount")} 
                />
              </div>
              {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-muted-foreground">Category</Label>
              <Select onValueChange={(val) => setValue("category", val)} defaultValue={watch("category")}>
                <SelectTrigger className="bg-black/20 border-white/10 h-12 rounded-xl">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/50">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-muted-foreground">Description</Label>
              <Input 
                id="description" 
                placeholder="Groceries, Rent, etc." 
                className="bg-black/20 border-white/10 h-12 rounded-xl"
                {...register("description")} 
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 rounded-xl font-bold shadow-lg hover-elevate"
            disabled={createTx.isPending}
          >
            {createTx.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Save Transaction"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
