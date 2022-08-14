import { collection, getDocs, Timestamp } from '@firebase/firestore';
import { db, auth } from '../myFirebaseConfig';

async function getChats() {
  const user = await auth.currentUser;

  const snapshot = await getDocs(collection(db, 'chats'));
  let datas = [];

  if (user && snapshot) {
    const data = await snapshot?.docs
      .map((doc) => {
        return { id: doc.id, ...doc.data() };
      })
      .filter((chat) => chat.users.includes(user?.email))
      .sort((a, b) => b.updatedDate - a.updatedDate);

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
  }
  return datas;
}

export default getChats;
