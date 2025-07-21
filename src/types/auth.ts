export type UserRole = 'admin' | 'workspace-admin' | 'workspace-member';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  workspaces: string[];
  activeWorkspace?: string;
  avatar?: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  adminIds: string[];
  memberIds: string[];
  documentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchWorkspace: (workspaceId: string) => void;
}