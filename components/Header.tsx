
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center">
        <div className="flex items-center gap-3">
            <svg className="w-10 h-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0h.75A.75.75 0 015.25 6v.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0H3.75m0 0h-.75a.75.75 0 01-.75-.75V6m0 0v-.75A.75.75 0 013.75 4.5M9 13.5a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75m0 0h.75m0 0h.75m0 0h.75m0 0h.75m-3 3a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75m.75.75h.75m0 0h.75m0 0h.75m0 0h.75m-3-3h.75m0 0h.75" />
            </svg>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Finan-<span className="text-indigo-600">AI</span>
            </h1>
        </div>
      </div>
    </header>
  );
};
