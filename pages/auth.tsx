import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Image from 'next/image';
import { Loader2 } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isCredentialsLoading, setIsCredentialsLoading] = useState(false);
  const router = useRouter();

  // const handleGoogleLogin = async () => {
  //   setIsGoogleLoading(true);
  //   const result = await signIn('google', { redirect: false, callbackUrl: '/dashboard' });
  //   setIsGoogleLoading(false);
  //   if (result?.error) {
  //     toast.error(result.error);
  //   } else if (result?.url) {
  //     router.push(result.url);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCredentialsLoading(true);
    if (isLogin) {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/dashboard',
      });
      if (result?.error) {
        toast.error("Invalid credentials");
      } else if (result?.url) {
        router.push(result.url);
      }
    } else {
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        setIsCredentialsLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
          toast.success('Signup successful! Logging in...');
          const signInResult = await signIn('credentials', {
            email,
            password,
            redirect: true, // Let next-auth handle the redirect
            callbackUrl: '/onboarding', // Redirect to onboarding after successful login
          });

          if (signInResult?.error) {
            toast.error('Failed to log in after signup.');
          } else if (signInResult?.url) {
            router.push(signInResult.url);
          }
        } else {
          const data = await response.json();
          toast.error(data.message || 'Something went wrong');
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        toast.error('Something went wrong');
      }
    }
    setIsCredentialsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white p-4">
      <Head>
        <title>{isLogin ? 'Login' : 'Sign Up'} - Inter-V</title>
      </Head>

      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-800">
        <h2 className="text-3xl font-bold text-center mb-6">
          {isLogin ? 'Welcome Back' : 'Join Inter-V'}
        </h2>

        {/* <button
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading || isCredentialsLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 mb-4 bg-white text-gray-800 rounded-md shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          {isGoogleLoading ? <Loader2 className="animate-spin" /> : <Image src="/google-icon.svg" alt="Google" width={20} height={20} className="w-5 h-5" />}
          {isLogin ? 'Login with Google' : 'Sign Up with Google'}
        </button> */}

        {/* <div className="relative flex items-center justify-center my-6">
          <span className="absolute bg-gray-900 px-3 text-gray-500">Or</span>
          <div className="w-full border-t border-gray-700"></div>
        </div> */}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <button
            type="submit"
            disabled={ isCredentialsLoading}
            className="w-full px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 font-medium disabled:opacity-50 disabled:pointer-events-none"
          >
            {isCredentialsLoading ? <Loader2 className="animate-spin mx-auto" /> : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline focus:outline-none"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}
