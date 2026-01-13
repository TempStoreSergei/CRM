// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  position?: string;
  department?: string;
  level?: 'Junior' | 'Middle' | 'Senior' | 'Lead';
  location?: string;
  birthday?: string;
  skype?: string;
  role: 'admin' | 'manager' | 'employee';
  status: 'active' | 'inactive' | 'on_vacation' | 'sick_leave';
  createdAt: string;
  updatedAt: string;
}

export interface UserWorkload {
  backlogTasks: number;
  inProgressTasks: number;
  inReviewTasks: number;
}

export interface Employee extends User {
  workload: UserWorkload;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
  agent: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface SignUpRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  agent: string;
}

// Project types
export interface Project {
  id: string;
  code: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'archived';
  progress: number;
  startDate?: string;
  endDate?: string;
  team: ProjectMember[];
  tasksCount: {
    total: number;
    completed: number;
    inProgress: number;
    backlog: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  position?: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  teamMembers?: string[];
}

// Task types
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'in_progress' | 'in_review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  project?: {
    id: string;
    name: string;
    code: string;
  };
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  reporter?: {
    id: string;
    name: string;
  };
  dueDate?: string;
  estimatedHours?: number;
  loggedHours?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  projectId?: string;
  assigneeId?: string;
  priority?: Task['priority'];
  dueDate?: string;
  estimatedHours?: number;
  tags?: string[];
}

// Event types
export interface Event {
  id: string;
  title: string;
  description?: string;
  type: 'meeting' | 'deadline' | 'reminder' | 'holiday';
  startDate: string;
  endDate: string;
  allDay: boolean;
  location?: string;
  participants: EventParticipant[];
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface EventParticipant {
  id: string;
  name: string;
  avatar?: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  type: Event['type'];
  startDate: string;
  endDate: string;
  allDay?: boolean;
  location?: string;
  participantIds?: string[];
  reminders?: {
    type: 'email' | 'push';
    minutesBefore: number;
  }[];
}

// Vacation types
export interface Vacation {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    position?: string;
  };
  type: 'annual' | 'sick' | 'unpaid' | 'maternity';
  startDate: string;
  endDate: string;
  totalDays: number;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  approvedBy?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface CreateVacationRequest {
  type: Vacation['type'];
  startDate: string;
  endDate: string;
  reason?: string;
}

// Conversation & Message types
export interface Conversation {
  id: string;
  type: 'group' | 'direct';
  name?: string;
  avatar?: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
    status?: 'online' | 'offline';
  }[];
  lastMessage?: {
    id: string;
    content: string;
    sender?: { id: string; name: string };
    timestamp: string;
  };
  unreadCount: number;
}

export interface Message {
  id: string;
  content: string;
  type: 'text' | 'file' | 'image';
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  readBy?: string[];
  createdAt: string;
}

// Notification types
export interface Notification {
  id: string;
  type: 'task_assigned' | 'event_reminder' | 'vacation_approved' | 'message_received';
  title: string;
  message: string;
  data?: {
    entityType: 'task' | 'event' | 'vacation' | 'message';
    entityId: string;
  };
  read: boolean;
  createdAt: string;
}

// Analytics types
export interface DashboardAnalytics {
  projects: {
    total: number;
    active: number;
    completed: number;
  };
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
  };
  team: {
    totalEmployees: number;
    onVacation: number;
    onSickLeave: number;
  };
  upcomingEvents: {
    id: string;
    title: string;
    date: string;
  }[];
  recentActivity: {
    id: string;
    type: string;
    description: string;
    user: { id: string; name: string };
    timestamp: string;
  }[];
}

// Pagination types
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
