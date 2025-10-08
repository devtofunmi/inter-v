import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import Sidebar from '../components/practice/Sidebar';
import Layout from '../components/Layout';
import PricingModal from '../components/practice/PricingModal';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Settings = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const { status } = useSession();
  const { data, error } = useSWR(status === 'authenticated' ? '/api/user' : null, fetcher);
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth');
    }
  }, [status, router]);

  if (status === 'loading' || (status === 'authenticated' && !data)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  const { user } = data || {};

  return (
    <Layout title="Settings">
      <div className="font-sans bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6 min-h-screen flex flex-col lg:flex-row gap-6 relative">
        <div className={`lg:flex ${showSidebar ? 'flex' : 'hidden'} w-full lg:w-auto`}>
          {user && <Sidebar setShowSidebar={setShowSidebar} user={user} onShowPricingModal={() => setShowPricingModal(true)} />}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-4">Settings</h1>
          {/* Add settings content here */}
        </div>
        {showPricingModal && <PricingModal setShowPricingModal={setShowPricingModal} />}
      </div>
    </Layout>
  );
};

export default Settings;
