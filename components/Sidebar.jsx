import React, { useEffect } from 'react';
import { Timestamp } from '@firebase/firestore';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../myFirebaseConfig';
import { Avatar, Spinner } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { signOut } from '@firebase/auth';
import { changeOtherUser } from '../store/otherUserSlice';
import { changeOtherUsers } from '../store/otherUsersSlice';
import { useDispatch, useSelector } from 'react-redux';
import getOtherUsers from '../src/getOtherUsers';
import NextImage from 'next/image';

function Sidebar() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const otherUsers = useSelector((state) => state.otherUsers.value);

  const dispatch = useDispatch();

  useEffect(() => {
    router.prefetch('/chat/create');
    router.prefetch('/');

    const getOtherUsersInterval = setInterval(
      () => getOtherUsers().then((res) => dispatch(changeOtherUsers(res))),
      1000
    );

    return () => {
      clearInterval(getOtherUsersInterval);
    };
  }, [router, dispatch]);

  const signOutFunc = async () => {
    await signOut(auth);
    router.push('/');
  };

  const goToChat = async (otherUser) => {
    const newUpdatedDate = await new Date(
      new Timestamp(
        otherUser.updatedDate.seconds,
        otherUser.updatedDate.nanoseconds
      ).toDate()
    ).getTime();

    const newCreatedDate = await new Date(
      new Timestamp(
        otherUser.createdDate.seconds,
        otherUser.createdDate.nanoseconds
      ).toDate()
    ).getTime();

    const newOtherUser = {
      createdDate: newCreatedDate,
      updatedDate: newUpdatedDate,
      chatID: otherUser.chatID,
      displayName: otherUser.displayName,
      email: otherUser.email,
      id: otherUser.id,
      phoneNumber: otherUser.phoneNumber,
      photoURL: otherUser.photoURL,
      uid: otherUser.uid,
    };

    await dispatch(changeOtherUser(newOtherUser));

    router.push(`/chat/${otherUser.chatID}`);
  };

  const chatList = () => {
    return otherUsers?.map((otherUser) => (
      <div key={otherUser.id}>
        <div
          className="flex items-center p-3 space-x-3 hover:bg-gray-100 transition-all duration-300 cursor-pointer"
          onClick={() => goToChat(otherUser)}
        >
          <NextImage
            src={otherUser.photoURL}
            width="48px"
            height="48px"
            objectFit="contain"
            className="rounded-full"
            alt={otherUser.displayName}
            priority={true}
          />
          <p className="text-md font-semibold">{otherUser.displayName}</p>
        </div>
      </div>
    ));
  };

  return (
    <>
      {user && (
        <div className="h-full bg-[#F9F9F9] w-auto shadow-xl">
          <div className="p-4 flex items-center space-x-5 justify-between w-full">
            <div className="w-12">
              <NextImage
                src={user?.photoURL}
                width="48px"
                height="48px"
                objectFit="contain"
                className="rounded-full"
                alt={user?.displayName}
                priority={true}
              />
            </div>
            <div>
              <h3 className="font-semibold text-xl">{user.displayName}</h3>
              <h5 className="text-sm">{user.email}</h5>
            </div>

            <div
              onClick={signOutFunc}
              className="p-1 flex justify-center items-center hover:bg-[#edf2f7] transition-all duration-200 rounded-full cursor-pointer"
            >
              <ChevronLeftIcon w={6} h={6} />
            </div>
          </div>
          <hr />
          <div className="w-auto my-3 flex justify-center items-center">
            <button
              onClick={() => router.push('/chat/createChat')}
              className="bg-red-500 hover:bg-red-600 transition-colors duration-200 text-white font-semibold w-[200px] shadow-xl rounded-xl p-2"
            >
              New Chat
            </button>
          </div>
          <hr />
          {otherUsers[0] ? (
            <div>{chatList()}</div>
          ) : (
            <div className="flex justify-center items-center mt-10">
              <Spinner size="md" />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Sidebar;
