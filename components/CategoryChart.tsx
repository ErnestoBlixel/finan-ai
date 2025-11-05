import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction, Category } from '../types';

interface CategoryChartProps {
  transactions: Transaction[];
  categories: Category[];
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ transactions, categories }) => {
  const data = useMemo(() => {
    const expenseByCategory = transactions
      .filter(t => t.type === 'expense')
      // FIX: Explicitly type the accumulator for the reduce function to ensure correct type inference for the result.
      .reduce<Record<string, number>>((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    return Object.entries(expenseByCategory).map(([name, value]) => ({
      name,
      value,
      color: categories.find(c => c.name === name)?.color || '#9ca3af',
    })).sort((a,b) => b.value - a.value);
  }, [transactions, categories]);

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">No expense data to display.</div>;
  }
  
  return (
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
            <PieChart>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
            >
                {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Pie>
            <Tooltip formatter={(value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
            <Legend />
            </PieChart>
        </ResponsiveContainer>
    </div>
  );
};
