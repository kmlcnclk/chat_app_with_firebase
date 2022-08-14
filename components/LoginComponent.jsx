import React, { useEffect } from 'react';
import { ChatIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Stack } from '@chakra-ui/react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth, db } from '../myFirebaseConfig';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { addDoc, collection, serverTimestamp } from '@firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { signInWithPopup, GoogleAuthProvider } from '@firebase/auth';

function LoginComponent() {
  const [snapshot, loading, error] = useCollection(collection(db, 'users'));
  const users = snapshot?.docs?.map((doc) => ({ id: doc.id, ...doc.data() }));

  const router = useRouter();

  const userExists = (uid) => users?.find((user) => user.uid === uid);

  const signIn = async () => {
    const user = await signInWithPopup(auth, new GoogleAuthProvider());

    if (user?.user) {
      if (!userExists(user?.user?.uid)) {
        await addDoc(collection(db, 'users'), {
          uid: user.user.uid,
          displayName: user.user.displayName,
          email: user.user.email,
          phoneNumber: user.user.phoneNumber,
          photoURL: user.user.photoURL,
          createdDate: serverTimestamp(),
          updatedDate: serverTimestamp(),
        });
      }
      router.push('/');
    }
  };
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      <Center h="100vh">
        <Stack
          align="center"
          bgColor="gray.600"
          p={16}
          rounded="3xl"
          spacing={12}
          boxShadow="lg"
        >
          <Box
            bgColor="blue.500"
            w="fit-content"
            p={5}
            rounded="3xl"
            boxShadow="md"
          >
            <ChatIcon w="100px" h="100px" color="white" />
          </Box>

          <Button boxShadow="md" onClick={signIn}>
            Sign In with Google
          </Button>
        </Stack>
      </Center>
    </>
  );
}

export default LoginComponent;
