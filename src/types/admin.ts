export interface Permission {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions?: Permission[];
}

export interface AdminRole {
  id?: number;
  role?: {
    id: number;
    name: string;
    description: string;
    permissions?: Permission[];
  };
  name?: string; // For flat structure compatibility
  description?: string; // Added for flat structure compatibility
  permissions?: Permission[]; // Added for flat structure compatibility
}

export interface AdminProfile {
  id: number;
  userId: number;
  fullName: string;
  username: string;
  gender: string | null;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: number;
  email: string;
  fullName: string;
  username: string;
  role: string;
  createdAt: string;
  adminStatus: string;
  status?: string; // Optional for backward compatibility
  lastLogin?: string; // Optional field
  phone: string;
  gender: string;
  permissionCount: number;
  adminProfile: AdminProfile;
  roles: AdminRole[];
}

export interface UpdateRolesResponse {
  success?: boolean;
  data?: any;
  message?: string;
}