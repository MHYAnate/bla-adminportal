// types/admin.ts
export interface Permission {
  id: number;
  name: string;
  description?: string;
  category?: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  type?: string; // 'ADMIN' | 'SUPER_ADMIN' | 'USER' | 'INDIVIDUAL' | 'BUSINESS'
  permissions?: Permission[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminRole {
  id?: number;
  roleId?: number;
  adminId?: number;
  name?: string;
  description?: string;
  permissions?: Permission[];
  role?: Role;
  assignedAt?: string;
}

export interface AdminProfile {
  username?: string;
  fullName?: string;
  phone?: string;
  gender?: string;
  avatar?: string;
}

export interface Admin {
  id: number | string;
  email: string;
  username?: string;
  fullName?: string;
  phone?: string;
  gender?: string;
  status?: string;
  adminStatus?: string;
  type?: 'ADMIN' | 'SUPER_ADMIN' | 'USER';
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  canInviteAdmins?: boolean;
  roles?: AdminRole[];
  permissions?: Permission[];
  permissionCount?: number;
  adminProfile?: AdminProfile;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
  invitationStatus?: 'COMPLETED' | 'PENDING' | 'EXPIRED' | 'CANCELLED';
  nextStep?: string;
  requiresAddress?: boolean;
  hasAddress?: boolean;
}

export interface UpdateRolesResponse {
  success: boolean;
  message: string;
  data?: {
    admin: Admin;
    updatedRoles: Role[];
  };
}

export interface InvitationResponse {
  success: boolean;
  message: string;
  data: {
    invitationId: string;
    email: string;
    role: string;
    roleId: number;
    expiresAt: string;
    invitationUrl?: string;
  };
  invitationUrl?: string;
}

export interface PendingInvitation {
  id: string;
  email: string;
  roleId: number;
  status: 'PENDING' | 'RESENT' | 'EXPIRED' | 'CANCELLED';
  expiresAt: string;
  createdAt: string;
  role: Role;
  invitedBy: {
    id: number;
    email: string;
  };
}