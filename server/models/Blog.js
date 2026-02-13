/**
 * Blog Model
 * Full-featured blog posts database operations
 */

const { supabase } = require('../config/supabase');

/**
 * Create a new blog post
 */
const create = async (postData) => {
    const {
        title,
        slug,
        excerpt,
        content,
        content_html,
        author,
        category,
        tags,
        featured_image,
        status,
        meta_title,
        meta_description,
        focus_keyword,
        scheduled_at,
        allow_comments,
        is_featured,
        is_sticky,
        created_by
    } = postData;

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Check for duplicate slug and append number if needed
    let finalSlug = generatedSlug;
    let counter = 1;
    while (true) {
        const { data: existing } = await supabase
            .from('blog_posts')
            .select('id')
            .eq('slug', finalSlug)
            .maybeSingle();
        
        if (!existing) break;
        finalSlug = `${generatedSlug}-${counter}`;
        counter++;
    }
    
    // Handle published status and date
    const publishedAt = status === 'published' ? new Date().toISOString() : null;
    
    const { data, error } = await supabase
        .from('blog_posts')
        .insert([{
            title,
            slug: finalSlug,
            excerpt,
            content,
            content_html,
            author: author || 'Pan Logistics',
            category,
            tags: tags || [],
            featured_image,
            status: status || 'draft',
            published_at: publishedAt,
            scheduled_at: scheduled_at || null,
            allow_comments: allow_comments !== false,
            is_featured: is_featured || false,
            is_sticky: is_sticky || false,
            created_at: new Date().toISOString()
        }])
        .select()
        .single();

    if (error) {
        console.error('Create blog post error:', error);
        throw error;
    }

    return data;
};

/**
 * Find all blog posts with filtering and pagination
 */
const findAll = async (options = {}) => {
    const { 
        page = 1, 
        limit = 10, 
        status, 
        search, 
        category,
        featured,
        sortBy = 'created_at',
        sortOrder = 'desc'
    } = options;
    const offset = (page - 1) * limit;

    let query = supabase
        .from('blog_posts')
        .select('*', { count: 'exact' })
        .order(sortBy, { ascending: sortOrder === 'asc' });

    if (status && status !== 'all') {
        query = query.eq('status', status);
    }

    if (category && category !== 'all') {
        query = query.eq('category', category);
    }

    if (featured === 'true') {
        query = query.eq('is_featured', true);
    }

    if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    const { data, error, count } = await query
        .range(offset, offset + limit - 1)
        .select();

    if (error) {
        console.error('Find all blog posts error:', error);
        throw error;
    }

    return {
        data,
        pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit)
        }
    };
};

/**
 * Find blog posts by status (published - for public view)
 * @param {number} limit - Maximum number of posts to return
 * @param {boolean} featured - Only return featured posts
 * @param {boolean} preview - If true, return all posts including drafts (for admin preview)
 */
const findPublished = async (limit = 10, featured = false, preview = false) => {
    let query = supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });
    
    // If not in preview mode, only show published posts
    if (!preview) {
        query = query
            .eq('status', 'published')
            .lte('published_at', new Date().toISOString());
    }

    if (featured) {
        query = query.eq('is_featured', true);
    }

    const { data, error } = await query.limit(limit);

    if (error) {
        console.error('Find published posts error:', error);
        throw error;
    }

    return data;
};

/**
 * Find blog post by ID
 */
const findById = async (id) => {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Find blog post by ID error:', error);
        throw error;
    }

    return data;
};

/**
 * Find blog post by slug
 * @param {string} slug - The post slug
 * @param {boolean} preview - If true, return all posts including drafts
 */
const findBySlug = async (slug, preview = false) => {
    let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug);
    
    // If not in preview mode, only show published posts
    if (!preview) {
        query = query
            .eq('status', 'published')
            .lte('published_at', new Date().toISOString());
    }

    const { data, error } = await query.single();

    if (error) {
        console.error('Find blog post by slug error:', error);
        throw error;
    }

    return data;
};

/**
 * Update blog post with revision tracking
 */
const update = async (id, postData, userId = null) => {
    const {
        title,
        slug,
        excerpt,
        content,
        content_html,
        author,
        category,
        tags,
        featured_image,
        status,
        meta_title,
        meta_description,
        focus_keyword,
        scheduled_at,
        allow_comments,
        is_featured,
        is_sticky,
        change_summary
    } = postData;

    // Get current post for revision
    const currentPost = await findById(id);
    if (!currentPost) {
        throw new Error('Post not found');
    }

    // Create revision if content changed
    if (content && content !== currentPost.content) {
        await createRevision({
            post_id: id,
            title: currentPost.title,
            content: currentPost.content,
            content_html: currentPost.content_html,
            revision_number: (currentPost.revision_number || 0) + 1,
            changed_by: userId,
            change_summary
        });
    }

    // Handle status changes
    const publishedAt = status === 'published' && !currentPost.published_at 
        ? new Date().toISOString() 
        : currentPost.published_at;
    
    const updateData = {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content && { content }),
        ...(content_html !== undefined && { content_html }),
        ...(author && { author }),
        ...(category !== undefined && { category }),
        ...(tags !== undefined && { tags }),
        ...(featured_image !== undefined && { featured_image }),
        ...(status && { status }),
        ...(publishedAt && { published_at: publishedAt }),
        ...(content && { revision_number: (currentPost.revision_number || 0) + 1 }),
        updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Update blog post error:', error);
        throw error;
    }

    return data;
};

/**
 * Delete blog post
 */
const deletePost = async (id) => {
    const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Delete blog post error:', error);
        throw error;
    }

    return true;
};

/**
 * Increment post views count
 */
const incrementViews = async (id) => {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('views_count')
        .eq('id', id)
        .single();

    if (error) return;

    await supabase
        .from('blog_posts')
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq('id', id);
};

/**
 * Get all unique categories from posts
 */
const getCategories = async () => {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('category')
        .not('category', 'is', null);

    if (error) {
        console.error('Get categories error:', error);
        throw error;
    }

    const categories = [...new Set(data.map(item => item.category))];
    return categories.sort();
};

/**
 * Get all categories from categories table
 */
const getAllCategories = async () => {
    const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

    if (error) {
        console.error('Get all categories error:', error);
        throw error;
    }

    return data;
};

/**
 * Get all tags
 */
const getAllTags = async () => {
    const { data, error } = await supabase
        .from('blog_tags')
        .select('*')
        .order('name');

    if (error) {
        console.error('Get all tags error:', error);
        throw error;
    }

    return data;
};

/**
 * Create revision
 */
const createRevision = async (revisionData) => {
    const { data, error } = await supabase
        .from('blog_revisions')
        .insert([{
            ...revisionData,
            created_at: new Date().toISOString()
        }])
        .select()
        .single();

    if (error) {
        console.error('Create revision error:', error);
    }

    return data;
};

/**
 * Get revisions for a post
 */
const getRevisions = async (postId) => {
    const { data, error } = await supabase
        .from('blog_revisions')
        .select('*')
        .eq('post_id', postId)
        .order('revision_number', { ascending: false });

    if (error) {
        console.error('Get revisions error:', error);
        throw error;
    }

    return data;
};

/**
 * Restore a revision
 */
const restoreRevision = async (postId, revisionId) => {
    const revision = await supabase
        .from('blog_revisions')
        .select('*')
        .eq('id', revisionId)
        .single();

    if (revision.error || !revision.data) {
        throw new Error('Revision not found');
    }

    return update(postId, {
        title: revision.data.title,
        content: revision.data.content,
        content_html: revision.data.content_html,
        change_summary: `Restored from revision ${revision.data.revision_number}`
    });
};

/**
 * Get post analytics
 */
const getAnalytics = async () => {
    const { data: totalPosts } = await supabase
        .from('blog_posts')
        .select('id', { count: 'exact' });

    const { data: publishedPosts } = await supabase
        .from('blog_posts')
        .select('id', { count: 'exact' })
        .eq('status', 'published');

    const { data: draftPosts } = await supabase
        .from('blog_posts')
        .select('id', { count: 'exact' })
        .eq('status', 'draft');

    const { data: topPosts } = await supabase
        .from('blog_posts')
        .select('title, slug, views_count')
        .order('views_count', { ascending: false })
        .limit(5);

    const { data: totalViews } = await supabase
        .from('blog_posts')
        .select('views_count');

    const totalViewsCount = totalViews?.reduce((sum, p) => sum + (p.views_count || 0), 0) || 0;

    return {
        totalPosts: totalPosts?.length || 0,
        publishedPosts: publishedPosts?.length || 0,
        draftPosts: draftPosts?.length || 0,
        totalViews: totalViewsCount,
        topPosts: topPosts || []
    };
};

/**
 * Get media library
 */
const getMedia = async (options = {}) => {
    const { page = 1, limit = 20, search, type } = options;
    const offset = (page - 1) * limit;

    let query = supabase
        .from('blog_media')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

    if (search) {
        query = query.ilike('filename', `%${search}%`);
    }

    if (type) {
        query = query.like('mime_type', `${type}%`);
    }

    const { data, error, count } = await query
        .range(offset, offset + limit - 1)
        .select();

    if (error) {
        console.error('Get media error:', error);
        throw error;
    }

    return {
        data,
        pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit)
        }
    };
};

/**
 * Upload media
 */
const uploadMedia = async (mediaData) => {
    const { data, error } = await supabase
        .from('blog_media')
        .insert([{
            ...mediaData,
            created_at: new Date().toISOString()
        }])
        .select()
        .single();

    if (error) {
        console.error('Upload media error:', error);
        throw error;
    }

    return data;
};

/**
 * Delete media
 */
const deleteMedia = async (id) => {
    const { error } = await supabase
        .from('blog_media')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Delete media error:', error);
        throw error;
    }

    return true;
};

/**
 * Get comments for a post
 */
const getComments = async (postId, status = 'all') => {
    let query = supabase
        .from('blog_comments')
        .select('*')
        .eq('post_id', postId);

    if (status !== 'all') {
        query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
        console.error('Get comments error:', error);
        throw error;
    }

    return data;
};

/**
 * Update comment status
 */
const updateCommentStatus = async (commentId, status) => {
    const { data, error } = await supabase
        .from('blog_comments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', commentId)
        .select()
        .single();

    if (error) {
        console.error('Update comment status error:', error);
        throw error;
    }

    return data;
};

/**
 * Delete comment
 */
const deleteComment = async (commentId) => {
    const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', commentId);

    if (error) {
        console.error('Delete comment error:', error);
        throw error;
    }

    return true;
};

module.exports = {
    create,
    findAll,
    findPublished,
    findById,
    findBySlug,
    update,
    delete: deletePost,
    incrementViews,
    getCategories,
    getAllCategories,
    getAllTags,
    createRevision,
    getRevisions,
    restoreRevision,
    getAnalytics,
    getMedia,
    uploadMedia,
    deleteMedia,
    getComments,
    updateCommentStatus,
    deleteComment
};
