import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import FeedPage from "./pages/FeedPage";
import { Toaster } from 'react-hot-toast';
import ProfilePage from "./pages/ProfilePage";
import ResumeAnalyzerPage from "./pages/ResumeAnalyzerPage"; // NEW IMPORT

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/feed" element={<FeedPage />} />
          {/* <Route path="/user/:id" element={<ProfilePage />} /> */}
          <Route path="/users/:id" element={<ProfilePage />} />
          {/* NEW ROUTE */}
          <Route
            path="/ai/resume-analyzer"
            element={
              <PrivateRoute>
                <ResumeAnalyzerPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
