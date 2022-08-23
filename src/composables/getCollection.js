import { ref, watchEffect } from "vue";

// firebase imports
import { db } from "boot/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const getCollection = (c, q) => {
  const documents = ref(null);

  // collection reference
  let colRef = collection(db, c);

  if (q) {
    // console.log(...q);
    colRef = query(colRef, where(...q));
  }

  const unsub = onSnapshot(colRef, (snapshot) => {
    let results = [];
    // if (snapshot.metadata.hasPendingWrites) {
    //   return;
    // }
    snapshot.docs.forEach((doc) => {
      if (doc.data().arxiv) {
        results.push({ ...doc.data(), id: doc.id });
      }
    });

    // update values
    documents.value = results;
    console.log("collection updated: ", results.length);
  });

  watchEffect((onInvalidate) => {
    onInvalidate(() => unsub());
    console.log("unsubscribed");
  });

  // return { documents };
  return documents;
};

export default getCollection;
