import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useSession, signOut } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const router = useRouter();
  const { status } = useSession();
  const { data, error } = useSWR(status === 'authenticated' ? '/api/user' : null, fetcher);
  const { data: scoresData, error: scoresError } = useSWR(status === 'authenticated' ? '/api/user-scores' : null, fetcher);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth');
    } else if (status === 'authenticated' && data && !data.user?.practiceProfile) {
      router.replace('/onboarding');
    }
  }, [status, router, data]);

  if (status === 'loading' || !data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  const { user } = data;

  return (
    <div className="min-h-screen font-geist bg-white text-gray-900">
      <Head>
        <title>Dashboard - Inter-V</title>
      </Head>

      {/* Navbar for Dashboard */}
      <header className="flex fixed top-0 w-full backdrop-blur-md bg-white/90 border-b border-gray-200 shadow-md justify-between items-center px-8 py-4 z-50">
        <div className="text-2xl font-extrabold text-emerald-600">🚀 Inter-V</div>
        <nav className="flex gap-8">
          <button onClick={() => signOut()} className="px-5 py-2 cursor-pointer rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg transition-colors text-base">
            Logout
          </button>
        </nav>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-6 py-24">
        <h1 className="text-4xl font-extrabold mb-4 text-center">Welcome, {user.name || 'User'}!</h1>
        <p className="text-gray-600 text-lg mb-8 text-center">This is your personalized dashboard. Here you can manage your interviews, review feedback, and track your progress.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 2: Recent Feedback */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-3 text-gray-900">Recent Feedback</h2>
            {scoresError ? (
              <p className="text-red-500">Error loading feedback.</p>
            ) : !scoresData ? (
              <Loader2 className="animate-spin text-emerald-600" size={24} />
            ) : scoresData.user.practiceResults.length === 0 ? (
              <p className="text-gray-400 mb-2">No feedback yet.</p>
            ) : (
              <>
                <p className="text-gray-500 mb-2">Last session: {scoresData.user.practiceResults[0].jobTitle || 'N/A'}</p>
                <p className="text-gray-500 mb-2">Mode: {scoresData.user.practiceResults[0].mode}</p>
                <p className="text-gray-500 mb-2">Score: {scoresData.user.practiceResults[0].score} / {scoresData.user.practiceResults[0].totalQuestions}</p>
                <p className="text-gray-400 mb-4">Date: {new Date(scoresData.user.practiceResults[0].createdAt).toLocaleString()}</p>
              </>
            )}
          </div>

          {/* Card 3: Practice Sessions */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-3 text-gray-900">Practice Sessions</h2>
            {scoresError ? (
              <p className="text-red-500">Error loading sessions.</p>
            ) : !scoresData ? (
              <Loader2 className="animate-spin text-emerald-600" size={24} />
            ) : scoresData.user.practiceResults.length === 0 ? (
              <p className="text-gray-400 mb-2">No sessions yet.</p>
            ) : (
              <>
                <p className="text-gray-500 mb-2">Completed: {scoresData.user.practiceResults.length}</p>
                <p className="text-gray-500 mb-4">Last Score: {scoresData.user.practiceResults[0].score} / {scoresData.user.practiceResults[0].totalQuestions}</p>
                <Link href="/practice" className="text-emerald-600 hover:underline font-semibold">Start New Session →</Link>
              </>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-3xl font-extrabold mb-4 text-gray-900">Ready for your next challenge?</h2>
          <p className="text-lg text-gray-600 mb-6">Continue practicing to master your interview skills.</p>
          <Link href="/practice" className="px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-lg font-bold text-white shadow-lg transition-colors">
            Start Practice Now →
          </Link>
        </div>
      </main>
    </div>
  );
}
