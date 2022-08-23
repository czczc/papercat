import { user, db } from "boot/firebase";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import axios from "axios";

const deletePaper = async (id) => {
  const docRef = doc(db, "papers", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const users = docSnap.data().users.filter((val) => val != user.value.uid);
    // console.log("Document data:", docSnap.data(), users);
    setDoc(docRef, { users }, { merge: true })
      .then(() => {
        console.log(
          "user " +
            user.value.uid +
            " removed from paper " +
            docSnap.data().arxiv
        );
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
};

const updatePaper = async (paper) => {
  // console.log("update paper", paper, paper.revision_id);
  let newPaper = await fetchInspire(paper.arxiv);
  if (!paper.revision_id || paper.revision_id != newPaper.revision_id) {
    newPaper.users = paper.users;
    const docRef = doc(db, "papers", paper.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // const users = docSnap.data().users.filter((val) => val != user.value.uid);
      // console.log("Document data:", docSnap.data(), users);
      setDoc(docRef, newPaper, { merge: true })
        .then(() => {
          console.log(
            `arXiv:${paper.arxiv} updated: ${paper.revision_id} => ${newPaper.revision_id} `
          );
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  } else {
    console.log(
      `arXiv:${paper.arxiv} not updated: ${paper.revision_id} => ${newPaper.revision_id} `
    );
  }
  return newPaper;
};

const createPaper = async (arxivId, paper = {}) => {
  let status = 0; // success: 0 | already own: 1 | add user to existing paper: 2 | paper doesn't exist: 3
  let newPaper = {};
  let colRef = collection(db, "papers");
  const q = query(colRef, where("arxiv", "==", arxivId));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size > 0) {
    // paper exists, add user only
    const paperSnapshot = querySnapshot.docs[0];
    if (paperSnapshot.data().users.includes(user.value.uid)) {
      status = 1;
    } else {
      status = 2;
      await addUserToPaper(paperSnapshot);
    }
  } else {
    // create new paper
    if (!paper.arxiv) {
      newPaper = await fetchInspire(arxivId);
    } else {
      newPaper = paper;
    }
    if (!newPaper.arxiv) {
      // didn't get info from Inspire
      status = 3;
    } else {
      newPaper.users = [user.value.uid];
      addDoc(colRef, newPaper);
      // console.log("added paper", arxivId);
    }
  }
  return { status, newPaper };
};

const addUserToPaper = async (paperSnapshot) => {
  const users = paperSnapshot.data().users;
  const docRef = doc(db, "papers", paperSnapshot.id);
  setDoc(docRef, { users: [...users, user.value.uid] }, { merge: true })
    .then(() => {
      console.log("added user to exisiting paper");
    })
    .catch((error) => {
      console.log(error);
    });
};

const createFromCollaboration = async (collaboration, page) => {
  // Daya%20Bay
  let url = `https://inspirehep.net/api/literature?q=collaboration=${collaboration}&doc_type=article&sort=mostrecent&page=${page}&size=10`;
  url = encodeURI(url);
  let total = 0;
  try {
    const response = await axios.get(url);
    // console.log(response.data);
    total = response.data.hits.total;
    response.data.hits.hits.forEach((hit) => {
      let paper = setMetaData(hit.metadata);
      // console.log(paper);
      if (paper.arxiv != "") {
        createPaper(paper.arxiv, paper); // don't query inspire again
      }
    });

    return { total };
    // paper.revision_id = response.data.revision_id;
  } catch (err) {
    console.log(err);
  }
};

const fetchInspire = async (arxivId) => {
  let paper = {};
  const url = `https://inspirehep.net/api/arxiv/${arxivId}?format=json`;
  // console.log(url);
  try {
    const response = await axios.get(url);

    paper = setMetaData(response.data.metadata);
    paper.revision_id = response.data.revision_id;

    // console.log(data);
  } catch (err) {
    console.log(err);
  }
  return paper;
};

const setMetaData = (metadata) => {
  let paper = {};
  paper.arxiv = metadata.arxiv_eprints ? metadata.arxiv_eprints[0].value : "";
  paper.title = metadata.titles[0].title;
  paper.citation_count = metadata.citation_count;
  paper.preprint_date = metadata.preprint_date;
  paper.control_number = metadata.control_number;
  paper.collaborations = metadata.collaborations
    ? metadata.collaborations.map((x) => x.value)
    : [];
  paper.publication = metadata.publication_info
    ? metadata.publication_info[0]
    : {};
  paper.doi = metadata.dois = metadata.dois ? metadata.dois[0].value : "";
  paper.year = metadata.publication_info
    ? metadata.publication_info[0].year
    : metadata.preprint_date.split("-")[0];
  paper.first_author = metadata.authors ? metadata.authors[0].full_name : "";
  return paper;
};

export {
  deletePaper,
  updatePaper,
  createPaper,
  createFromCollaboration,
  fetchInspire,
};
