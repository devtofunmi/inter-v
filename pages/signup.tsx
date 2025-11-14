import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import zxcvbn from 'zxcvbn';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCredentialsLoading, setIsCredentialsLoading] = useState(false);
  const router = useRouter();

  const passwordStrength = password ? zxcvbn(password).score : 0;

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsCredentialsLoading(true);

  if (password !== confirmPassword) {
    toast.error('Passwords do not match');
    setIsCredentialsLoading(false);
    return;
  }

  if (passwordStrength < 3) {
    toast.error('Password is too weak. Please use a stronger one.');
    setIsCredentialsLoading(false);
    return;
  }

  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);

      // Log the full server response for debugging
      console.error('Signup failed:', {
        status: response.status,
        statusText: response.statusText,
        responseBody: data,
      });

      toast.error(data?.message || 'Something went wrong during signup.');
      return;
    }

    // Success
    router.push('/check-email');
  } catch (error: unknown) {
    // Log exact client-side error
    console.error('Signup request error:', error);
    toast.error('An unexpected error occurred. Check console for details.');
  } finally {
    setIsCredentialsLoading(false);
  }
};


  const getStrengthColor = (score: number) => {
    switch (score) {
      case 0:
        return 'bg-gray-300';
      case 1:
        return 'bg-red-400';
      case 2:
        return 'bg-orange-400';
      case 3:
        return 'bg-yellow-400';
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStrengthText = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Strong';
      case 4:
        return 'Very Strong';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans bg-white text-gray-900 p-4">
      <Head>
        <title>Sign Up - Prepkitty</title>
      </Head>

      <div className="w-full max-w-[400px]">
        <h2 className="text-3xl font-bold text-center mb-6">
          Join Prepkitty
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-3 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="w-full px-3 py-3 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center pr-10"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <>
            {/* Password strength meter */}
            <div className="flex flex-col items-center justify-between">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-2 ${getStrengthColor(passwordStrength)} transition-all duration-300`}
                  style={{ width: `${(passwordStrength + 1) * 20}%` }}
                />
              </div>
              <span className="text-xs mt-2 font-medium text-gray-600">
                {getStrengthText(passwordStrength)}
              </span>
            </div>

            {/* Helper text */}
            <p className="text-xs text-gray-500 text-center">
              Use 8+ characters with letters, numbers, and symbols.
            </p>

            <div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                className="w-full px-3 py-3 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </>

          <button
            type="submit"
            disabled={isCredentialsLoading || passwordStrength < 3}
            className="w-full px-4 py-3 rounded-full bg-blue-400 hover:bg-blue-500 text-white font-medium disabled:opacity-50 disabled:pointer-events-none"
          >
            {isCredentialsLoading ? (
              <Loader2 className="animate-spin mx-auto text-white" />
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 hover:underline focus:outline-none">
            Login
          </Link>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
}