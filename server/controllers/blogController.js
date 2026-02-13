/**
 * Blog Controller
 * Full-featured blog API endpoints
 */

const Blog = require('../models/Blog');

/**
 * Get all blog posts (admin)
 */
const getAllPosts = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            status, 
            search, 
            category,
            featured,
            sortBy = 'created_at',
            sortOrder = 'desc'
        } = req.query;

        const result = await Blog.findAll({
            page: parseInt(page),
            limit: parseInt(limit),
            status,
            search,
            category,
            featured,
            sortBy,
            sortOrder
        });

        res.json({
            success: true,
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        console.error('Get all posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch posts',
            error: error.message
        });
    }
};

/**
 * Get published blog posts (public)
 * Use ?preview=true to also show drafts for admin preview
 */
const getPublishedPosts = async (req, res) => {
    try {
        const { limit = 10, preview } = req.query;
        const posts = await Blog.findPublished(parseInt(limit), preview === 'true');
        
        res.json({
            success: true,
            data: posts
        });
    } catch (error) {
        console.error('Get published posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch posts',
            error: error.message
        });
    }
};

/**
 * Get single blog post by slug (public)
 * Use ?preview=true to also show drafts for admin preview
 */
const getPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const { preview } = req.query;
        const post = await Blog.findBySlug(slug, preview === 'true');

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Increment views (only for published posts, not preview)
        if (preview !== 'true') {
            await Blog.incrementViews(post.id);
        }

        res.json({
            success: true,
            data: post
        });
    } catch (error) {
        console.error('Get post by slug error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch post',
            error: error.message
        });
    }
};

/**
 * Get single blog post by ID (admin)
 */
const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Blog.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        res.json({
            success: true,
            data: post
        });
    } catch (error) {
        console.error('Get post by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch post',
            error: error.message
        });
    }
};

/**
 * Create new blog post
 */
const createPost = async (req, res) => {
    try {
        const postData = req.body;
        
        // Extract user ID from auth middleware
        const userId = req.user?.id || null;

        const post = await Blog.create({ ...postData, created_by: userId });

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: post
        });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create post',
            error: error.message
        });
    }
};

/**
 * Update blog post
 */
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const postData = req.body;
        
        // Extract user ID from auth middleware
        const userId = req.user?.id || null;

        const post = await Blog.update(id, postData, userId);

        res.json({
            success: true,
            message: 'Post updated successfully',
            data: post
        });
    } catch (error) {
        console.error('Update post error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update post',
            error: error.message
        });
    }
};

/**
 * Delete blog post
 */
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        
        await Blog.delete(id);

        res.json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete post',
            error: error.message
        });
    }
};

/**
 * Get categories
 */
const getCategories = async (req, res) => {
    try {
        const categories = await Blog.getAllCategories();
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
};

/**
 * Get tags
 */
const getTags = async (req, res) => {
    try {
        const tags = await Blog.getAllTags();
        res.json({
            success: true,
            data: tags
        });
    } catch (error) {
        console.error('Get tags error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tags',
            error: error.message
        });
    }
};

/**
 * Get post revisions
 */
const getRevisions = async (req, res) => {
    try {
        const { postId } = req.params;
        const revisions = await Blog.getRevisions(postId);
        
        res.json({
            success: true,
            data: revisions
        });
    } catch (error) {
        console.error('Get revisions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch revisions',
            error: error.message
        });
    }
};

/**
 * Restore revision
 */
const restoreRevision = async (req, res) => {
    try {
        const { postId, revisionId } = req.params;
        
        const post = await Blog.restoreRevision(postId, revisionId);

        res.json({
            success: true,
            message: 'Revision restored successfully',
            data: post
        });
    } catch (error) {
        console.error('Restore revision error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to restore revision',
            error: error.message
        });
    }
};

/**
 * Get blog analytics
 */
const getAnalytics = async (req, res) => {
    try {
        const analytics = await Blog.getAnalytics();
        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch analytics',
            error: error.message
        });
    }
};

/**
 * Get media library
 */
const getMedia = async (req, res) => {
    try {
        const { page = 1, limit = 20, search, type } = req.query;
        
        const result = await Blog.getMedia({
            page: parseInt(page),
            limit: parseInt(limit),
            search,
            type
        });

        res.json({
            success: true,
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        console.error('Get media error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch media',
            error: error.message
        });
    }
};

/**
 * Upload media (simplified - in production use multer + cloud storage)
 */
const uploadMedia = async (req, res) => {
    try {
        const { filename, originalName, mimeType, size, url } = req.body;
        
        const media = await Blog.uploadMedia({
            filename,
            original_name: originalName,
            mime_type: mimeType,
            size: parseInt(size),
            url,
            uploaded_by: req.user?.id || null
        });

        res.status(201).json({
            success: true,
            message: 'Media uploaded successfully',
            data: media
        });
    } catch (error) {
        console.error('Upload media error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload media',
            error: error.message
        });
    }
};

/**
 * Delete media
 */
const deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;
        
        await Blog.deleteMedia(id);

        res.json({
            success: true,
            message: 'Media deleted successfully'
        });
    } catch (error) {
        console.error('Delete media error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete media',
            error: error.message
        });
    }
};

/**
 * Get comments for a post
 */
const getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const { status = 'all' } = req.query;
        
        const comments = await Blog.getComments(postId, status);

        res.json({
            success: true,
            data: comments
        });
    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch comments',
            error: error.message
        });
    }
};

/**
 * Update comment status
 */
const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { status } = req.body;
        
        const comment = await Blog.updateCommentStatus(commentId, status);

        res.json({
            success: true,
            message: 'Comment updated successfully',
            data: comment
        });
    } catch (error) {
        console.error('Update comment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update comment',
            error: error.message
        });
    }
};

/**
 * Delete comment
 */
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        
        await Blog.deleteComment(commentId);

        res.json({
            success: true,
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete comment',
            error: error.message
        });
    }
};

module.exports = {
    getAllPosts,
    getPublishedPosts,
    getPostBySlug,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    getCategories,
    getTags,
    getRevisions,
    restoreRevision,
    getAnalytics,
    getMedia,
    uploadMedia,
    deleteMedia,
    getComments,
    updateComment,
    deleteComment
};
