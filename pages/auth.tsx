import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader2 } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCredentialsLoading, setIsCredentialsLoading] = useState(false);
  const router = useRouter();

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
            redirect: true,
            callbackUrl: '/onboarding',
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
      } catch (e) {
        toast.error('Something went wrong');
      }
    }
    setIsCredentialsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans bg-white text-gray-900 p-4">
      <Head>
        <title>{isLogin ? 'Login' : 'Sign Up'} - Prepkitty</title>
      </Head>

      <div className="w-full max-w-[400px] ">
        <h2 className="text-3xl font-bold text-center mb-6">
          {isLogin ? 'Welcome Back' : 'Join Prepkitty'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <div>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
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
            className="w-full px-4 py-2 rounded-full bg-blue-400 hover:bg-blue-500 text-white font-medium disabled:opacity-50 disabled:pointer-events-none"
          >
            {isCredentialsLoading ? <Loader2 className="animate-spin mx-auto text-blue-400" /> : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 hover:underline focus:outline-none"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}
