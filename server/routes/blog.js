/**
 * Blog Routes
 * Full-featured blog management endpoints
 */

const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { authenticate, isStaff } = require('../middleware/auth');

// ======================
// Public routes
// ======================

// Get published posts (public)
// Use ?preview=true to also show drafts for admin preview
router.get('/', blogController.getPublishedPosts);

// Get single post by slug (public)
router.get('/post/:slug', blogController.getPostBySlug);

// Get categories (public)
router.get('/categories', blogController.getCategories);

// Get tags (public)
router.get('/tags', blogController.getTags);

// ======================
// Protected routes - admin/staff only
// ======================

// Get all posts with filters (admin)
router.get('/admin/posts', authenticate, isStaff, blogController.getAllPosts);

// Get single post by ID (admin)
router.get('/admin/post/:id', authenticate, isStaff, blogController.getPostById);

// Create new post
router.post('/admin/posts', authenticate, isStaff, blogController.createPost);

// Update post
router.put('/admin/posts/:id', authenticate, isStaff, blogController.updatePost);

// Delete post
router.delete('/admin/posts/:id', authenticate, isStaff, blogController.deletePost);

// Get post revisions
router.get('/admin/posts/:postId/revisions', authenticate, isStaff, blogController.getRevisions);

// Restore revision
router.post('/admin/posts/:postId/revisions/:revisionId/restore', authenticate, isStaff, blogController.restoreRevision);

// Get blog analytics
router.get('/admin/analytics', authenticate, isStaff, blogController.getAnalytics);

// ======================
// Media Library Routes
// ======================

// Get media library
router.get('/admin/media', authenticate, isStaff, blogController.getMedia);

// Upload media
router.post('/admin/media', authenticate, isStaff, blogController.uploadMedia);

// Delete media
router.delete('/admin/media/:id', authenticate, isStaff, blogController.deleteMedia);

// ======================
// Comments Routes
// ======================

// Get comments for a post
router.get('/admin/posts/:postId/comments', authenticate, isStaff, blogController.getComments);

// Update comment status
router.put('/admin/comments/:commentId', authenticate, isStaff, blogController.updateComment);

// Delete comment
router.delete('/admin/comments/:commentId', authenticate, isStaff, blogController.deleteComment);

module.exports = router;
