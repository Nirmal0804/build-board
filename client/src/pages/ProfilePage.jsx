import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userService } from '../services/userService.js';
import { formatDate } from '../utils/formatDate.js';
import PostCard from '../components/PostCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Button from '../components/Button.jsx';

export const ProfilePage = () => {
  const { id } = useParams();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [userData, userPosts] = await Promise.all([
          userService.getUserProfile(id),
          userService.getUserPosts(id),
        ]);
        setProfile(userData);
        setPosts(userPosts || []);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Loading user profile..." />;
  }

  if (error || !profile) {
    return (
      <div style={{ maxWidth: '640px', margin: '3rem auto' }}>
        <ErrorMessage message={error || 'User profile not found'} />
        <Link to="/posts">
          <Button variant="secondary">&larr; Explore Discussions</Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Profile Header */}
      <section className="profile-card">
        <img
          src={
            profile.avatar ||
            `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
              profile.name || 'developer'
            )}`
          }
          alt={`${profile.name}'s profile avatar`}
          className="profile-avatar-large"
        />

        <div className="profile-info">
          <h1 className="profile-name">{profile.name}</h1>
          <div className="profile-joined">
            Member since {formatDate(profile.createdAt)}
          </div>
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="stat-number">{profile.postCount || posts.length}</span>
              <span className="stat-label">Posts Published</span>
            </div>
            <div className="profile-stat">
              <span className="stat-number">{profile.commentCount || 0}</span>
              <span className="stat-label">Comments</span>
            </div>
          </div>
        </div>
      </section>

      {/* User's Posts */}
      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Published Posts ({posts.length})
        </h2>

        {posts.length === 0 ? (
          <EmptyState
            title="No posts published yet"
            description="This user has not published any discussions or projects."
          />
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
