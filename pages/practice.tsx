
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

import MainContent from '../components/practice/MainContent';
import PricingModal from '../components/practice/PricingModal';
import Layout from "../components/Layout";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Practice() {
  // sidebar state handled by Layout; not needed here
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
      <div className="flex justify-center items-center bg-white min-h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-blue-400" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  const { user } = data;

  return (
    <>
    <Layout title="interview">
      <ToastContainer />
      <div className="font-sans text-gray-900 p-6 h-full flex flex-col lg:flex-row gap-6 relative">

        <div className={`lg:flex flex-1`}>
          <MainContent user={user} />
        </div>
        {showPricingModal && <PricingModal setShowPricingModal={setShowPricingModal} />}
      </div>
      </Layout>
    </>
  );
}
