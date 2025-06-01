"use client";

import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Calendar,
  PieChart as PieChartIcon
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const COLORS = [
  "#10b981", // emerald-500
  "#f59e0b", // amber-500  
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#06b6d4", // cyan-500
  "#84cc16", // lime-500
  "#f97316", // orange-500
  "#ec4899", // pink-500
  "#6366f1", // indigo-500
];

export function DashboardOverview({ accounts, transactions }) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );

  // Filter transactions for selected account
  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId
  );

  // Get recent transactions (last 5)
  const recentTransactions = accountTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Calculate expense breakdown for current month
  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      t.type === "EXPENSE" &&
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });

  // Group expenses by category
  const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {});

  // Format data for pie chart
  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  // Calculate monthly stats
  const monthlyStats = useMemo(() => {
    const currentMonthTransactions = accountTransactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === currentDate.getMonth() &&
        transactionDate.getFullYear() === currentDate.getFullYear()
      );
    });

    const income = currentMonthTransactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = currentMonthTransactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expenses,
      net: income - expenses,
      transactionCount: currentMonthTransactions.length,
    };
  }, [accountTransactions, currentDate]);

  return (
    <div className="space-y-6">
      {/* Monthly Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  Monthly Income
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ₹{monthlyStats.income.toLocaleString('en-IN', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border-red-200 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-300">
                  Monthly Expenses
                </p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  ₹{monthlyStats.expenses.toLocaleString('en-IN', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </p>
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(
          "bg-gradient-to-br border-2",
          monthlyStats.net >= 0 
            ? "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800"
            : "from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800"
        )}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={cn(
                  "text-sm font-medium",
                  monthlyStats.net >= 0 
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-orange-700 dark:text-orange-300"
                )}>
                  Net Balance
                </p>
                <p className={cn(
                  "text-2xl font-bold",
                  monthlyStats.net >= 0 
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-orange-600 dark:text-orange-400"
                )}>
                  {monthlyStats.net >= 0 ? "+" : ""}₹{Math.abs(monthlyStats.net).toLocaleString('en-IN', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </p>
              </div>
              <div className={cn(
                "p-2 rounded-full",
                monthlyStats.net >= 0 
                  ? "bg-blue-100 dark:bg-blue-900/30"
                  : "bg-orange-100 dark:bg-orange-900/30"
              )}>
                <DollarSign className={cn(
                  "h-5 w-5",
                  monthlyStats.net >= 0 
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-orange-600 dark:text-orange-400"
                )} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Transactions
                </p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {monthlyStats.transactionCount}
                </p>
                <p className="text-xs text-purple-600/70 dark:text-purple-400/70">
                  This month
                </p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Transactions Card */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                Recent Transactions
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Your latest financial activities
              </CardDescription>
            </div>
            <Select
              value={selectedAccountId}
              onValueChange={setSelectedAccountId}
            >
              <SelectTrigger className="w-[160px] bg-background">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <DollarSign className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">No recent transactions</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Start adding transactions to see them here
                </p>
              </div>
            ) : (
              recentTransactions.map((transaction, index) => (
                <div key={transaction.id}>                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-full",
                        transaction.type === "EXPENSE" 
                          ? "bg-red-100 dark:bg-red-900/30" 
                          : "bg-green-100 dark:bg-green-900/30"
                      )}>
                        {transaction.type === "EXPENSE" ? (
                          <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {transaction.description || "Untitled Transaction"}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(transaction.date), "MMM dd, yyyy")}
                          </p>
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                            {transaction.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "font-semibold text-sm",
                        transaction.type === "EXPENSE"
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      )}>
                        {transaction.type === "EXPENSE" ? "-" : "+"}₹{transaction.amount.toLocaleString('en-IN', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Expense Breakdown Card */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-muted-foreground" />
              Monthly Expense Breakdown
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Category-wise spending analysis for {format(currentDate, "MMMM yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 pb-6">
            {pieChartData.length === 0 ? (
              <div className="text-center py-8 px-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <PieChartIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">No expenses this month</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Your spending breakdown will appear here
                </p>
              </div>
            ) : (
              <>
                <div className="h-[280px] px-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        innerRadius={40}
                        fill="#8884d8"
                        dataKey="value"
                        stroke="none"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          `₹${value.toLocaleString('en-IN', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}`,
                          "Amount"
                        ]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                          fontSize: "14px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                  {/* Category Legend */}
                <div className="px-6 space-y-3 border-t border-border/50 pt-4">
                  <h4 className="text-sm font-medium text-foreground">Top Categories</h4>
                  <div className="grid gap-3">
                    {pieChartData
                      .sort((a, b) => b.value - a.value)
                      .slice(0, 5)
                      .map((entry, index) => {
                        const percentage = ((entry.value / monthlyStats.expenses) * 100).toFixed(1);
                        return (
                          <div key={entry.name} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-3 h-3 rounded-sm shadow-sm" 
                                style={{ backgroundColor: COLORS[pieChartData.findIndex(item => item.name === entry.name) % COLORS.length] }}
                              />
                              <span className="font-medium capitalize">{entry.name}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">
                                ₹{entry.value.toLocaleString('en-IN', { 
                                  minimumFractionDigits: 2, 
                                  maximumFractionDigits: 2 
                                })}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {percentage}%
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}