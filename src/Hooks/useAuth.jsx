import { useContext } from "react";
import { AuthContexts } from "../Providers/AuthProvider";
// import { AuthContexts } from "../providers/AuthProvider";

const useAuth = () => {
  const auth = useContext(AuthContexts);
  return auth;
};

export default useAuth;
