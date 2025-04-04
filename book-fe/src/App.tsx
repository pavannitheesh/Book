import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Books from './components/Books';
import AddNewBook from './components/AddNewBook';
import BookDetail from './components/BookDetail';
import AdminEditBook from './components/AdminEditBook';
import Profile from './components/Profile';
import Favorites from './components/Favorites';
import Layout from './components/Layout';
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const isLoggedIn = userInfo.token !== undefined && userInfo.token !== "";

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Toaster position="top-center" />
          <Routes>
            {/* Public Routes (accessible regardless of login status) */}
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes (only accessible if logged in) */}
            {isLoggedIn ? (
              <>
                <Route path="/" element={<Layout showSearch><Books /></Layout>} />
                <Route path="/books" element={<Layout showSearch><Books /></Layout>} />
                <Route path="/addbook" element={<Layout><AddNewBook /></Layout>} />
                <Route path="/books/:id" element={<Layout><BookDetail /></Layout>} />
                <Route path="/edit/:id" element={<Layout><AdminEditBook /></Layout>} />
                <Route path="/profile/:id" element={<Layout><Profile /></Layout>} />
                <Route path="/favorites" element={<Layout><Favorites /></Layout>} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}

            {/* Fallback Route */}
            <Route
              path="*"
              element={
                isLoggedIn ? (
                  <Navigate to="/books" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;