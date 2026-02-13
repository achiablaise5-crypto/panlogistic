-- ===========================================
-- Pan Logistics - Full Blog Schema
-- Includes: Posts, Categories, Tags, Revisions, Media, Comments
-- ===========================================

-- Create blog_posts table with full features
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    content_html TEXT,
    author TEXT DEFAULT 'Pan Logistics',
    category TEXT,
    tags TEXT[],
    featured_image TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'scheduled')),
    published_at TIMESTAMP WITH TIME ZONE,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    
    -- SEO Fields
    meta_title TEXT,
    meta_description TEXT,
    focus_keyword TEXT,
    
    -- Analytics
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    
    -- Social Media
    social_image TEXT,
    
    -- Settings
    allow_comments BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_sticky BOOLEAN DEFAULT FALSE,
    
    -- Revision tracking
    revision_number INTEGER DEFAULT 1,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES blog_categories(id),
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_tags table
CREATE TABLE IF NOT EXISTS blog_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT UNIQUE NOT NULL,
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_revisions table for version history
CREATE TABLE IF NOT EXISTS blog_revisions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    content_html TEXT,
    revision_number INTEGER NOT NULL,
    changed_by UUID,
    change_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_media table for media library
CREATE TABLE IF NOT EXISTS blog_media (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT,
    size INTEGER,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    alt_text TEXT,
    caption TEXT,
    uploaded_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_comments table
CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES blog_comments(id),
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    author_url TEXT,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam', 'trash')),
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created ON blog_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_views ON blog_posts(views_count);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(is_featured);

CREATE INDEX IF NOT EXISTS idx_blog_revisions_post ON blog_revisions(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON blog_comments(status);

-- Insert default categories
INSERT INTO blog_categories (name, slug, description) VALUES
    ('Company News', 'company-news', 'Updates and announcements from Pan Logistics'),
    ('Industry Insights', 'industry-insights', 'Analysis and trends from the logistics industry'),
    ('Shipping Tips', 'shipping-tips', 'Helpful tips for shipping and freight'),
    ('Case Studies', 'case-studies', 'Success stories and customer experiences')
ON CONFLICT (name) DO NOTHING;

-- Insert default tags
INSERT INTO blog_tags (name, slug) VALUES
    ('Logistics', 'logistics'),
    ('Shipping', 'shipping'),
    ('Freight', 'freight'),
    ('Supply Chain', 'supply-chain'),
    ('Warehousing', 'warehousing'),
    ('Air Freight', 'air-freight'),
    ('Sea Freight', 'sea-freight'),
    ('International', 'international'),
    ('Customs', 'customs'),
    ('Tips', 'tips')
ON CONFLICT (name) DO NOTHING;

-- ===========================================
-- Supabase Dashboard Setup Instructions:
-- ===========================================
-- 1. Go to https://uchxmnhvonilorpuogab.supabase.co
-- 2. Login to your Supabase account
-- 3. Go to SQL Editor
-- 4. Copy and paste this entire file
-- 5. Run the query
-- 6. Tables will be created automatically
