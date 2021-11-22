import { useState, useEffect, useContext } from "react";
import FirebaseContext from "../context/firebase";
import Firebase from "firebase/compat/app";

const useAuthListner = () => {
  const { firebase } = useContext(FirebaseContext);
  const [user, setUser] = useState<Firebase.User>(
    JSON.parse(localStorage.getItem("authUser") as string)
  );
  
  useEffect(() => {
    const listener = firebase.auth().onAuthStateChanged((authUser) => {
      // console.log("onAuthStateChanged", JSON.stringify(authUser));
      // we have a user... therefore we can store the user in localstorage
      if (authUser) {
        localStorage.setItem("authUser", JSON.stringify(authUser));
        setUser(authUser);
      } else {
        // we don't have an authUser, therefore clear the localstorage
        localStorage.removeItem("authUser");
        setUser({} as Firebase.User);
      }
    });

    return () => listener();
  }, [firebase]);
  return { user } ;
};

export default useAuthListner;
