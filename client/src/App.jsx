import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import HomePage from './pages/HomePage.jsx';
import ExplorePostsPage from './pages/ExplorePostsPage.jsx';
import PostDetailPage from './pages/PostDetailPage.jsx';
import CreatePostPage from './pages/CreatePostPage.jsx';
import EditPostPage from './pages/EditPostPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export const App = () => {
  return (
    <AuthProvider>
      <div className="app-layout">
        <Navbar />
        <main className="main-content" id="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts" element={<ExplorePostsPage />} />
            <Route
              path="/posts/create"
              element={
                <ProtectedRoute>
                  <CreatePostPage />
                </ProtectedRoute>
              }
            />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route
              path="/posts/:id/edit"
              element={
                <ProtectedRoute>
                  <EditPostPage />
                </ProtectedRoute>
              }
            />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;
