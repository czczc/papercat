import { user, db } from "boot/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const getTags = async () => {
  let colRef = collection(db, "users_tags");
  const q = query(colRef, where("uid", "==", user.value.uid));
  const querySnapshot = await getDocs(q);

  const data = querySnapshot.docs[0].data();
  return { data };
};

export { getTags };
