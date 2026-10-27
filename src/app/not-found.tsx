import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-600">
          <SearchX className="h-8 w-8" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-800">Página no encontrada</h1>
        <p className="mb-8 text-gray-600">
          El enlace es incorrecto o la invitación ya no existe. Revisa que esté completo.
        </p>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-800"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
