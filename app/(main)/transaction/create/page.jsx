import React from 'react'
import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import AddTransactionForm from "../_components/transaction-form";
import { getTransaction } from "@/actions/transactions";

const AddTransactionPage = async ({ searchParams }) => {
  const accounts = await getUserAccounts();
  
  // Fix: Await searchParams before accessing its properties
  const resolvedSearchParams = await searchParams;
  const editId = resolvedSearchParams?.edit || null;

  let initialData = null;
  if(editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className='max-w-3xl mx-auto px-5'>
      <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-indigo-600">
        {editId ? "Edit" : "Add"} Transaction
      </h1>

      <AddTransactionForm 
        accounts={accounts}
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData}
      />
    </div>
  );
};

export default AddTransactionPage;