import React, { useEffect } from 'react';
import MyLayout from '../../components/MyLayout';
import { useRouter } from 'next/router';
import Topbar from '../../components/chats/id/Topbar';
import Centerbar from '../../components/chats/id/Centerbar';
import Bottombar from '../../components/chats/id/Bottombar';
import { useSelector } from 'react-redux';

function Id() {
  const router = useRouter();
  const { id } = router.query;

  const otherUser = useSelector((state) => state.otherUser.value);

  useEffect(() => {
    router.prefetch('/');

    if (!otherUser?.displayName) {
      router.push('/');
    }
  }, [router, otherUser]);

  return (
    <>
      {otherUser?.displayName && (
        <MyLayout>
          <div className="w-full flex h-full flex-col justify-between">
            <div className="h-1/6">
              <Topbar />
            </div>
            <div className="flex flex-col justify-end h-4/5">
              <Centerbar id={id} />
            </div>
            <div className="h-min relative">
              <Bottombar id={id} />
            </div>
          </div>
        </MyLayout>
      )}
    </>
  );
}

export default Id;
