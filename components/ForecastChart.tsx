
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ForecastChartProps {
    forecast: { oneMonth: number; threeMonths: number; sixMonths: number; } | null;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ forecast }) => {
    if (!forecast) {
        return <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">Click "Predict with AI" to see your spending forecast.</div>;
    }

    const data = [
        { name: '1 Month', 'Predicted Expenses': forecast.oneMonth },
        { name: '3 Months', 'Predicted Expenses': forecast.threeMonths },
        { name: '6 Months', 'Predicted Expenses': forecast.sixMonths },
    ];
    
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${Number(value).toLocaleString()}`} />
                    <Tooltip formatter={(value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
                    <Legend />
                    <Bar dataKey="Predicted Expenses" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
