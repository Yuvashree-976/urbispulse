
export type ComplaintStatus = 'Submitted' | 'Under Review' | 'Assigned' | 'In Progress' | 'Resolved';
export type UserRole = 'Citizen' | 'Ward Member' | 'Admin';

export interface Complaint {
  id: string;
  title: string;
  category: string;
  description: string;
  status: ComplaintStatus;
  date: string;
  location: string;
  lat?: number; // For proper heatmap
  lng?: number; // For proper heatmap
  upvotes: number;
  isAnonymous: boolean;
  severity: 'Low' | 'Medium' | 'High';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  ward?: string;
  department?: string;
  trustScore: number;
  points: number;
  badges: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  time: string;
  read: boolean;
}
