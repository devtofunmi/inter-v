
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import Sidebar from '../components/practice/Sidebar';
import MainContent from '../components/practice/MainContent';
import PricingModal from '../components/practice/PricingModal';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Practice() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const { status } = useSession();
  const { data, error } = useSWR(status === 'authenticated' ? '/api/user' : null, fetcher);
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth');
    } else if (status === 'authenticated' && data && !data.user?.practiceProfile) {
      router.replace('/auth');
    }
  }, [status, router, data]);

  if (status === 'loading' || !data || !data.user) {
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
    <>
      <ToastContainer />
      <div className="font-sans bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6 h-screen flex flex-col lg:flex-row gap-6 relative">
        <div className={`lg:flex ${showSidebar ? 'flex' : 'hidden'} w-full lg:w-auto`}>
          <Sidebar setShowSidebar={setShowSidebar} user={user} onShowPricingModal={() => setShowPricingModal(true)} />
        </div>
        <div className={`lg:flex ${showSidebar ? 'hidden' : 'flex'} flex-1`}>
          <MainContent setShowSidebar={setShowSidebar} user={user} />
        </div>
        {showPricingModal && <PricingModal setShowPricingModal={setShowPricingModal} />}
      </div>
    </>
  );
}
