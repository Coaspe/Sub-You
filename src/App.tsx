import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import useAuthListner from './hooks/use-auth';
import { lazy, Suspense } from 'react';
import UserContext from "./context/user";
import IsUserLoggedIn from "./helpers/Is-user-logged-in";
import ProtectedRoute from "./helpers/Protected.route";

const Login = lazy(() => import("./page/Login"))
const Dashboard = lazy(() => import("./page/Dashboard"))
const Signup = lazy(() => import("./page/Signup"))
const Artists = lazy(() => import("./page/Artists"))

const App = () => {
  const { user } = useAuthListner()
  
  return (
    <UserContext.Provider value={{ user }}>
      <Router>
        <Suspense
          fallback={
            <div className="w-screen h-screen flex items-center justify-center">
              <img
                className="w-20 opacity-50"
                src="/images/logo.png"
                alt="loading"
              />
            </div>
          }
        >
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute user={user}>
                  <Dashboard />
                </ProtectedRoute>
              }
              />
            <Route
              path="/login"
              element={
                <IsUserLoggedIn user={user}>
                  <Login />
                </IsUserLoggedIn>
              }
              />
            <Route
              path="/signup"
              element={
                <IsUserLoggedIn user={user}>
                  <Signup />
                </IsUserLoggedIn>
              }
            />
            <Route
              path="/artist"
              element={
                <ProtectedRoute user={user}>
                  <Artists />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
