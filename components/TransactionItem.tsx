
import React, { useState, useEffect } from 'react';
import { Transaction, Category } from '../types';

interface TransactionItemProps {
  transaction: Transaction;
  isEditing: boolean;
  onEdit: (id: string) => void;
  onSave: (transaction: Transaction) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  categories: Category[];
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  categories,
}) => {
  const [editedTransaction, setEditedTransaction] = useState(transaction);

  useEffect(() => {
    setEditedTransaction(transaction);
  }, [transaction]);

  const categoryColor = categories.find(c => c.name === transaction.category)?.color || '#9ca3af';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedTransaction(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }));
  };

  if (isEditing) {
    return (
      <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <td className="py-3 px-4"><input type="date" name="date" value={editedTransaction.date} onChange={handleChange} className="w-full bg-white dark:bg-gray-600 rounded p-1 border border-gray-300 dark:border-gray-500" /></td>
        <td className="py-3 px-4"><input type="text" name="description" value={editedTransaction.description} onChange={handleChange} className="w-full bg-white dark:bg-gray-600 rounded p-1 border border-gray-300 dark:border-gray-500" /></td>
        <td className="py-3 px-4">
            <select name="category" value={editedTransaction.category} onChange={handleChange} className="w-full bg-white dark:bg-gray-600 rounded p-1 border border-gray-300 dark:border-gray-500">
                {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
        </td>
        <td className="py-3 px-4"><input type="number" name="amount" value={editedTransaction.amount} onChange={handleChange} className="w-24 text-right bg-white dark:bg-gray-600 rounded p-1 border border-gray-300 dark:border-gray-500" /></td>
        <td className="py-3 px-4 text-center">
            <div className="flex gap-2 justify-center">
                <button onClick={() => onSave(editedTransaction)} className="text-green-500 hover:text-green-700">Save</button>
                <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">Cancel</button>
            </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{transaction.date}</td>
      <td className="py-3 px-4 font-medium">{transaction.description}</td>
      <td className="py-3 px-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}>
          {transaction.category}
        </span>
      </td>
      <td className={`py-3 px-4 font-semibold text-right ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
      </td>
      <td className="py-3 px-4 text-center">
        <div className="flex gap-2 justify-center">
            <button onClick={() => onEdit(transaction.id)} className="text-blue-500 hover:text-blue-700">Edit</button>
            <button onClick={() => onDelete(transaction.id)} className="text-red-500 hover:text-red-700">Delete</button>
        </div>
      </td>
    </tr>
  );
};
