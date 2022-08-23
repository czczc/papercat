// import { ref } from "vue";

// firebase imports
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const userLogin = () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  signInWithPopup(auth, provider)
    .then(() => {
      // const user = result.user;
      console.log("login success!");
    })
    .catch((error) => {
      console.log(error);
    });
  // return { error, login, isPending };
};

export default userLogin;
