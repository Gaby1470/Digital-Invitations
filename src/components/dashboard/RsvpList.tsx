// src/components/dashboard/RsvpList.tsx
"use client";

import { Rsvp } from '@/lib/types';
import { ChatBubbleLeftIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

type RsvpListProps = {
  rsvps: Rsvp[];
  isLoading: boolean;
};

const getStatusClasses = (status: Rsvp['status']) => {
  switch (status) {
    case 'ATTENDING':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'DECLINED':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

export default function RsvpList({ rsvps, isLoading }: RsvpListProps) {
  const [expandedMessageId, setExpandedMessageId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (rsvps.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <ChatBubbleLeftIcon className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">No one has responded yet.</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Check back later for updates.</p>
      </div>
    );
  }

  const attendingRsvps = rsvps.filter(r => r.status === 'ATTENDING');
  const attendingCount = attendingRsvps.length;
  const plusOnesCount = attendingRsvps.reduce((sum, r) => sum + r.plus_ones, 0);
  const totalGuests = attendingCount + plusOnesCount;
  const notAttendingCount = rsvps.filter(r => r.status === 'DECLINED').length;

  const handleExport = () => {
    const headers = ['Name', 'Status', 'Additional Guests', 'Message', 'Responded On'];
    const csvRows = [
      headers.join(','),
      ...rsvps.map(rsvp => {
        const row = [
          `"${rsvp.name.replace(/"/g, '""')}"`,
          rsvp.status,
          rsvp.plus_ones,
          `"${(rsvp.message || '').replace(/"/g, '""')}"`,
          new Date(rsvp.created_at).toLocaleString(),
        ];
        return row.join(',');
      }),
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'guests lists RSVP.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center flex-grow">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">{totalGuests}</p>
            <p className="text-sm font-medium text-green-600 dark:text-green-500">Total Guests</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{attendingCount}</p>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-500">Attending</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
            <p className="text-2xl font-bold text-red-700 dark:text-red-400">{notAttendingCount}</p>
            <p className="text-sm font-medium text-red-600 dark:text-red-500">Not Attending</p>
          </div>
        </div>
        <button
          onClick={handleExport}
          className="flex-shrink-0 h-12 inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
        >
          <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
          Export to CSV
        </button>
      </div>


      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Guests
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Message
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Responded On
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {rsvps.map((rsvp) => (
              <tr key={rsvp.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{rsvp.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(rsvp.status)}`}>
                    {rsvp.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                  {rsvp.plus_ones > 0 ? `+${rsvp.plus_ones}`: ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {rsvp.message && (
                     <div className="relative group">
                      <button 
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <ChatBubbleLeftIcon className="h-5 w-5" />
                      </button>
                      <div className="absolute z-10 w-56 p-3 text-sm font-light text-gray-600 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg -top-2 left-full ml-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {rsvp.message}
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(rsvp.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

