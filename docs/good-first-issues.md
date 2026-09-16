# 🌟 Initial Good First Issues

Welcome prospective contributors! Below is a curated list of 20 legitimate beginner-friendly tasks across HTML/CSS, React, API design, testing, and CI. Each issue references the exact files, classification, difficulty, and acceptance criteria to help you make your first pull request.

---

### Issue #1: Add missing favicon
- **Type**: `enhancement`
- **Difficulty**: Very Easy
- **Where to look**: `client/index.html`, `client/public/`
- **Description**: Currently `client/index.html` has no dedicated `<link rel="icon">` pointing to a custom BuildBoard SVG or PNG favicon in `client/public/`.
- **Expected behavior**: A clean, scalable SVG favicon representing BuildBoard appears on the browser tab.
- **Acceptance criteria**:
  - [ ] Add `favicon.svg` in `client/public/`
  - [ ] Reference the favicon in `client/index.html`

---

### Issue #2: Replace emoji category icons with consistent icon components
- **Type**: `enhancement`
- **Difficulty**: Easy
- **Where to look**: `client/src/utils/constants.js`, `client/src/components/CategoryCard.jsx`
- **Description**: Category cards and badges currently render emoji characters (`🚀`, `💡`, `📚`, `🎯`). Replace these with clean, accessible SVG icon components or scalable vectors for consistent rendering across platforms.
- **Expected behavior**: Consistent, sharp visual category indicators across all screen densities and operating systems.
- **Acceptance criteria**:
  - [ ] Implement SVG icon components or vector icons for Projects, Help, Learning, and Opportunities
  - [ ] Ensure proper `aria-hidden="true"` attributes

---

### Issue #3: Add loading skeleton cards to Profile Page
- **Type**: `enhancement`
- **Difficulty**: Easy
- **Where to look**: `client/src/pages/ProfilePage.jsx`
- **Description**: Currently `ProfilePage.jsx` renders a generic text spinner while posts load. Add pulse-animated skeleton placeholder cards to match the layout of published posts.
- **Expected behavior**: Animated skeleton placeholders appear while `userService.getUserPosts` is pending.
- **Acceptance criteria**:
  - [ ] Add CSS pulse animation skeleton card styles in `client/src/index.css`
  - [ ] Render 3 skeleton cards while profile posts are loading

---

### Issue #4: Improve empty-state UI with custom illustration
- **Type**: `enhancement`
- **Difficulty**: Easy
- **Where to look**: `client/src/components/EmptyState.jsx`, `client/src/index.css`
- **Description**: Add contextual illustrations or custom SVG graphics to empty states when search returns zero results or when a category has no posts.
- **Expected behavior**: Friendly, visually engaging empty state card with clear CTA buttons.
- **Acceptance criteria**:
  - [ ] Style the empty state with soft background tints and engaging graphic/illustration
  - [ ] Verify both mobile and desktop layouts

---

### Issue #5: Add post-title character counter
- **Type**: `enhancement`
- **Difficulty**: Easy
- **Where to look**: `client/src/pages/CreatePostPage.jsx`, `client/src/pages/EditPostPage.jsx`
- **Description**: Add a real-time character counter under the Post Title input (e.g., "45 / 100 characters") turning warning/danger color when near the 100 character limit.
- **Expected behavior**: Contributors and users see remaining characters dynamically as they type.
- **Acceptance criteria**:
  - [ ] Counter updates on every keystroke
  - [ ] Changes color when title length > 90 characters
  - [ ] Prevents submission if length > 100

---

### Issue #6: Add post-content character counter
- **Type**: `enhancement`
- **Difficulty**: Easy
- **Where to look**: `client/src/components/Textarea.jsx`, `client/src/pages/CreatePostPage.jsx`
- **Description**: Add a character counter for post content (1–5000 characters) in `CreatePostPage.jsx` and `EditPostPage.jsx`.
- **Expected behavior**: Shows "X / 5000 characters" below the textarea with accessible screen reader labels.
- **Acceptance criteria**:
  - [ ] Renders under the textarea element
  - [ ] Accessible `aria-live="polite"` counter for screen readers

---

### Issue #7: Add smooth transition to mobile navbar drawer
- **Type**: `enhancement`
- **Difficulty**: Easy
- **Where to look**: `client/src/components/Navbar.jsx`, `client/src/index.css`
- **Description**: Currently `.mobile-menu` abruptly switches `display: none` / `display: flex`. Add a smooth slide-down or opacity fade transition.
- **Expected behavior**: The mobile drawer menu animates smoothly when toggled open and closed.
- **Acceptance criteria**:
  - [ ] Add CSS transition/animation to `.mobile-menu`
  - [ ] Close menu automatically on escape key press

---

### Issue #8: Add category color accents to Post Detail badges
- **Type**: `enhancement`
- **Difficulty**: Very Easy
- **Where to look**: `client/src/pages/PostDetailPage.jsx`, `client/src/index.css`
- **Description**: Ensure category badges in `PostDetailPage.jsx` have distinctive, category-specific accent borders and background tints matching those in `PostCard.jsx`.
- **Expected behavior**: High-contrast, beautifully tinted badges matching the category palette.
- **Acceptance criteria**:
  - [ ] Consistent color tokens for Projects, Help, Learning, and Opportunities
  - [ ] Accessible color contrast ratio (WCAG AA compliant)

---

### Issue #9: Add clear button to post search input
- **Type**: `enhancement`
- **Difficulty**: Easy
- **Where to look**: `client/src/pages/ExplorePostsPage.jsx`, `client/src/pages/HomePage.jsx`
- **Description**: Add an inline "✕" clear button inside the search input when text is entered, allowing users to clear their query in one click.
- **Expected behavior**: Clear button appears only when input has text; clicking clears the input and resets results.
- **Acceptance criteria**:
  - [ ] Clear button renders when `searchInput.length > 0`
  - [ ] Keyboard accessible (Tab + Enter/Space clears input)

---

### Issue #10: Add password visibility toggle
- **Type**: `enhancement`
- **Difficulty**: Medium
- **Where to look**: `client/src/components/Input.jsx`, `client/src/pages/LoginPage.jsx`, `client/src/pages/RegisterPage.jsx`
- **Description**: Add an eye toggle icon button inside password input fields allowing users to toggle between masked (`password`) and plain text (`text`).
- **Expected behavior**: Clicking the eye icon toggles the field type without losing focus.
- **Acceptance criteria**:
  - [ ] Toggle button with `aria-label="Show password"` / `aria-label="Hide password"`
  - [ ] Applied to login, register, and confirm password fields

---

### Issue #11: Improve 404 page with navigation recommendations
- **Type**: `enhancement`
- **Difficulty**: Easy
- **Where to look**: `client/src/pages/NotFoundPage.jsx`
- **Description**: Enhance the 404 page with a helpful list of suggested links (e.g., "Trending Posts", "Ask for Help") and a friendly developer graphic.
- **Expected behavior**: Users landing on broken links receive helpful navigational guidance.
- **Acceptance criteria**:
  - [ ] Add 3 helpful quick links
  - [ ] Responsive layout with accessible markup

---

### Issue #12: Add confirmation modal for comment deletion
- **Type**: `enhancement`
- **Difficulty**: Easy
- **Where to look**: `client/src/pages/PostDetailPage.jsx`, `client/src/components/CommentCard.jsx`
- **Description**: Currently comments are deleted directly when clicking Delete. Connect the existing reusable `Modal` component to confirm deletion first.
- **Expected behavior**: A confirmation modal appears asking "Are you sure you want to delete this comment?" before making the DELETE API call.
- **Acceptance criteria**:
  - [ ] Opens `Modal` on clicking Delete comment
  - [ ] Closes on Cancel without deleting
  - [ ] Deletes comment on Confirm

---

### Issue #13: Support relative time formatting in timestamps
- **Type**: `enhancement`
- **Difficulty**: Easy
- **Where to look**: `client/src/utils/formatDate.js`
- **Description**: Upgrade `formatDate.js` to support relative time formatting (e.g. "5 minutes ago", "2 hours ago", "yesterday") for dates within the last 7 days.
- **Expected behavior**: Posts and comments display relative time for recent activity.
- **Acceptance criteria**:
  - [ ] Implement clean relative time function without adding bulky external libraries
  - [ ] Fallback to standard formatted date for older items
  - [ ] Unit tests covering edge cases

---

### Issue #14: Optimize PostCard header wrapping on 320px screens
- **Type**: `bug`
- **Difficulty**: Easy
- **Where to look**: `client/src/components/PostCard.jsx`, `client/src/index.css`
- **Description**: On ultra-narrow viewports (320px), long author names and category badges can cause cramped layouts or slight horizontal scrollbars.
- **Expected behavior**: Clean wrapping and vertical flex arrangement on viewports <= 360px.
- **Acceptance criteria**:
  - [ ] Test on 320px viewport in browser responsive mode
  - [ ] Prevent horizontal overflow

---

### Issue #15: Add image alt text and avatar fallback handlers
- **Type**: `accessibility`
- **Difficulty**: Easy
- **Where to look**: `client/src/components/Navbar.jsx`, `client/src/pages/ProfilePage.jsx`, `client/src/components/PostCard.jsx`
- **Description**: Audit avatar images and ensure descriptive `alt` text and fallback handling if an image URL fails to load.
- **Expected behavior**: Screen readers announce author names accurately; broken avatar images render clean fallback SVG initials.
- **Acceptance criteria**:
  - [ ] All `img` tags have descriptive `alt` attributes
  - [ ] Add `onError` handler providing SVG initials fallback

---

### Issue #16: Improve keyboard focus rings on interactive elements
- **Type**: `accessibility`
- **Difficulty**: Very Easy
- **Where to look**: `client/src/index.css`
- **Description**: Audit tab navigation and ensure all category tabs, like buttons, and cards display high-contrast visible focus rings when navigated via keyboard.
- **Expected behavior**: Visible 2px focus ring (`:focus-visible`) adhering to WCAG 2.4.7.
- **Acceptance criteria**:
  - [ ] Verify tab navigation across Home, Explore, and Post Detail pages
  - [ ] No missing focus states

---

### Issue #17: Add backend post validation boundary tests
- **Type**: `testing`
- **Difficulty**: Easy
- **Where to look**: `server/tests/posts.test.js`, `server/src/utils/validators.js`
- **Description**: Expand backend test coverage to test boundary conditions (e.g., exact 100 character title, exact 101 character title, empty whitespace titles).
- **Expected behavior**: Comprehensive test suite testing all validator boundaries.
- **Acceptance criteria**:
  - [ ] Add boundary test cases in `server/tests/posts.test.js`
  - [ ] All tests pass cleanly (`npm test`)

---

### Issue #18: Return structured field error maps from API validation
- **Type**: `enhancement`
- **Difficulty**: Medium
- **Where to look**: `server/src/utils/validators.js`, `server/src/middleware/errorMiddleware.js`
- **Description**: Update validator functions to return structured validation maps (e.g. `{ field: 'title', message: '...' }`) rather than single string messages.
- **Expected behavior**: The client can map server errors directly to input fields.
- **Acceptance criteria**:
  - [ ] Maintain backward compatibility with `{ success: false, message: '...' }`
  - [ ] Include optional `errors` array in response data

---

### Issue #19: Add frontend PostCard navigation tests
- **Type**: `testing`
- **Difficulty**: Easy
- **Where to look**: `client/tests/PostCard.test.jsx`
- **Description**: Add unit tests in `PostCard.test.jsx` verifying that clicking the author link points to the author's profile and clicking the post title points to the post detail route.
- **Expected behavior**: Explicit unit test assertions for post card links and interactions.
- **Acceptance criteria**:
  - [ ] Assert author profile link `href` attribute
  - [ ] Assert post title link `href` attribute

---

### Issue #20: Add GitHub Actions test coverage artifact upload
- **Type**: `CI`
- **Difficulty**: Medium
- **Where to look**: `.github/workflows/ci.yml`
- **Description**: Enhance the CI workflow to generate Vitest coverage reports and upload them as workflow artifacts.
- **Expected behavior**: CI generates and archives test coverage summaries on PRs and pushes.
- **Acceptance criteria**:
  - [ ] Add coverage reporting step to `ci.yml`
  - [ ] Upload coverage directory via `actions/upload-artifact@v4`
