"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-800">Algo salió mal</h1>
        <p className="mb-8 text-gray-600">
          No pudimos cargar esta página. Inténtalo de nuevo en unos segundos.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-800"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md border border-gray-300 px-8 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
