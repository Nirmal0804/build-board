export const ALLOWED_CATEGORIES = ['Projects', 'Help', 'Learning', 'Opportunities'];

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validateRegistration = ({ name, email, password }) => {
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.trim().length > 50) {
    errors.push('Name cannot exceed 50 characters');
  }

  if (!email || !isValidEmail(email)) {
    errors.push('Valid email address is required');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  } else if (password.length > 100) {
    errors.push('Password cannot exceed 100 characters');
  }

  return errors;
};

export const validateLogin = ({ email, password }) => {
  const errors = [];

  if (!email || !isValidEmail(email)) {
    errors.push('Valid email address is required');
  }

  if (!password || typeof password !== 'string' || password.trim().length === 0) {
    errors.push('Password is required');
  }

  return errors;
};

export const validatePostInput = ({ title, content, category }) => {
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required');
  } else if (title.trim().length > 100) {
    errors.push('Title must not exceed 100 characters');
  }

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    errors.push('Content is required');
  } else if (content.trim().length > 5000) {
    errors.push('Content must not exceed 5000 characters');
  }

  if (!category || !ALLOWED_CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`);
  }

  return errors;
};

export const validateCommentInput = ({ content }) => {
  const errors = [];

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    errors.push('Comment content is required');
  } else if (content.trim().length > 1000) {
    errors.push('Comment must not exceed 1000 characters');
  }

  return errors;
};
