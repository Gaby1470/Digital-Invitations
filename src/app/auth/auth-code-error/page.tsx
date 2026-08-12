import Link from 'next/link';

export default function AuthCodeError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
        <p className="mt-4 text-gray-600">
          There was an error authenticating your account. Please try again.
        </p>
        <Link href="/auth/login">
          <a className="mt-6 inline-block px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Return to Login
          </a>
        </Link>
      </div>
    </div>
  );
}
