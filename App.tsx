
import React, { useState, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { TransactionList } from './components/TransactionList';
import { FileUpload } from './components/FileUpload';
import { AddTransactionModal } from './components/AddTransactionModal';
import { Transaction } from './types';
import { processAndCategorizeFile } from './services/geminiService';
import { DEFAULT_CATEGORIES, MOCK_TRANSACTIONS } from './constants';
import { predictExpenses } from './services/geminiService';

type View = 'dashboard' | 'transactions';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [view, setView] = useState<View>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forecast, setForecast] = useState<{ oneMonth: number; threeMonths: number; sixMonths: number; } | null>(null);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: new Date().toISOString() + Math.random(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev =>
      prev.map(t => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };
  
  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const fileContent = await file.text();
      const newTransactions = await processAndCategorizeFile(fileContent, categories.map(c => c.name));
      
      const newCats = new Set(categories.map(c => c.name));
      newTransactions.forEach(t => {
        if (!newCats.has(t.category)) {
          newCats.add(t.category);
          const newColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
          setCategories(prev => [...prev, {name: t.category, color: newColor}]);
        }
      });
      
      setTransactions(prev => [...newTransactions, ...prev]);
    } catch (err) {
      setError('Failed to process file. Please ensure it is a valid CSV and your API key is configured.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetForecast = useCallback(async () => {
    if (transactions.length === 0) {
      setError("Not enough data to make a prediction.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const prediction = await predictExpenses(transactions);
      setForecast(prediction);
    } catch (err) {
      setError('Failed to get forecast. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [transactions]);


  const summary = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;
    return { income, expenses, balance };
  }, [transactions]);

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <FileUpload onFileUpload={handleFileUpload} disabled={isLoading} />
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Manually
          </button>
          <div className="flex-grow"></div>
          <div className="flex gap-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
             <button onClick={() => setView('dashboard')} className={`px-4 py-1 rounded-md text-sm font-medium ${view === 'dashboard' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-300'}`}>Dashboard</button>
             <button onClick={() => setView('transactions')} className={`px-4 py-1 rounded-md text-sm font-medium ${view === 'transactions' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-300'}`}>Transactions</button>
          </div>
        </div>
        
        {isLoading && (
            <div className="flex justify-center items-center my-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="ml-4 text-lg">AI is processing...</p>
            </div>
        )}

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative my-4" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline ml-2">{error}</span>
            </div>
        )}

        {view === 'dashboard' ? (
          <Dashboard 
            summary={summary} 
            transactions={transactions} 
            categories={categories}
            forecast={forecast}
            onGetForecast={handleGetForecast}
            isLoadingForecast={isLoading && !forecast}
          />
        ) : (
          <TransactionList
            transactions={transactions}
            onUpdateTransaction={updateTransaction}
            onDeleteTransaction={deleteTransaction}
            categories={categories}
          />
        )}
      </main>
      {isModalOpen && (
        <AddTransactionModal
          onClose={() => setIsModalOpen(false)}
          onAddTransaction={addTransaction}
          categories={categories.map(c => c.name)}
        />
      )}
    </div>
  );
}
