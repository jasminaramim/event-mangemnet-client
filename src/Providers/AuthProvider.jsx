import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import auth from "../Firebase/firebase.init";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import axios from "axios";

export const AuthContexts = createContext(null);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const axiosPublic = useAxiosPublic();

  // 🔄 Load theme on mount
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  // 🔐 Firebase - Create User
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // 🔐 Firebase - Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success("🎉 Login Successful!");
      return result;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Firebase - Google Login
  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // 🚪 Logout
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // 👤 Update Profile
  const userProfileUpdate = (name, photo) => {
    setLoading(true);
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  // 🔁 Reset Password
  const changePassword = (email) => {
    return sendPasswordResetEmail(auth, email)
      .then(() => toast.success("Password reset email sent!"))
      .catch((error) => toast.error(error.message));
  };

  // 🔄 Auth State Listener + JWT Fetch
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        try {
          await axios.post(
            "https://event-mangemnet-server-5.onrender.com/jwt",
            { email: currentUser.email },
            { withCredentials: true }
          );
        } catch (err) {
          console.error("JWT Error:", err);
        }

        // 🔍 Get DB user if available
        try {
          const res = await axiosPublic.get(`/users/${currentUser.email}`);
          setDbUser(res.data);
        } catch (err) {
          console.warn("User not in DB:", err.response?.status);
          setDbUser(null);
        }
      } else {
        await axios.get("https://event-mangemnet-server-5.onrender.com/logout", {
          withCredentials: true,
        });
        setDbUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [axiosPublic]);

  const authInfo = {
    user,
    dbUser,
    loading,
    setLoading,
    createUser,
    login,
    logOut,
    userProfileUpdate,
    signInWithGoogle,
    changePassword,
    theme,
    toggleTheme,
  };

  return (
    <AuthContexts.Provider value={authInfo}>{children}</AuthContexts.Provider>
  );
};

export default AuthProvider;
