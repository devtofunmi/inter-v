import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { signIn, getSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCredentialsLoading, setIsCredentialsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { email: emailFromQuery, verified, error: queryError } = router.query;
    if (verified === 'true' && typeof emailFromQuery === 'string') {
      toast.success('Email verified! You can now log in.');
      setEmail(emailFromQuery);
    }
    if (queryError) {
      toast.error(queryError);
    }
  }, [router.query]);

  useEffect(() => {
    const { message } = router.query;
    if (message) {
      toast.info(message as string);
    }
  }, [router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCredentialsLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast.error('Invalid credentials');
      } else if (result.error === 'EmailNotVerified') {
        toast.error('Your email is not verified. Please check your inbox for the verification link.');
      } else {
        toast.error(result.error);
      }
    } else if (result?.ok) {
      const session = await getSession();
      if (session?.user?.onboardingCompleted === false) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    }

    setIsCredentialsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans bg-white text-gray-900 p-4">
      <Head>
        <title>Login - Prepkitty</title>
      </Head>

      <div className="w-full max-w-[400px]">
        <h2 className="text-3xl font-bold text-center mb-6">
          Welcome Back
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

          <button
            type="submit"
            disabled={isCredentialsLoading}
            className="w-full px-4 py-3 rounded-full bg-blue-400 hover:bg-blue-500 text-white font-medium disabled:opacity-50 disabled:pointer-events-none"
          >
            {isCredentialsLoading ? (
              <Loader2 className="animate-spin mx-auto text-white" />
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="text-center flex justify-center gap-1 text-gray-500 mt-6">
          <p>Don&apos;t have an account?</p>
          <Link href="/signup" className="text-blue-400 hover:underline focus:outline-none">
            Sign Up
          </Link>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
}
