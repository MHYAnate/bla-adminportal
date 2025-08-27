export const SUPPORT_STATUSES = [
  { value: 'NEW', label: 'New', description: 'New support request' },
  { value: 'IN_PROGRESS', label: 'In Progress', description: 'Being worked on' },
  { value: 'RESOLVED', label: 'Resolved', description: 'Issue resolved' }
] as const;

export const RESOLUTION_CHANNELS = [
  { value: 'CALL', label: 'Phone Call' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'CHAT', label: 'Live Chat' },
  { value: 'IN_PERSON', label: 'In Person' }
] as const;

export const PRIORITY_LEVELS = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' }
] as const;

// Status transition rules matching backend controller
// export const STATUS_TRANSITIONS = {
//   'NEW': ['IN_PROGRESS', 'RESOLVED'],
//   'IN_PROGRESS': ['RESOLVED'],
//   'RESOLVED': [] // No transitions from resolved
// } as const;

export type SupportStatus = (typeof SUPPORT_STATUSES)[number]['value'];

export const STATUS_TRANSITIONS: Record<SupportStatus, SupportStatus[]> = {
  NEW: ['IN_PROGRESS', 'RESOLVED'],
  IN_PROGRESS: ['RESOLVED'],
  RESOLVED: []
};

export const isValidStatusTransition = (
  fromStatus: SupportStatus,
  toStatus: SupportStatus
): boolean => {
  return STATUS_TRANSITIONS[fromStatus]?.includes(toStatus) || false;
};

// export const isValidStatusTransition = (
//   fromStatus: SupportStatus,
//   toStatus: SupportStatus
// ): boolean => {
//   return STATUS_TRANSITIONS[fromStatus]?.includes(toStatus) || false;
// };

export const getStatusBadgeColor = (status: string): string => {
  switch (status) {
    case 'NEW':
      return 'bg-blue-100 text-blue-800';
    case 'IN_PROGRESS':
      return 'bg-yellow-100 text-yellow-800';
    case 'RESOLVED':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getPriorityBadgeColor = (priority: string): string => {
  switch (priority) {
    case 'URGENT':
      return 'bg-red-100 text-red-800';
    case 'HIGH':
      return 'bg-orange-100 text-orange-800';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800';
    case 'LOW':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};