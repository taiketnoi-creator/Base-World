-- =============================================================================
-- BASE WORLD - SUPABASE DATABASE SCHEMA (POSTGRESQL)
-- Hệ điều hành Quản trị Công việc, Quy trình, Mục tiêu & Tài chính Cá nhân/Gia đình
-- Sẵn sàng chạy trong Supabase SQL Editor
-- =============================================================================

-- 1. BẬT EXTENSIONS CẦN THIẾT
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 2. HỆ THỐNG GIA ĐÌNH & THÀNH VIÊN (FAMILY & AUTH PROFILES)
-- =============================================================================

-- Bảng Hồ sơ Người dùng (Đồng bộ với auth.users của Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bảng Nhóm Gia đình (Family Workspace)
CREATE TABLE IF NOT EXISTS public.families (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    invite_code TEXT UNIQUE DEFAULT substring(md5(random()::text) from 1 for 8),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bảng Thành viên Gia đình (Phân quyền Admin vs Member)
CREATE TABLE IF NOT EXISTS public.family_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member' NOT NULL,
    nickname TEXT,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(family_id, user_id)
);

-- =============================================================================
-- 3. MODULE WORK+ (DỰ ÁN & CÔNG VIỆC)
-- =============================================================================

-- Bảng Dự án / Không gian gom nhóm
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3b82f6',
    icon TEXT DEFAULT 'folder',
    scope TEXT CHECK (scope IN ('family', 'private')) DEFAULT 'family' NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bảng Công việc (Tasks)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    parent_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('todo', 'in_progress', 'review', 'done', 'failed')) DEFAULT 'todo' NOT NULL,
    priority TEXT CHECK (priority IN ('urgent', 'high', 'medium', 'low')) DEFAULT 'medium' NOT NULL,
    scope TEXT CHECK (scope IN ('family', 'private')) DEFAULT 'family' NOT NULL,
    failed_reason TEXT,
    start_date DATE,
    due_date DATE,
    estimated_minutes INTEGER DEFAULT 0,
    actual_minutes INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}'::jsonb,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bảng Checklist con trong Task
CREATE TABLE IF NOT EXISTS public.task_checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT false NOT NULL,
    position INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================================================
-- 4. MODULE FLOW+ (QUY TRÌNH TUẦN TỰ & LẶP LẠI)
-- =============================================================================

-- Định nghĩa Quy trình mẫu
CREATE TABLE IF NOT EXISTS public.workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_recurring BOOLEAN DEFAULT false NOT NULL,
    recurring_rule TEXT, -- e.g. "every Monday", "monthly_25"
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Các giai đoạn (Stages) trong quy trình
CREATE TABLE IF NOT EXISTS public.workflow_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES public.workflows(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    position INTEGER DEFAULT 0 NOT NULL,
    sla_hours INTEGER DEFAULT 24,
    required_checklists TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Thực thi một quy trình cụ thể (Workflow Runs)
CREATE TABLE IF NOT EXISTS public.workflow_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES public.workflows(id) ON DELETE CASCADE NOT NULL,
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    current_stage_id UUID REFERENCES public.workflow_stages(id) ON DELETE SET NULL,
    status TEXT CHECK (status IN ('active', 'completed', 'canceled')) DEFAULT 'active' NOT NULL,
    stage_data JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================================================
-- 5. MODULE CAPTURE+ (ĐỀ XUẤT & GHI NHẬN NHANH)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    category TEXT CHECK (category IN ('shopping', 'repair', 'idea', 'other')) DEFAULT 'shopping' NOT NULL,
    content TEXT,
    status TEXT CHECK (status IN ('pending', 'approved', 'in_progress', 'completed', 'rejected')) DEFAULT 'pending' NOT NULL,
    scope TEXT CHECK (scope IN ('family', 'private')) DEFAULT 'family' NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================================================
-- 6. MODULE GOAL+ (MỤC TIÊU & OKRs)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    period TEXT CHECK (period IN ('year', 'quarter', 'month')) DEFAULT 'quarter' NOT NULL,
    scope TEXT CHECK (scope IN ('family', 'private')) DEFAULT 'family' NOT NULL,
    progress INTEGER DEFAULT 0 NOT NULL, -- 0 - 100%
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.key_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    current_value NUMERIC DEFAULT 0 NOT NULL,
    target_value NUMERIC DEFAULT 100 NOT NULL,
    unit TEXT DEFAULT '%',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================================================
-- 7. MODULE WIKI+ (KHO TRI THỨC & GHI CHÚ GIA ĐÌNH)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.wiki_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
    parent_id UUID REFERENCES public.wiki_pages(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT DEFAULT '',
    icon TEXT DEFAULT 'file-text',
    scope TEXT CHECK (scope IN ('family', 'private')) DEFAULT 'family' NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================================================
-- 8. MODULE FINANCE+ (THU CHI & NGÂN SÁCH GIA ĐÌNH)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.finances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
    type TEXT CHECK (type IN ('expense', 'income')) NOT NULL,
    category TEXT NOT NULL, -- Ăn uống, Điện nước, Học phí, Lương, Đầu tư...
    amount NUMERIC(15, 2) NOT NULL,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    note TEXT,
    receipt_url TEXT,
    scope TEXT CHECK (scope IN ('family', 'private')) DEFAULT 'family' NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
    category TEXT NOT NULL,
    monthly_limit NUMERIC(15, 2) NOT NULL,
    month_year TEXT NOT NULL, -- e.g. "2026-10"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(family_id, category, month_year)
);

-- =============================================================================
-- 9. TỰ ĐỘNG TẠO PROFILE KHI ĐĂNG KÝ USER MỚI QUA SUPABASE AUTH
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.key_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wiki_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Hàm trợ giúp: Kiểm tra user có thuộc family hay không
CREATE OR REPLACE FUNCTION public.is_family_member(fid UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.family_members
        WHERE family_id = fid AND user_id = auth.uid()
    );
$$ LANGUAGE sql SECURITY DEFINER;

-- Chính sách Profiles: Xem mọi profile, chỉ sửa chính mình
CREATE POLICY "Public profiles are viewable by authenticated users" 
ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Chính sách Families & Members
CREATE POLICY "Members can view their families" 
ON public.families FOR SELECT TO authenticated USING (public.is_family_member(id));

CREATE POLICY "Users can create families" 
ON public.families FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Family members list visible to members" 
ON public.family_members FOR SELECT TO authenticated USING (public.is_family_member(family_id));

-- Chính sách Tasks (Hỗ trợ scope: 'private' vs 'family')
CREATE POLICY "Tasks visibility policy" 
ON public.tasks FOR SELECT TO authenticated USING (
    public.is_family_member(family_id) AND (
        scope = 'family' OR created_by = auth.uid() OR assigned_to = auth.uid()
    )
);

CREATE POLICY "Tasks modify policy" 
ON public.tasks FOR ALL TO authenticated USING (
    public.is_family_member(family_id)
);

-- Chính sách Finances (Hỗ trợ scope: 'private' vs 'family')
CREATE POLICY "Finances visibility policy" 
ON public.finances FOR SELECT TO authenticated USING (
    public.is_family_member(family_id) AND (
        scope = 'family' OR created_by = auth.uid()
    )
);

CREATE POLICY "Finances modify policy" 
ON public.finances FOR ALL TO authenticated USING (
    public.is_family_member(family_id)
);
