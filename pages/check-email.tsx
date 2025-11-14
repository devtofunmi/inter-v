import React from 'react';
import Link from 'next/link';

const CheckEmailPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full text-center p-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Thanks for signing up!</h1>
        <p className="text-gray-600 mb-6">
          We&apos;ve sent a verification link to your email address. Please check your inbox (and spam folder) to complete your registration.
        </p>

        <p className="text-gray-500 text-sm">
          Once your email is verified, you can log in to your account.
        </p>
        <div className="mt-8">
          <button
            type="submit"
            className="w-full md:w-[200px] px-4 py-3 rounded-full bg-blue-400 hover:bg-blue-500 text-white font-medium disabled:opacity-50 disabled:pointer-events-none"
          >
             <Link href="/login" >
            Back to Login
          </Link>
          </button>
         
        </div>
      </div>
    </div>
  );
};

export default CheckEmailPage;
