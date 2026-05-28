// src/components/dashboard/RsvpList.tsx
"use client";

import { Rsvp } from '@/lib/types';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

type RsvpListProps = {
  rsvps: Rsvp[];
  isLoading: boolean;
};

const getStatusClasses = (status: Rsvp['status']) => {
  switch (status) {
    case 'ATTENDING':
      return 'bg-green-100 text-green-800';
    case 'DECLINED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function RsvpList({ rsvps, isLoading }: RsvpListProps) {
  const [expandedMessageId, setExpandedMessageId] = useState<number | null>(null);

  if (isLoading) {
    return <p className="text-center py-10">Loading RSVPs...</p>;
  }

  if (rsvps.length === 0) {
    return <p className="text-center text-gray-500 py-10">No one has responded yet.</p>;
  }

  const attendingRsvps = rsvps.filter(r => r.status === 'ATTENDING');
  const attendingCount = attendingRsvps.length;
  const plusOnesCount = attendingRsvps.reduce((sum, r) => sum + r.plus_ones, 0);
  const totalGuests = attendingCount + plusOnesCount;
  const notAttendingCount = rsvps.filter(r => r.status === 'DECLINED').length;

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-2xl font-bold text-green-700">{totalGuests}</p>
          <p className="text-sm font-medium text-green-600">Total Guests</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-2xl font-bold text-blue-700">{attendingCount}</p>
          <p className="text-sm font-medium text-blue-600">Attending</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-2xl font-bold text-red-700">{notAttendingCount}</p>
          <p className="text-sm font-medium text-red-600">Not Attending</p>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guests
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Responded On
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rsvps.map((rsvp) => (
              <tr key={rsvp.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rsvp.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(rsvp.status)}`}>
                    {rsvp.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {rsvp.plus_ones > 0 ? `+${rsvp.plus_ones}`: ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {rsvp.message && (
                     <div className="relative">
                      <button 
                        onMouseEnter={() => setExpandedMessageId(rsvp.id)}
                        onMouseLeave={() => setExpandedMessageId(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ChatBubbleLeftIcon className="h-5 w-5" />
                      </button>
                      {expandedMessageId === rsvp.id && (
                        <div className="absolute z-10 w-48 p-2 text-sm font-light text-gray-600 bg-white border border-gray-200 rounded-lg shadow-lg -top-8 -right-48">
                          {rsvp.message}
                        </div>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
