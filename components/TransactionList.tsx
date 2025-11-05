
import React, { useState } from 'react';
import { Transaction, Category } from '../types';
import { TransactionItem } from './TransactionItem';

interface TransactionListProps {
  transactions: Transaction[];
  onUpdateTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  categories: Category[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onUpdateTransaction, onDeleteTransaction, categories }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    
    const handleEdit = (id: string) => {
        setEditingId(id);
    };

    const handleSave = (transaction: Transaction) => {
        onUpdateTransaction(transaction);
        setEditingId(null);
    };

    const handleCancel = () => {
        setEditingId(null);
    }
    
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">All Transactions</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="border-b-2 border-gray-200 dark:border-gray-700">
                <tr className="text-sm text-gray-500 dark:text-gray-400">
                    <th className="py-3 px-4 font-semibold">Date</th>
                    <th className="py-3 px-4 font-semibold">Description</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold text-right">Amount</th>
                    <th className="py-3 px-4 font-semibold text-center">Actions</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map(transaction => (
                    <TransactionItem 
                        key={transaction.id}
                        transaction={transaction}
                        isEditing={editingId === transaction.id}
                        onEdit={handleEdit}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        onDelete={onDeleteTransaction}
                        categories={categories}
                    />
                ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};
