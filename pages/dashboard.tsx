import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import Layout from "../components/Layout";

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
      <div className="flex justify-center bg-white items-center min-h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-green-500" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  const { user } = data;

  return (
    <Layout title="dashboard">
      <div className="font-sans text-gray-900">
        <main className="container mx-auto px-6">
          <h1 className="text-4xl font-extrabold mb-4 text-start">Welcome, {user.name || 'User'}!</h1>
          <p className="text-gray-600 text-lg mb-8 text-start">This is your personalized dashboard. Here you can manage your interviews, review feedback, and track your progress.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 2: Recent Feedback */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold mb-3 text-gray-900">Recent Feedback</h2>
              {scoresError ? (
                <p className="text-red-500">Error loading feedback.</p>
              ) : !scoresData ? (
                <Loader2 className="animate-spin text-emerald-600" size={24} />
              ) : scoresData.user.practiceResults.length === 0 ? (
                <p className="text-gray-500 mb-2">No feedback yet.</p>
              ) : (
                <>
                  <p className="text-gray-600 mb-2">Last session: {scoresData.user.practiceResults[0].jobTitle || 'N/A'}</p>
                  <p className="text-gray-600 mb-2">Mode: {scoresData.user.practiceResults[0].mode}</p>
                  <p className="text-gray-600 mb-2">Score: {scoresData.user.practiceResults[0].score} / {scoresData.user.practiceResults[0].totalQuestions}</p>
                  <p className="text-gray-500 mb-4">Date: {new Date(scoresData.user.practiceResults[0].createdAt).toLocaleString()}</p>
                </>
              )}
            </div>

            {/* Card 3: Practice Sessions */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold mb-3 text-gray-900">Practice Sessions</h2>
              {scoresError ? (
                <p className="text-red-500">Error loading sessions.</p>
              ) : !scoresData ? (
                <Loader2 className="animate-spin text-emerald-600" size={24} />
              ) : scoresData.user.practiceResults.length === 0 ? (
                <p className="text-gray-500 mb-2">No sessions yet.</p>
              ) : (
                <>
                  <p className="text-gray-600 mb-2">Completed: {scoresData.user.practiceResults.length}</p>
                  <p className="text-gray-500 mb-4">Last Score: {scoresData.user.practiceResults[0].score} / {scoresData.user.practiceResults[0].totalQuestions}</p>
                  <Link href="/practice" className="text-emerald-600 hover:underline font-semibold">Start New Session →</Link>
                </>
              )}
            </div>
          </div>

          
        </main>
      </div>
    </Layout>
  );
}