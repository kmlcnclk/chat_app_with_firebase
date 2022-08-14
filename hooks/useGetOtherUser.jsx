import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from '@firebase/firestore';
import { db } from '../myFirebaseConfig';

function useGetOtherUser(chats, currentUser) {
  const [otherUsers, setOtherUsers] = useState([]);

  useEffect(() => {
    const chatFunc = async () => {
      if (chats[0] && currentUser && chats.length > otherUsers.length) {
        let data = [];
        for (const chat of chats) {
          const otherUserEmail = await chat?.users?.filter(
            (user) => user !== currentUser?.email
          )[0];

          if (
            !otherUsers?.some(
              (otherUser) => otherUser?.email === otherUserEmail
            )
          ) {
            const userCollection = await collection(db, 'users');

            const q = await query(
              userCollection,
              where('email', '==', otherUserEmail)
            );

            const otherUser = await getDocs(q);

            await otherUser?.docs.map((doc) => {
              data.push({
                chatID: chat.id,
                id: doc.id,
                ...doc.data(),
              });
            });
          }
        }
        setOtherUsers((prevState) => {
   
          
          if (data[0]?.id != prevState[0]?.id) return [...data, ...prevState];
          return [...prevState];
        });
      }
    };

    chatFunc();
  }, [chats, currentUser, otherUsers]);

  return [otherUsers, setOtherUsers];
}

export default useGetOtherUser;

// const getOtherUser = async (users, currentUserEmail) => {
//   const otherUserEmail = await users?.filter(
//     (user) => user !== currentUserEmail
//   )[0];
//   const userCollection = await collection(db, 'users');
//   const q = await query(userCollection, where('email', '==', otherUserEmail));
//   const otherUser = await getDocs(q);

//   const user = otherUser?.docs?.map((doc) => ({ id: doc.id, ...doc.data() }));
//   return user
// };

// export default getOtherUser;
