// src/components/dashboard/RsvpList.tsx
"use client";

import { Rsvp } from '@/lib/types';

type RsvpListProps = {
  rsvps: Rsvp[];
  isLoading: boolean;
};

const getStatusClasses = (status: Rsvp['status']) => {
  switch (status) {
    case 'attending':
      return 'bg-green-100 text-green-800';
    case 'not_attending':
      return 'bg-red-100 text-red-800';
    case 'maybe':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function RsvpList({ rsvps, isLoading }: RsvpListProps) {
  if (isLoading) {
    return <p className="text-center py-10">Loading RSVPs...</p>;
  }

  if (rsvps.length === 0) {
    return <p className="text-center text-gray-500 py-10">No one has responded yet.</p>;
  }

  const attendingCount = rsvps.filter(r => r.status === 'attending').length;
  const notAttendingCount = rsvps.filter(r => r.status === 'not_attending').length;
  const maybeCount = rsvps.filter(r => r.status === 'maybe').length;

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-2xl font-bold text-green-700">{attendingCount}</p>
          <p className="text-sm font-medium text-green-600">Attending</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-2xl font-bold text-red-700">{notAttendingCount}</p>
          <p className="text-sm font-medium text-red-600">Not Attending</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-2xl font-bold text-yellow-700">{maybeCount}</p>
          <p className="text-sm font-medium text-yellow-600">Maybe</p>
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
                    {rsvp.status.replace('_', ' ')}
                  </span>
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
