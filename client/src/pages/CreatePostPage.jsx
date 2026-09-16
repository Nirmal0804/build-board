import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/postService.js';
import { CATEGORIES } from '../utils/constants.js';
import Input from '../components/Input.jsx';
import Textarea from '../components/Textarea.jsx';
import Select from '../components/Select.jsx';
import Button from '../components/Button.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export const CreatePostPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Projects',
    content: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.trim().length > 100) {
      errors.title = 'Title must be 100 characters or fewer';
    }

    if (!formData.content.trim()) {
      errors.content = 'Post content is required';
    } else if (formData.content.trim().length > 5000) {
      errors.content = 'Content must be 5000 characters or fewer';
    }

    if (!formData.category) {
      errors.category = 'Please select a category';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
    setGeneralError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setGeneralError(null);
      const newPost = await postService.createPost({
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
      });
      navigate(`/posts/${newPost.id}`);
    } catch (err) {
      setGeneralError(err.message || 'Failed to publish post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const categoryOptions = CATEGORIES.map((c) => ({
    value: c.id,
    label: `${c.icon} ${c.name} — ${c.description.slice(0, 50)}...`,
  }));

  return (
    <div style={{ maxWidth: '780px', margin: '1rem auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Create a New Post
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Share your latest project, ask for help, or share educational resources with fellow developers.
        </p>
      </div>

      {generalError && (
        <ErrorMessage message={generalError} onDismiss={() => setGeneralError(null)} />
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
        }}
        noValidate
      >
        <Input
          id="title"
          label="Post Title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. How I built a real-time analytics dashboard with React"
          error={fieldErrors.title}
          helperText="Keep it clear and descriptive (1–100 characters)"
          required
        />

        <Select
          id="category"
          label="Category"
          value={formData.category}
          onChange={handleChange}
          options={categoryOptions}
          error={fieldErrors.category}
          required
        />

        <Textarea
          id="content"
          label="Content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Write your thoughts, share details, code explanations, or questions..."
          error={fieldErrors.content}
          helperText="Supports multi-line text (1–5000 characters)"
          rows={10}
          required
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Publishing...' : 'Publish Post'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostPage;
