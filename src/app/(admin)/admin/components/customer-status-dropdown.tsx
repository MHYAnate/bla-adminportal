// src/components/customer-status-dropdown.tsx
"use client";

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronDown, AlertTriangle } from 'lucide-react';
import { useUpdateCustomerStatus } from '@/services/customers';

// Status configuration
const CUSTOMER_STATUSES = {
    ACTIVE: {
        value: 'ACTIVE',
        label: 'Active',
        color: 'success',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        description: 'Customer account is active and in good standing'
    },
    INACTIVE: {
        value: 'DEACTIVATE',
        label: 'Deactivate',
        color: 'tertiary',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        description: 'Customer account is temporarily inactive'
    },
    FLAGGED: {
        value: 'FLAGGED',
        label: 'Flagged',
        color: 'destructive',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        description: 'Customer account has been flagged for review'
    },
    UNDER_REVIEW: {
        value: 'UNDER_REVIEW',
        label: 'Under Review',
        color: 'warning',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-800',
        description: 'Customer account is currently under review'
    }
};

interface CustomerStatusDropdownProps {
    customer: {
        id: string | number; // Required - we should check for this before using the component
        status?: string | number;
        customerStatus?: string | number;
        email?: string; // Keep as string only
        name?: string;  // Keep as string only
    };
    onStatusUpdate?: (customerId: string | number, newStatus: string) => void;
    disabled?: boolean;
}

export const CustomerStatusDropdown: React.FC<CustomerStatusDropdownProps> = ({
    customer,
    onStatusUpdate,
    disabled = false
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [reason, setReason] = useState('');

    const { updateCustomerStatus, isUpdating } = useUpdateCustomerStatus();

    // Get current status - handle both field names and ensure it's a string
    const currentStatus = String(customer?.customerStatus || customer?.status || 'INACTIVE').toUpperCase();
    const currentStatusConfig = CUSTOMER_STATUSES[currentStatus as keyof typeof CUSTOMER_STATUSES] || CUSTOMER_STATUSES.INACTIVE;

    // Get available status transitions (exclude current status)
    const availableStatuses = Object.keys(CUSTOMER_STATUSES).filter(
        status => status !== currentStatus
    );

    const handleStatusSelect = async (newStatus: string) => {
        setSelectedStatus(newStatus);

        // For FLAGGED and UNDER_REVIEW, show dialog to get reason
        if (['FLAGGED', 'UNDER_REVIEW'].includes(newStatus)) {
            setIsDialogOpen(true);
        } else {
            // Update immediately for ACTIVE/INACTIVE
            await handleStatusUpdate(newStatus, '');
        }
    };

    const handleStatusUpdate = async (status: string, reasonText: string) => {
        try {
            // Ensure customer ID is converted to appropriate type for API
            const customerId = customer.id;
            await updateCustomerStatus(customerId, status, reasonText);

            setIsDialogOpen(false);
            setReason('');
            setSelectedStatus('');

            // Call parent callback if provided
            onStatusUpdate?.(customerId, status);

        } catch (error) {
            console.error('Failed to update customer status:', error);
        }
    };

    const handleDialogSubmit = () => {
        if (['FLAGGED', 'UNDER_REVIEW'].includes(selectedStatus) && !reason.trim()) {
            return; // Don't submit without reason for these statuses
        }

        handleStatusUpdate(selectedStatus, reason);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-auto p-0 hover:bg-transparent"
                        disabled={disabled || isUpdating || availableStatuses.length === 0}
                    >
                        <div className="flex items-center gap-2">
                            <Badge
                                variant={currentStatusConfig.color as any}
                                className={`capitalize ${currentStatusConfig.bgColor} ${currentStatusConfig.textColor} font-bold`}
                            >
                                {isUpdating ? 'Updating...' : currentStatusConfig.label}
                            </Badge>
                            {!disabled && availableStatuses.length > 0 && (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                        </div>
                    </Button>
                </DropdownMenuTrigger>

                {!disabled && availableStatuses.length > 0 && (
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="text-gray-700 font-semibold">
                            Update Status
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {availableStatuses.map((statusKey) => {
                            const statusConfig = CUSTOMER_STATUSES[statusKey as keyof typeof CUSTOMER_STATUSES];
                            return (
                                <DropdownMenuItem
                                    key={statusKey}
                                    onClick={() => handleStatusSelect(statusKey)}
                                    disabled={isUpdating}
                                    className="flex items-center gap-3 cursor-pointer"
                                >
                                    <div className={`w-3 h-3 rounded-full ${statusConfig.bgColor.replace('bg-', 'bg-').replace('-100', '-500')}`} />
                                    <div>
                                        <div className="font-medium">{statusConfig.label}</div>
                                        <div className="text-xs text-gray-500">{statusConfig.description}</div>
                                    </div>
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuContent>
                )}
            </DropdownMenu>

            {/* Reason Dialog for FLAGGED/UNDER_REVIEW */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            Update Customer Status
                        </DialogTitle>
                        <DialogDescription>
                            You are about to change {customer.email || 'this customer'}'s status to{' '}
                            <span className="font-semibold">
                                {CUSTOMER_STATUSES[selectedStatus as keyof typeof CUSTOMER_STATUSES]?.label}
                            </span>
                            . Please provide a reason for this change.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="reason">
                                Reason <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="reason"
                                placeholder="Explain why this status change is necessary..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            disabled={isUpdating}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDialogSubmit}
                            disabled={
                                isUpdating ||
                                (['FLAGGED', 'UNDER_REVIEW'].includes(selectedStatus) && !reason.trim())
                            }
                        >
                            {isUpdating ? 'Updating...' : 'Update Status'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};