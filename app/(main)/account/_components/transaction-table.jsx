"use client";

import React, { useEffect } from 'react'
import useFetch from "@/hooks/use-fetch"
import { toast } from "sonner";
import { bulkDeleteTransactions } from "@/actions/accounts";

import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns';
import { categoryColors } from '@/data/categories';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Clock, MoreHorizontal, RefreshCw, Search, Trash, X, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BarLoader } from 'react-spinners';

const ITEMS_PER_PAGE = 10;

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};


const TransactionTable = ({transactions}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState([]);  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");  // Memoized filtered and sorted transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
        // Check if search term might be a date
      const dateRegex = /^(0?[1-9]|1[0-2])\/?([0-9]{1,2})?\/?([0-9]{4})?$/; // MM/DD/YYYY format
      const monthRegex = /^(january|february|march|april|may|june|july|august|september|october|november|december)$/i;
      
      // Check if the search term might be part of a month name
      const partialMonthMatch = searchLower.length >= 3 && ['january', 'february', 'march', 'april', 'may', 'june', 
                         'july', 'august', 'september', 'october', 'november', 'december'].some(month => 
                           month.includes(searchLower));
      
      if (dateRegex.test(searchLower) || monthRegex.test(searchLower) || partialMonthMatch) {
        // It could be a date or month
        let matchedTransactions = [];
        
        // Try to match full date (MM/DD/YYYY)
        if (dateRegex.test(searchLower)) {
          const parts = searchLower.split('/');
          const month = parseInt(parts[0], 10) - 1; // 0-indexed months
          const day = parts[1] ? parseInt(parts[1], 10) : null;
          const year = parts[2] ? parseInt(parts[2], 10) : new Date().getFullYear();
          
          // Filter by month, day (if provided), and year
          matchedTransactions = result.filter(transaction => {
            const txDate = new Date(transaction.date);
            
            // Check month match
            if (txDate.getMonth() !== month) return false;
            
            // Check day match if provided
            if (day !== null && txDate.getDate() !== day) return false;
            
            // Check year if provided
            if (parts[2] && txDate.getFullYear() !== year) return false;
            
            return true;
          });
        }
          // Try to match month name (exact or partial)
        if ((monthRegex.test(searchLower) || partialMonthMatch) && matchedTransactions.length === 0) {
          const months = ['january', 'february', 'march', 'april', 'may', 'june', 
                         'july', 'august', 'september', 'october', 'november', 'december'];
          
          // First try exact match
          if (monthRegex.test(searchLower)) {
            const monthIndex = months.indexOf(searchLower);
            
            if (monthIndex !== -1) {
              matchedTransactions = result.filter(transaction => {
                const txDate = new Date(transaction.date);
                return txDate.getMonth() === monthIndex;
              });
            }
          } 
          // Then try partial match
          else if (partialMonthMatch) {
            // Find all months that include the search term
            const matchingMonths = months.filter(month => month.includes(searchLower));
            const matchingIndexes = matchingMonths.map(month => months.indexOf(month));
            
            matchedTransactions = result.filter(transaction => {
              const txDate = new Date(transaction.date);
              return matchingIndexes.includes(txDate.getMonth());
            });
          }
        }// If we found date matches, use them; otherwise fall back to description search
        if (matchedTransactions.length > 0) {
          result = matchedTransactions;
        } else {
          // Standard description search
          result = result.filter((transaction) =>
            transaction.description?.toLowerCase().includes(searchLower)
          );
        }
      } else {
        // Standard description search
        result = result.filter((transaction) =>
          transaction.description?.toLowerCase().includes(searchLower)
        );
      }
    }

    // Apply type filter
    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }    // Apply recurring filter
    if (recurringFilter) {
      result = result.filter((transaction) => {
        if (recurringFilter === "recurring") return transaction.isRecurring;
        return !transaction.isRecurring;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);
  
  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedTransactions, currentPage]);
  
  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };  

  const handleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };
  const handleSelectAll = () => {
    setSelectedIds((current) =>
      current.length === paginatedTransactions.length
        ? []
        : paginatedTransactions.map((t) => t.id)
    );
  };
   const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDeleteTransactions);

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} transactions?`
      )
    )
      return;

    deleteFn(selectedIds);
  };

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.error("Transactions deleted successfully");
    }
  }, [deleted, deleteLoading]);
    const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedIds([]); // Clear selections on page change
  };

  return (
    <div className='space-y-4'>
      { deleteLoading && (
        <BarLoader className='mt-4'  width= {"100%"} color='#9333ea'/>
        )}
      {/*Filter*/}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className = "relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />          <Input 
          className="pl-8" 
          placeholder="Search by description, date (MM/DD/YYYY) or month name (e.g. 'april')..." 
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page when search changes
          }}
          />
        </div>

        <div className='flex  gap-2'>
          <Select value = {typeFilter} onValueChange={(value) => {
            setTypeFilter(value);
            setCurrentPage(1); // Reset to first page when filter changes
          }}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select 
          value = {recurringFilter} 
          onValueChange={(value) => {
            setRecurringFilter(value);
            setCurrentPage(1); // Reset to first page when filter changes
          }}
          >
            <SelectTrigger className="w-[190px]">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">Recurring only</SelectItem>
              <SelectItem value="non-recurring">Non-recurring only</SelectItem>
            </SelectContent>
          </Select>
          {selectedIds.length > 0 && <div> 
            <Button variant = "destructive" size="sm" className='flex items-center gap-2' 
            onClick={handleBulkDelete}>
              <Trash className='h-4 w-4 mr-2' />
              Delete Selected ({selectedIds.length})
            </Button>
          </div>}
            
            {(searchTerm || typeFilter || recurringFilter || selectedIds.length > 0) && (
              <Button variant="outline"
              size="icon"
              onClick={() => {
                handleClearFilters();
                setSelectedIds([]);  // Also clear selections
              }}
              title="Clear Filters & Selections"
              >
                <X className='h-4 w-4' />
              </Button>
            )}
        </div>
      </div>
      {/*Transactions*/}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[50px]'>
                <Checkbox 
                  onCheckedChange={handleSelectAll}
                  checked={selectedIds.length === 
                    filteredAndSortedTransactions.length && 
                    filteredAndSortedTransactions.length > 0
                  }
                />
              </TableHead>
              <TableHead 
                className='cursor-pointer' 
                onClick={() => handleSort("date")}
              >
                <div className="flex item-center">
                  Date {" "}
                  {sortConfig.field === "date" && 
                    (sortConfig.direction === "asc" ? (
                    <ChevronUp className='ml-1 h-4 w-4' />
                  ) : (
                    <ChevronDown className='ml-1 h-4 w-4 ' />
                  ))}
                </div>
              </TableHead>
              <TableHead> Description</TableHead>
              <TableHead 
                className='cursor-pointer' 
                onClick={() => handleSort("category")}
              >
                <div className="flex item-center">
                  Category
                  {sortConfig.field === "category" && 
                    (sortConfig.direction === "asc" ? (
                    <ChevronUp className='ml-1 h-4 w-4' />
                  ) : (
                    <ChevronDown className='ml-1 h-4 w-4 ' />
                  ))}
                </div>
              </TableHead>
              <TableHead 
                className='cursor-pointer' 
                onClick={() => handleSort("amount")}
              >
                <div className="flex item-center justify-end">
                  Amount
                  {sortConfig.field === "amount" && 
                    (sortConfig.direction === "asc" ? (
                    <ChevronUp className='ml-1 h-4 w-4' />
                  ) : (
                    <ChevronDown className='ml-1 h-4 w-4 ' />
                  ))}
                </div>
              </TableHead>
              <TableHead> Recurring</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow> 
          </TableHeader> 
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No transactions found
                </TableCell>
              </TableRow>
            ): (
              paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Checkbox 
                    onCheckedChange={() => handleSelect(transaction.id)}
                    checked={selectedIds.includes(transaction.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(transaction.date), "PP")}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="capitalize">
                    <span className = "px-2 py-1 rounded text-xs text-white" 
                      style = {{
                      background: categoryColors[transaction.category],
                    }}>
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium"
                  style = {{
                    color: transaction.type === "EXPENSE" ? "red" : "green",
                  }}>
                    {transaction.type === "EXPENSE" ? "-" : "+"}
                    ₹{transaction.amount.toFixed(2)}</TableCell>

                  <TableCell>
                    {transaction.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200">
                              <RefreshCw className='h-3 w-3'/> {
                                RECURRING_INTERVALS[transaction.recurringInterval]
                              }
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div className="font-medium">Next Date:</div>
                              <div>
                                {format(
                                  new Date(transaction.nextRecurringDate),
                                  "PPP"
                                )}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Clock className='h-3 w-3'/> One-Time</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant = "ghost" className='h-8 w-8 p-0'> 
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => 
                            router.push(
                              `/transaction/create?edit=${transaction.id}`
                            )
                          }
                        >
                          <Button variant = "ghost">Edit</Button>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" 
                         onClick = {() => deleteFn([transaction.id])}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium">
            {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredAndSortedTransactions.length)}{" "}
          </span>
          to{" "}
          <span className="font-medium">
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedTransactions.length)}{" "}
          </span>
          of{" "}
          <span className="font-medium">{filteredAndSortedTransactions.length} transactions</span>
        </div>
        
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            title="First Page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            title="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            title="Next Page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            title="Last Page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default TransactionTable