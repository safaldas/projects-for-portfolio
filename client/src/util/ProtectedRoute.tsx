import { Navigate } from "react-router-dom";

 const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const  user  = JSON.parse(localStorage.getItem('user'))
  console.log(user,"uss")
  if (!user) {
    // user is not authenticated
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;