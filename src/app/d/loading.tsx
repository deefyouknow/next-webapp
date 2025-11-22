import React from 'react';

export default function Loading() {
    return (
        <div className="flex w-full h-screen items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 font-medium">กำลังโหลดข้อมูล...</p>
            </div>
        </div>
    );
}
