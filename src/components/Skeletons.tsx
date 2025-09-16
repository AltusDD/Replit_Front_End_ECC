import React from 'react';

export function KPIBlockSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="animate-pulse">
        <div className="h-3 bg-gray-200 rounded w-12 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="animate-pulse">
        <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-12"></div>
      </div>
      <div className="animate-pulse">
        <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-14"></div>
      </div>
      <div className="animate-pulse">
        <div className="h-3 bg-gray-200 rounded w-14 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="col-span-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  );
}