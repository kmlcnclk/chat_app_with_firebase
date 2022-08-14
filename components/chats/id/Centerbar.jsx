import { Flex, Spinner } from '@chakra-ui/react';
import { collection, orderBy, query } from '@firebase/firestore';
import React, { useRef, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  useCollection,
  useCollectionData,
} from 'react-firebase-hooks/firestore';
import { auth, db } from '../../../myFirebaseConfig';

function Centerbar({ id }) {
  const [user] = useAuthState(auth);
  const q = query(collection(db, `chats/${id}/messages`), orderBy('timestamp'));
  const [snapshot, loading] = useCollection(q);
  const messages = snapshot?.docs?.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  const bottomOfChat = useRef();

  useEffect(() => {
    const scroll = bottomOfChat.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    setTimeout(scroll, 100);

    return () => {
      clearTimeout(scroll);
    };
  }, [messages]);

  const getMessages = () =>
    messages?.map((msg) => {
      const sender = msg.sender === user.email;
      return (
        <Flex
          key={msg.id}
          alignSelf={sender ? 'flex-end' : 'flex-start'}
          bg={sender ? 'blue.400' : 'blue.100'}
          color={sender ? 'white' : 'black'}
          w="fit-content"
          minWidth="100px"
          borderRadius="lg"
          className="shadow-lg"
          p={3}
          m={1}
        >
          <p>{msg.text}</p>
        </Flex>
      );
    });

  return (
    <Flex
      flex={1}
      direction="column"
      py={4}
      sx={{ scrollbarWidth: 'none' }}
      className="overflow-x-hidden overflow-y-auto"
    >
      {loading ? (
        <div className="h-full w-full flex justify-center items-center">
          <Spinner size="xl" />
        </div>
      ) : (
        <>
          {messages && messages[0] && user ? (
            getMessages()
          ) : (
            <div className="flex justify-center items-center">
              <p className="font-semibold text-lg text-gray-500">
                There are no messages
              </p>
            </div>
          )}
        </>
      )}
      <div ref={bottomOfChat}></div>
    </Flex>
  );
}

export default Centerbar;
