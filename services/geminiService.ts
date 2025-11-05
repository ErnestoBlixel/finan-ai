
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from '../types';

if (!process.env.API_KEY) {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// A simple CSV parser
const parseCSV = (content: string): { description: string; amount: number; date: string }[] => {
  const lines = content.trim().split('\n');
  return lines.slice(1).map(line => { // Assuming header row
    const [date, description, amountStr] = line.split(',');
    const amount = parseFloat(amountStr);
    return { date, description, amount };
  }).filter(item => item.description && !isNaN(item.amount));
};

export const processAndCategorizeFile = async (fileContent: string, categories: string[]): Promise<Transaction[]> => {
  const parsedData = parseCSV(fileContent);
  if (parsedData.length === 0) {
    return [];
  }

  const descriptions = parsedData.map(d => d.description);
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Based on the following list of transaction descriptions and available categories, assign the most appropriate category to each. 'Income' should be used for positive amounts. Available categories: ${categories.join(', ')}. Descriptions: ${JSON.stringify(descriptions)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ['description', 'category']
        }
      }
    }
  });

  const categorizedResults = JSON.parse(response.text);
  
  const categoryMap = new Map<string, string>();
  categorizedResults.forEach((item: { description: string, category: string }) => {
    categoryMap.set(item.description, item.category);
  });
  
  return parsedData.map((data, index) => ({
    id: new Date().toISOString() + index,
    date: data.date,
    description: data.description,
    amount: Math.abs(data.amount),
    category: categoryMap.get(data.description) || 'Uncategorized',
    type: data.amount > 0 ? 'income' : 'expense',
  }));
};

export const predictExpenses = async (transactions: Transaction[]): Promise<{ oneMonth: number; threeMonths: number; sixMonths: number; }> => {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  if (expenseTransactions.length < 5) {
      throw new Error("Not enough expense data for a reliable prediction.");
  }
  
  const prompt = `
    Analyze the following list of personal expense transactions. Identify recurring monthly expenses and calculate an average for variable spending.
    Based on this analysis, provide a JSON object with your prediction for total expenses for the next 1 month, 3 months, and 6 months.
    The JSON object should have keys: "oneMonth", "threeMonths", and "sixMonths".

    Transactions:
    ${JSON.stringify(expenseTransactions.map(t => ({ date: t.date, description: t.description, amount: t.amount })))}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          oneMonth: { type: Type.NUMBER, description: "Predicted total expenses for the next 1 month." },
          threeMonths: { type: Type.NUMBER, description: "Predicted total expenses for the next 3 months." },
          sixMonths: { type: Type.NUMBER, description: "Predicted total expenses for the next 6 months." }
        },
        required: ['oneMonth', 'threeMonths', 'sixMonths']
      }
    }
  });
  
  return JSON.parse(response.text);
};
