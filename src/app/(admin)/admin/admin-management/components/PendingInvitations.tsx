"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Clock,
  Mail,
  RefreshCw,
  X,
  ShieldCheck,
  Calendar,
  Users,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  useGetPendingInvitations,
  useResendAdminInvite,
  useCancelInvitation,
} from "@/services/admin";

// --- Mock Data and Services ---

interface PendingInvitation {
  id: string;
  email: string;
  userId: number;
  roleId: number;
  invitedById: number;
  status: "PENDING" | "RESENT" | "EXPIRED" | "CANCELLED" | "COMPLETED";
  expiresAt: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  role: {
    id: number;
    name: string;
    description?: string;
  };
  invitedBy: {
    id: number;
    email: string;
  };
  user?: {
    id: number;
    email: string;
    status: string;
  };
}



// --- Original Component ---

const PendingInvitations: React.FC = () => {
  const [selectedInvitation, setSelectedInvitation] =
    useState<PendingInvitation | null>(null);
  const [actionType, setActionType] = useState<"resend" | "cancel" | null>(
    null
  );
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const {
    invitationsData,
    totalInvitations,
    isInvitationsLoading,
    refetchInvitations,
  } = useGetPendingInvitations({
    enabled: true,
    filter: {
      page: pagination.page,
      limit: pagination.limit,
    },
  });

  console.log(invitationsData, "inv")

  const { resendInvitePayload, resendInviteIsLoading } = useResendAdminInvite(
    () => {
      refetchInvitations();
      closeDialog();
    }
  );

  const { cancelInvitationPayload, cancelInvitationIsLoading } =
    useCancelInvitation(() => {
      refetchInvitations();
      closeDialog();
    });

  // Update pagination when data changes
  useEffect(() => {
    if (totalInvitations) {
      setPagination((prev) => ({
        ...prev,
        total: totalInvitations,
        totalPages: Math.ceil(totalInvitations / prev.limit),
      }));
    }
  }, [totalInvitations, pagination.limit]);

  const handleResendInvite = async () => {
    if (!selectedInvitation) return;
    try {
      await resendInvitePayload(selectedInvitation.id);
    } catch (error) {
      console.error("❌ Error resending invitation:", error);
    }
  };

  const handleCancelInvitation = async () => {
    if (!selectedInvitation) return;
    try {
      await cancelInvitationPayload(selectedInvitation.id);
    } catch (error) {
      console.error("❌ Error cancelling invitation:", error);
    }
  };

  const openActionDialog = (
    invitation: PendingInvitation,
    action: "resend" | "cancel"
  ) => {
    setSelectedInvitation(invitation);
    setActionType(action);
  };

  const closeDialog = () => {
    setSelectedInvitation(null);
    setActionType(null);
  };

  const isExpired = (invitation: PendingInvitation) => {
    if (invitation.status === "COMPLETED" || invitation.status === "CANCELLED") return false;
    return new Date(invitation.expiresAt) < new Date();
  };

  const getTimeRemaining = (invitation: PendingInvitation) => {
    if (invitation.status === "COMPLETED") return "Completed";
    if (invitation.status === "CANCELLED") return "Cancelled";

    const now = new Date();
    const expiry = new Date(invitation.expiresAt);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h remaining`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  };

  const getStatusBadge = (invitation: PendingInvitation) => {
    if (isExpired(invitation)) {
      return (
        <Badge variant="destructive" className="text-xs">
          Expired
        </Badge>
      );
    }
    switch (invitation.status) {
      case "PENDING":
        return (
          <Badge variant="secondary" className="text-xs">
            Pending
          </Badge>
        );
      case "RESENT":
        return (
          <Badge variant="default" className="text-xs">
            Resent
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="success" className="text-xs">
            Completed
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="outline" className="text-xs">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {invitation.status}
          </Badge>
        );
    }
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page < 1 || (pagination.totalPages > 0 && page > pagination.totalPages)) return;
    setPagination((prev) => ({ ...prev, page }));
  };

  const nextPage = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const prevPage = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const changeLimit = (newLimit: number) => {
    setPagination({
      page: 1,
      limit: newLimit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / newLimit),
    });
  };

  if (isInvitationsLoading) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-40">
            <div
              className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
              aria-label="Loading"
            ></div>
            <span className="ml-2 text-gray-600">
              Loading pending invitations...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-amber-600" />
              <div>
                <h6 className="font-semibold text-lg text-[#111827]">
                  Pending Admin Invitations
                </h6>
                <p className="text-[#687588] font-medium text-sm">
                  Manage and track role-based admin invitations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">Role-based access</span>
            </div>
          </div>

          {invitationsData && invitationsData.length > 0 ? (
            <>
              <div className="space-y-4 mb-6">
                {invitationsData.map((invitation: PendingInvitation) => {
                  const expired = isExpired(invitation);
                  const timeRemaining = getTimeRemaining(invitation);

                  return (
                    <div
                      key={invitation.id}
                      className={`border rounded-lg p-4 transition-colors ${
                        expired
                          ? "border-red-200 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Mail className="h-4 w-4 text-gray-600" />
                            <span className="font-medium text-gray-900">
                              {invitation.email}
                            </span>
                            {getStatusBadge(invitation)}
                          </div>

                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>
                                Role: {invitation.role.name.replace(/_/g, " ")}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Invited:{" "}
                                {new Date(
                                  invitation.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>

                            <div
                              className={`flex items-center gap-1 ${
                                expired ? "text-red-600" : "text-amber-600"
                              }`}
                            >
                              <Clock className="h-3 w-3" />
                              <span>{timeRemaining}</span>
                            </div>
                          </div>

                          {invitation.role.description && (
                            <p className="text-xs text-gray-500 mt-2">
                              {invitation.role.description}
                            </p>
                          )}

                          <div className="text-xs text-gray-400 mt-1">
                            Invited by: {invitation.invitedBy.email}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          {invitation.status !== "CANCELLED" &&
                            invitation.status !== "COMPLETED" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    openActionDialog(invitation, "resend")
                                  }
                                  className="flex items-center gap-1"
                                >
                                  <RefreshCw className="h-3 w-3" />
                                  Resend
                                </Button>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    openActionDialog(invitation, "cancel")
                                  }
                                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                                >
                                  <X className="h-3 w-3" />
                                  Cancel
                                </Button>
                              </>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Improved Pagination Controls */}
             {pagination.totalPages > 0 && <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Show</span>
                  <select
                    value={pagination.limit}
                    onChange={(e) => changeLimit(Number(e.target.value))}
                    className="border rounded px-2 py-1"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  <span>entries per page</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{" "}
                    of {pagination.total} entries
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(1)}
                    disabled={pagination.page === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevPage}
                    disabled={pagination.page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {/* Page numbers */}
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (
                        pagination.page >=
                        pagination.totalPages - 2
                      ) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pagination.page === pageNum ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => goToPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextPage}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(pagination.totalPages)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
            </>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Pending Invitations
              </h3>
              <p className="text-sm text-gray-600">
                All admin invitations have been completed or there are no active
                invitations.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog
        open={!!selectedInvitation && !!actionType}
        onOpenChange={closeDialog}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType === "resend" ? (
                <>
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                  Resend Invitation
                </>
              ) : (
                <>
                  <X className="h-5 w-5 text-red-600" />
                  Cancel Invitation
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {actionType === "resend" ? (
                <>
                  Are you sure you want to resend the invitation to{" "}
                  <span className="font-medium">
                    {selectedInvitation?.email}
                  </span>
                  ? This will extend the expiration time by 48 hours.
                </>
              ) : (
                <>
                  Are you sure you want to cancel the invitation for{" "}
                  <span className="font-medium">
                    {selectedInvitation?.email}
                  </span>
                  ? This action cannot be undone.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedInvitation && (
            <div className="py-4">
              <Card className="border-gray-200 bg-gray-50">
                <CardContent className="p-3">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Role:</span>
                      <span className="font-medium">
                        {selectedInvitation.role.name.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium">
                        {selectedInvitation.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expires:</span>
                      <span className="font-medium">
                        {getTimeRemaining(selectedInvitation)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              variant={actionType === "resend" ? "default" : "destructive"}
              onClick={
                actionType === "resend"
                  ? handleResendInvite
                  : handleCancelInvitation
              }
              disabled={resendInviteIsLoading || cancelInvitationIsLoading}
            >
              {resendInviteIsLoading || cancelInvitationIsLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {actionType === "resend"
                    ? "Resending..."
                    : "Cancelling..."}
                </>
              ) : actionType === "resend" ? (
                "Resend Invitation"
              ) : (
                "Cancel Invitation"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PendingInvitations;

