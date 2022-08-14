import { collection, Timestamp } from '@firebase/firestore';
import { useEffect } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../myFirebaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { changeChats } from '../store/chats';
import { useState } from 'react';

function useGetChats(user, getState) {
  const [snapshot] = useCollection(collection(db, 'chats'));
  const chats = useSelector((state) => state.chats.value);
  const dispatch = useDispatch();
  const [c, setC] = useState([]);

  useEffect(() => {
    const getChatsFunc = async () => {
      if (
        user &&
        snapshot &&
        // c.length > chats.length ||
        c.length == 0 &&
        // chats.length == 0 &&
        getState
      ) {
        // if (chats[0]) await dispatch(changeChats([]));

        const data = await snapshot?.docs
          .map((doc) => {
            return { id: doc.id, ...doc.data() };
          })
          .filter((chat) => chat.users.includes(user?.email))
          .sort((a, b) => b.updatedDate - a.updatedDate);

        let datas = [];
        for (const d of data) {
          const newUpdatedDate = await new Date(
            new Timestamp(
              d.updatedDate?.seconds,
              d.updatedDate?.nanoseconds
            ).toDate()
          ).getTime();

          const newData = await {
            id: d.id,
            createdDate: new Date(d.createdDate).getTime(),
            updatedDate: newUpdatedDate,
            users: d.users,
          };

          await datas.push(newData);
        }
        await setC(datas);
      }
    };

    getChatsFunc();
    if (c[0] && chats.length != c.length && c[0]?.id != chats[0]?.id)
      dispatch(changeChats(c));
  }, [user, dispatch, c, snapshot, chats, getState]);

  return [chats];
}

export default useGetChats;
