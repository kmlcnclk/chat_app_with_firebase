import { Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import MyLayout from '../components/MyLayout';
import { auth } from '../myFirebaseConfig';
import Sidebar from '../components/Sidebar';
import HomeComponent from '../components/HomeComponent';

// https://assets.materialup.com/uploads/17232f9e-82f4-479b-a606-962876ce2751/preview.jpg

function Home() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/login');
    
    if (!user && !loading) router.push('/login');
  }, [user, router, loading]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return <MyLayout>{user && !loading && <HomeComponent />}</MyLayout>;
}

export default Home;
