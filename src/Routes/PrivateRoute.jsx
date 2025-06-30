import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Vortex } from "react-loader-spinner";
import useAuth from "../Hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth(); // use "loading" instead of "loader"
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Vortex
          visible={true}
          height="180"
          width="180"
          ariaLabel="vortex-loading"
          wrapperClass="vortex-wrapper"
          colors={["red", "green", "blue", "yellow", "orange", "purple"]}
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
