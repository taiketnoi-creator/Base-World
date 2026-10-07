export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'failed';
export type Scope = 'family' | 'private';
export type MemberRole = 'admin' | 'member';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Family {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  created_at: string;
}

export interface FamilyMember {
  id: string;
  family_id: string;
  user_id: string;
  role: MemberRole;
  nickname: string | null;
  joined_at: string;
  profiles?: Profile;
}

export interface Project {
  id: string;
  family_id: string;
  name: string;
  description: string | null;
  color: string;
  icon: string;
  scope: Scope;
  created_by: string;
  created_at: string;
}

export interface Task {
  id: string;
  family_id: string;
  project_id: string | null;
  parent_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  scope: Scope;
  failed_reason?: string | null;
  start_date?: string | null;
  due_date?: string | null;
  estimated_minutes: number;
  actual_minutes: number;
  tags: string[];
  assigned_to?: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  assigned_profile?: Profile;
  checklists?: TaskChecklist[];
}

export interface TaskChecklist {
  id: string;
  task_id: string;
  title: string;
  is_completed: boolean;
  position: number;
  created_at: string;
}

export interface FinanceItem {
  id: string;
  family_id: string;
  type: 'expense' | 'income';
  category: string;
  amount: number;
  date: string;
  note: string | null;
  receipt_url?: string | null;
  scope: Scope;
  created_by: string;
  created_at: string;
}

export interface Goal {
  id: string;
  family_id: string;
  title: string;
  description: string | null;
  period: 'year' | 'quarter' | 'month';
  scope: Scope;
  progress: number;
  created_by: string;
  created_at: string;
  key_results?: KeyResult[];
}

export interface KeyResult {
  id: string;
  goal_id: string;
  title: string;
  current_value: number;
  target_value: number;
  unit: string;
  created_at: string;
}

export interface RequestItem {
  id: string;
  family_id: string;
  title: string;
  category: 'shopping' | 'repair' | 'idea' | 'other';
  content: string | null;
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected';
  scope: Scope;
  created_by: string;
  created_at: string;
}

export interface WikiPage {
  id: string;
  family_id: string;
  parent_id: string | null;
  title: string;
  content: string;
  icon: string;
  scope: Scope;
  created_by: string;
  created_at: string;
  updated_at: string;
}
