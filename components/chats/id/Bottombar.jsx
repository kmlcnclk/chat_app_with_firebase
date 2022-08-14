import React from 'react';
import { Button, FormControl, Input } from '@chakra-ui/react';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from '@firebase/firestore';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDispatch } from 'react-redux';
import { auth, db } from '../../../myFirebaseConfig';
import getOtherUsers from '../../../src/getOtherUsers';
import { changeOtherUsers } from '../../../store/otherUsersSlice';

function Bottombar({ id }) {
  const [input, setInput] = useState('');
  const [user] = useAuthState(auth);

  const dispatch = useDispatch();

  const sendMessage = async (e) => {
    e.preventDefault();

    const chatRef = await doc(db, `chats/${id}`);

    await addDoc(collection(db, `chats/${id}/messages`), {
      text: input,
      sender: user.email,
      timestamp: serverTimestamp(),
    });

    await updateDoc(chatRef, {
      updatedDate: Date.now(),
    });

    getOtherUsers().then((res) => dispatch(changeOtherUsers(res)));

    await setInput('');
  };

  return (
    <FormControl
      onSubmit={sendMessage}
      px={4}
      as="form"
      zIndex={10}
      className="absolute bottom-3 "
    >
      <Input
        type="text"
        className=" rounded-md shadow-xl"
        borderRadius="md"
        onChange={(e) => setInput(e.target.value)}
        placeholder="Message"
        variant="outline"
        value={input}
        bgColor="white"
        focusBorderColor="none"
      />
      <Button type="submit" hidden>
        Submit
      </Button>
    </FormControl>
  );
}

export default Bottombar;
