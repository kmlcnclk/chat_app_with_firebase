import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from '@firebase/firestore';
import { db, auth } from '../myFirebaseConfig';
import getChats from './getChats';

async function getOtherUsers() {
  const currentUser = await auth.currentUser;

  const chats = await getChats();

  let otherUsers = [];

  if (chats[0] && currentUser && chats.length > otherUsers.length) {
    for (const chat of chats) {
      const otherUserEmail = await chat?.users?.filter(
        (user) => user !== currentUser?.email
      )[0];
      if (
        !otherUsers?.some((otherUser) => otherUser?.email === otherUserEmail)
      ) {
        const userCollection = await collection(db, 'users');

        const q = await query(
          userCollection,
          where('email', '==', otherUserEmail)
        );

        const otherUser = await getDocs(q);

        await otherUser?.docs.map((doc) => {
          let docData = {
            ...doc.data(),
          };

          const newUpdatedDate = new Date(
            new Timestamp(
              docData.updatedDate.seconds,
              docData.updatedDate.nanoseconds
            ).toDate()
          ).getTime();

          const newCreatedDate = new Date(
            new Timestamp(
              docData.createdDate.seconds,
              docData.createdDate.nanoseconds
            ).toDate()
          ).getTime();

          const newOtherUser = {
            chatID: chat.id,
            createdDate: newCreatedDate,
            id: doc.id,
            updatedDate: newUpdatedDate,
            displayName: docData.displayName,
            email: docData.email,
            phoneNumber: docData.phoneNumber,
            photoURL: docData.photoURL,
            uid: docData.uid,
          };
          otherUsers.push(newOtherUser);
        });
      }
    }
  }
  return otherUsers;
}

export default getOtherUsers;
