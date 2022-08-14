import { Input, useToast } from '@chakra-ui/react';
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from '@firebase/firestore';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db } from '../../myFirebaseConfig';

function CreateMyChatComponent() {
  const [user] = useAuthState(auth);
  const [snapshot] = useCollection(collection(db, 'chats'));
  const chats = snapshot?.docs?.map((doc) => ({ id: doc.id, ...doc.data() }));

  const toast = useToast();
  const router = useRouter();

  const [email, setEmail] = useState('');

  const chatExists = () =>
    chats.find(
      (chat) => chat.users.includes(user.email) && chat.users.includes(email)
    );

  const userExists = async () => {
    const q = await query(collection(db, 'users'), where('email', '==', email));
    const user = await getDocs(q);

    return user?.docs[0];
  };

  const newChat = async (e) => {
    e.preventDefault();
    if (email != user.email) {
      const isUserExists = await userExists();
      if (isUserExists) {
        if (!chatExists()) {
          await addDoc(collection(db, 'chats'), {
            users: [user.email, email],
            createdDate: serverTimestamp(),
            updatedDate: serverTimestamp(),
          });
          toast({
            title: `You successfully created a new chat with ${email}`,
            description: '',
            status: 'success',
            duration: 2000,
            isClosable: true,
          });

          router.push('/');
        } else {
          toast({
            title: 'This chat is already available',
            status: 'error',
            duration: 2000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: 'This user is not available',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "You can't add yourself",
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="p-14 bg-gray-200 shadow-2xl rounded-xl">
        <form onSubmit={newChat}>
          <h2 className="font-semibold text-xl mb-6 text-center">New Chat</h2>

          <Input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            className=" rounded-md p-2 shadow-xl mb-6"
            borderRadius="md"
            placeholder="Email"
            variant="outline"
            bgColor="white"
            focusBorderColor="none"
            required
          />
          <button
            className=" w-full bg-red-500 p-2 rounded-xl shadow-xl text-white hover:bg-red-600 transition-colors"
            type="submit"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateMyChatComponent;
