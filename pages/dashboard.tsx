import Head from "next/head";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import Layout from '../components/dashboard/Layout';
import Link from 'next/link';
import DashboardAnalytics from '@/components/dashboard/DashboardAnalytics';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface User {
  name?: string;
  practiceProfile?: boolean;
}

interface PracticeResult {
  id: string;
  score: number;
  totalQuestions: number;
  createdAt: string;
  jobTitle?: string;
  mode: string;
}

interface UserData {
  user: User;
}

interface ScoresData {
  user: {
    practiceResults: PracticeResult[];
  };
}

export default function Dashboard() {
  const router = useRouter();
  const { status } = useSession();

  const { data, error } = useSWR<UserData>(
    status === 'authenticated' ? '/api/user' : null,
    fetcher
  );

  const { data: scoresData, error: scoresError } = useSWR<ScoresData>(
    status === 'authenticated' ? '/api/user-scores' : null,
    fetcher
  );

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    } else if (status === 'authenticated' && data && !data.user?.practiceProfile) {
      router.replace('/onboarding');
    }
  }, [status, router, data]);

  if (status === 'loading' || !data) {
    return (
      <div className="flex justify-center bg-white items-center min-h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-blue-400" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  const { user } = data;
  const interviewsCompleted = scoresData?.user?.practiceResults?.length || 0;

  const averageScore =
    interviewsCompleted > 0
      ? scoresData!.user.practiceResults.reduce(
          (acc, result) => acc + result.score,
          0
        ) / interviewsCompleted
      : 0;

  return (
    <Layout title="dashboard">
      <Head>
        <title>Dashboard - Prepkitty</title>
      </Head>
      <div className="font-sans text-gray-900">
        <main className="container mx-auto px-6">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="md:text-2xl text-xl font-extrabold text-start">
                Welcome, {user.name || 'User'}!
              </h1>
              <p className="text-gray-600 text-lg text-start">
                {`Let's get started.`}
              </p>
            </div>
            <Link
              href="/practice"
              className="w-full max-w-[150px] p-3 rounded-full bg-blue-400 hover:bg-blue-500 font-semibold text-white transition-colors duration-200 flex items-center justify-center shadow-lg transform hover:scale-105 active:scale-100 disabled:opacity-50"
            >
              Start Practice
            </Link>
          </div>

          {/* Performance Stats */}
          <DashboardAnalytics
            results={scoresData?.user?.practiceResults || []}
            averageScore={averageScore}
            interviewsCompleted={interviewsCompleted}
          />


          {/* Recent Sessions */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Recent Sessions
            </h2>
            {scoresError ? (
              <p className="text-red-500">Error loading sessions.</p>
            ) : !scoresData ? (
              <Loader2 className="animate-spin text-blue-400" size={24} />
            ) : interviewsCompleted === 0 ? (
              <p className="text-gray-500">
                No recent sessions. Start practicing to see your results!
              </p>
            ) : (
              <div className="space-y-4 mb-3">
                {scoresData.user.practiceResults.slice(0, 5).map((result) => (
                  <div
                    key={result.id}
                    className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">
                        {result.jobTitle || 'General Practice'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(result.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-blue-500">
                        {result.score} / {result.totalQuestions}
                      </p>
                      <p className="text-sm text-gray-600">{result.mode}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
}
