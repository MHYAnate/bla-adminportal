// export interface SupportRequest {
//   id: number;
//   supportId?: string;
//   status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
//   priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
//   category?: string;
//   title?: string;
//   subject?: string;
//   description?: string;
//   message?: string;
//   createdAt: string;
//   updatedAt?: string;
//   resolvedAt?: string;
//   assignedAdminId?: number;
//   resolutionChannel?: 'CALL' | 'EMAIL' | 'CHAT' | 'IN_PERSON';
//   internalNotes?: string;
//   resolutionDetails?: string;
//   hasInternalNotes?: boolean;
//   customer?: {
//     name?: string;
//     email?: string;
//     phone?: string;
//     type?: string;
//   };
//   user?: {
//     id: number;
//     email: string;
//     type: string;
//     profile?: {
//       fullName?: string;
//     };
//     businessProfile?: {
//       businessName?: string;
//     };
//   };
//   assignedAdmin?: {
//     id?: number;
//     name?: string;
//     profile?: {
//       fullName?: string;
//     };
//   };
//   timeline?: TimelineEntry[];
// }

// export interface TimelineEntry {
//   id: number;
//   fromStatus: string;
//   toStatus: string;
//   notes?: string;
//   createdAt: string;
//   admin?: {
//     adminProfile?: {
//       fullName?: string;
//     };
//   };
// }

// export interface Admin {
//   id: number;
//   email: string;
//   fullName: string;
//   role: string;
//   roles?: Array<{
//     role: {
//       name: string;
//     };
//   }>;
// }

// export interface StatusUpdateData {
//   status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
//   resolutionDetails?: string;
// }

// export interface TrackingUpdateData {
//   assignedAdminId?: number;
//   resolutionChannel?: 'CALL' | 'EMAIL' | 'CHAT' | 'IN_PERSON';
//   internalNotes: string;
// }

// export interface SupportRequest {
//   id: number;
//   supportId?: string;
//   status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
//   priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
//   category?: string;
//   title?: string;
//   subject?: string;
//   description?: string;
//   message?: string;
//   createdAt: string;
//   updatedAt?: string;
//   resolvedAt?: string;
//   assignedAdminId?: number;
//   resolutionChannel?: 'CALL' | 'EMAIL' | 'CHAT' | 'IN_PERSON';
//   internalNotes?: string;
//   resolutionDetails?: string;
//   hasInternalNotes?: boolean;
//   customer?: {
//     name?: string;
//     email?: string;
//     phone?: string;
//     type?: string;
//   };
//   user?: {
//     id: number;
//     email: string;
//     type: string;
//     profile?: {
//       fullName?: string;
//     };
//     businessProfile?: {
//       businessName?: string;
//     };
//   };
//   assignedAdmin?: {
//     id?: number;
//     name?: string;
//     profile?: {
//       fullName?: string;
//     };
//   };
//   timeline?: TimelineEntry[];
// }

// export interface TimelineEntry {
//   id: number;
//   fromStatus: string;
//   toStatus: string;
//   notes?: string;
//   createdAt: string;
//   admin?: {
//     adminProfile?: {
//       fullName?: string;
//     };
//   };
// }

// export interface Admin {
//   id: number;
//   email: string;
//   fullName: string;
//   role: string;
//   roles?: Array<{
//     role: {
//       name: string;
//     };
//   }>;
// }

// export interface StatusUpdateData {
//   status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
//   resolutionDetails?: string;
// }

// export interface TrackingUpdateData {
//   assignedAdminId?: number | null;
//   resolutionChannel?: 'CALL' | 'EMAIL' | 'CHAT' | 'IN_PERSON';
//   internalNotes: string;
// }

export interface SupportRequest {
  id: number;
  supportId?: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category?: string;
  title?: string;
  subject?: string;
  description?: string;
  message?: string;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  assignedAdminId?: number;
  resolutionChannel?: 'CALL' | 'EMAIL' | 'CHAT' | 'IN_PERSON';
  internalNotes?: string;
  resolutionDetails?: string;
  hasInternalNotes?: boolean;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    type?: string;
  };
  user?: {
    id: number;
    email: string;
    type: string;
    profile?: {
      fullName?: string;
    };
    businessProfile?: {
      businessName?: string;
    };
  };
  assignedAdmin?: {
    id?: number;
    name?: string;
    profile?: {
      fullName?: string;
    };
  };
  timeline?: TimelineEntry[];
}

export interface TimelineEntry {
  id: number;
  fromStatus: string;
  toStatus: string;
  notes?: string;
  createdAt: string;
  admin?: {
    adminProfile?: {
      fullName?: string;
    };
  };
}

export interface Admin {
  id: number;
  email: string;
  fullName: string;
  role: string;
  roles?: Array<{
    role: {
      name: string;
    };
  }>;
}

export interface StatusUpdateData {
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
  resolutionDetails?: string;
}

export interface TrackingUpdateData {
  assignedAdminId?: number;
  resolutionChannel?: 'CALL' | 'EMAIL' | 'CHAT' | 'IN_PERSON';
  internalNotes?: string;
}