export const CUSTOMER_STATUSES = {
  ACTIVE: {
    value: 'ACTIVE',
    label: 'Active',
    color: 'success',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    badgeVariant: 'success' as const,
    description: 'Customer account is active and in good standing'
  },
  INACTIVE: {
    value: 'INACTIVE',
    label: 'Inactive',
    color: 'tertiary',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    badgeVariant: 'tertiary' as const,
    description: 'Customer account is temporarily inactive'
  },
  FLAGGED: {
    value: 'FLAGGED',
    label: 'Flagged',
    color: 'destructive',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    badgeVariant: 'destructive' as const,
    description: 'Customer account has been flagged for review'
  },
  UNDER_REVIEW: {
    value: 'UNDER_REVIEW',
    label: 'Under Review',
    color: 'warning',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    badgeVariant: 'warning' as const,
    description: 'Customer account is currently under review'
  }
} as const;

export type CustomerStatus = keyof typeof CUSTOMER_STATUSES;

export const getStatusConfig = (status: string) => {
  const upperStatus = status?.toUpperCase() as CustomerStatus;
  return CUSTOMER_STATUSES[upperStatus] || CUSTOMER_STATUSES.INACTIVE;
};

export const getStatusBadgeVariant = (status: string) => {
  const config = getStatusConfig(status);
  return config.badgeVariant;
};

export const getStatusBadgeClass = (status: string) => {
  const config = getStatusConfig(status);
  return `${config.bgColor} ${config.textColor} px-3 py-1 rounded-lg text-sm font-semibold`;
};

export const getAllowedStatusTransitions = (currentStatus: string): CustomerStatus[] => {
  const transitions: Record<CustomerStatus, CustomerStatus[]> = {
    ACTIVE: ['INACTIVE', 'FLAGGED', 'UNDER_REVIEW'],
    INACTIVE: ['ACTIVE', 'FLAGGED', 'UNDER_REVIEW'],
    FLAGGED: ['ACTIVE', 'INACTIVE', 'UNDER_REVIEW'],
    UNDER_REVIEW: ['ACTIVE', 'INACTIVE', 'FLAGGED']
  };
  
  const upperStatus = currentStatus?.toUpperCase() as CustomerStatus;
  return transitions[upperStatus] || [];
};

export const getStatusDisplayName = (status: string) => {
  return getStatusConfig(status).label;
};

export const requiresReasonForStatusChange = (fromStatus: string, toStatus: string) => {
  // Require reason when flagging or putting under review
  return ['FLAGGED', 'UNDER_REVIEW'].includes(toStatus.toUpperCase());
};

export const getStatusColor = (status: string) => {
  const config = getStatusConfig(status);
  return config.color;
};

// Helper function to normalize status values from API
export const normalizeStatus = (status: string | undefined | null): CustomerStatus => {
  if (!status) return 'INACTIVE';
  const upperStatus = status.toUpperCase() as CustomerStatus;
  return Object.keys(CUSTOMER_STATUSES).includes(upperStatus) ? upperStatus : 'INACTIVE';
};