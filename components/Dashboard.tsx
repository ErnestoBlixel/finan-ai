
import React from 'react';
import { Transaction, Category } from '../types';
import { SummaryCard } from './SummaryCard';
import { CategoryChart } from './CategoryChart';
import { ForecastChart } from './ForecastChart';

interface DashboardProps {
  summary: { income: number; expenses: number; balance: number };
  transactions: Transaction[];
  categories: Category[];
  forecast: { oneMonth: number; threeMonths: number; sixMonths: number; } | null;
  onGetForecast: () => void;
  isLoadingForecast: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ summary, transactions, categories, forecast, onGetForecast, isLoadingForecast }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Total Income" amount={summary.income} type="income" />
        <SummaryCard title="Total Expenses" amount={summary.expenses} type="expense" />
        <SummaryCard title="Current Balance" amount={summary.balance} type="balance" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Expense Categories</h3>
          <CategoryChart transactions={transactions} categories={categories} />
        </div>
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Spending Forecast</h3>
              <button
                  onClick={onGetForecast}
                  disabled={isLoadingForecast}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold py-2 px-3 rounded-lg transition-colors disabled:bg-indigo-300"
              >
                  {isLoadingForecast ? 'Predicting...' : 'Predict with AI'}
              </button>
          </div>
          <ForecastChart forecast={forecast} />
        </div>
      </div>
    </div>
  );
};
