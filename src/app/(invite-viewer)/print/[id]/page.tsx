'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import TemplateRenderer from '@/components/TemplateRenderer';
import { templateConfig } from '@/lib/templateConfig';
import { Loader, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { useEffect, useCallback } from 'react';

// --- Data Fetching ---

class HttpError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

async function getInvitation(id: string) {
  const res = await fetch(`/api/invitations/${id}`);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new HttpError(errorBody.error || `Error: ${res.status}`, res.status);
  }
  return res.json();
}


export default function PrintInvitationPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: invitation, isLoading, error } = useQuery({
    queryKey: ['invitation', id],
    queryFn: () => getInvitation(id),
    enabled: !!id,
  });

  const handlePrint = useCallback(() => {
    const invitationElement = document.getElementById(`invitation-container`);
    if (invitationElement) {
      html2canvas(invitationElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`invitation-${id}.pdf`);
        window.close();
      });
    }
  }, [id]);

  useEffect(() => {
    if (invitation) {
      const timer = setTimeout(() => {
        handlePrint();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [invitation, handlePrint]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <Loader className="h-12 w-12 text-indigo-500 animate-spin" />
          <p className="mt-4 text-lg text-gray-600 font-medium">Loading Invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const status = (error as HttpError).status;
    let title = "Invitation Not Found";
    let message = "The invitation link is either invalid or has been removed.";
    if (status === 403) {
      title = "Invitation Not Published";
      message = "This invitation is not yet available to the public.";
    }
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8"/>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
          <p className="text-gray-600 mb-8">{message}</p>
          <Link href="/" className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-800">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }
  
  const template = invitation ? templateConfig[invitation.template] : null;

  if (!template) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Error</h1>
        <p className="text-gray-600">Could not load the invitation template.</p>
      </div>
    );
  }

  return (
    <div id="invitation-container">
        <TemplateRenderer 
            templateId={invitation.template} 
            template={template} 
            data={invitation.data} 
            invitationId={invitation.id}
        />
    </div>
  );
}
