import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, CreditCard, DollarSign, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import httpService from "@/services/httpService";
import { routes } from "@/services/api-routes";

interface RefundModalProps {
    order: any;
    isOpen: boolean;
    onClose: () => void;
    onRefundSuccess: () => void;
}

export const RefundModal: React.FC<RefundModalProps> = ({
    order,
    isOpen,
    onClose,
    onRefundSuccess,
}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [refundType, setRefundType] = useState<'full' | 'partial'>('full');
    const [refundAmount, setRefundAmount] = useState(order?.totalPrice || 0);
    const [reason, setReason] = useState('');

    const maxRefundAmount = order?.totalPrice || 0;
    const amountPaid = order?.amountPaid || order?.totalPrice || 0;

    const handleRefund = async () => {
        if (!reason.trim()) {
            toast.error('Please provide a reason for the refund');
            return;
        }

        if (refundType === 'partial' && (refundAmount <= 0 || refundAmount > amountPaid)) {
            toast.error(`Refund amount must be between ₦1 and ₦${amountPaid.toLocaleString()}`);
            return;
        }

        setIsProcessing(true);

        try {
            const response = await httpService.postData(
                routes.processRefund(order.id),
                {
                    amount: refundType === 'full' ? amountPaid : refundAmount,
                    reason: reason.trim(),
                    refundType,
                }
            );

            toast.success('Refund processed successfully');
            onRefundSuccess();
            onClose();

            // Reset form
            setRefundType('full');
            setRefundAmount(maxRefundAmount);
            setReason('');

        } catch (error: any) {
            console.error('Refund error:', error);
            toast.error(`Failed to process refund: ${error?.message || 'Unknown error'}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const canRefund = () => {
        return order?.paymentStatus === 'PAID' &&
            !['REFUNDED', 'CANCELLED'].includes(order?.status);
    };

    if (!canRefund()) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                            Refund Not Available
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-gray-600">
                            Refunds are only available for paid orders that haven't been refunded or cancelled.
                        </p>
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm">
                                <span className="font-medium">Payment Status:</span>
                                <Badge className="ml-2">{order?.paymentStatus}</Badge>
                            </p>
                            <p className="text-sm mt-1">
                                <span className="font-medium">Order Status:</span>
                                <Badge className="ml-2">{order?.status}</Badge>
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={onClose} variant="outline">Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-blue-500" />
                        Process Refund - Order #{order?.id}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Order Summary */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Order Summary</h4>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span>Total Amount:</span>
                                <span className="font-medium">₦{maxRefundAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Amount Paid:</span>
                                <span className="font-medium text-green-600">₦{amountPaid.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Payment Status:</span>
                                <Badge variant="default">{order?.paymentStatus}</Badge>
                            </div>
                        </div>
                    </div>

                    {/* Refund Type */}
                    <div>
                        <Label className="text-base font-medium">Refund Type</Label>
                        <div className="mt-2 space-y-3">
                            <div className="flex items-center space-x-3">
                                <input
                                    type="radio"
                                    id="full"
                                    name="refundType"
                                    value="full"
                                    checked={refundType === 'full'}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setRefundType('full');
                                            setRefundAmount(amountPaid);
                                        }
                                    }}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                />
                                <Label htmlFor="full" className="cursor-pointer font-normal">
                                    Full Refund (₦{amountPaid.toLocaleString()})
                                </Label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="radio"
                                    id="partial"
                                    name="refundType"
                                    value="partial"
                                    checked={refundType === 'partial'}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setRefundType('partial');
                                        }
                                    }}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                />
                                <Label htmlFor="partial" className="cursor-pointer font-normal">
                                    Partial Refund
                                </Label>
                            </div>
                        </div>
                    </div>

                    {/* Partial Refund Amount */}
                    {refundType === 'partial' && (
                        <div>
                            <Label htmlFor="amount">Refund Amount</Label>
                            <div className="relative mt-1">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={refundAmount}
                                    onChange={(e) => setRefundAmount(Number(e.target.value))}
                                    className="pl-8"
                                    min={1}
                                    max={amountPaid}
                                    placeholder="0"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Maximum refundable: ₦{amountPaid.toLocaleString()}
                            </p>
                        </div>
                    )}

                    {/* Reason */}
                    <div>
                        <Label htmlFor="reason">Reason for Refund *</Label>
                        <Textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Please provide a reason for this refund..."
                            className="mt-1"
                            rows={3}
                        />
                    </div>

                    {/* Warning */}
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                            <div className="text-sm text-yellow-800">
                                <p className="font-medium">Please confirm:</p>
                                <p>This action will process a refund and cannot be undone. The customer will be notified.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        disabled={isProcessing}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRefund}
                        disabled={isProcessing || !reason.trim()}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        {isProcessing ? (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard className="w-4 h-4 mr-2" />
                                Process Refund
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// Enhanced Payment Info Component (based on your backend data)
export const PaymentInfoDisplay: React.FC<{ order: any }> = ({ order }) => {
    const getPaymentMethodInfo = () => {
        // Based on your backend, you might have paymentMethod or derive from orderType
        const method = order.paymentMethod || order.orderType || 'UNKNOWN';
        const status = order.paymentStatus || 'PENDING';

        return {
            method,
            status,
            isPayOnDelivery: method === 'CASH_ON_DELIVERY' ||
                method === 'PAY_ON_DELIVERY' ||
                order.orderType === 'PAY_ON_DELIVERY',
            requiresPayment: status === 'PENDING' && method !== 'CASH_ON_DELIVERY'
        };
    };

    const getDeliveryInfo = () => {
        // Based on your backend structure
        const shipping = order.shipping || {};
        const hasSchedule = Boolean(order.scheduledDeliveryDate);

        return {
            hasSchedule,
            scheduledDate: order.scheduledDeliveryDate,
            timeSlot: order.preferredTimeSlot,
            distance: shipping.distance,
            shippingFee: shipping.totalShippingFee,
            estimatedDelivery: order.estimatedDelivery
        };
    };

    const paymentInfo = getPaymentMethodInfo();
    const deliveryInfo = getDeliveryInfo();

    const formatPaymentMethod = (method: string) => {
        const methodMap: Record<string, string> = {
            'CARD': 'Credit/Debit Card',
            'BANK_TRANSFER': 'Bank Transfer',
            'CASH_ON_DELIVERY': 'Cash on Delivery',
            'PAY_ON_DELIVERY': 'Pay on Delivery',
            'WALLET': 'Digital Wallet'
        };
        return methodMap[method] || method.replace('_', ' ');
    };

    return (
        <div className="space-y-4">
            {/* Payment Information */}
            <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payment Information
                </h4>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium">
                            {formatPaymentMethod(paymentInfo.method)}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600">Payment Status:</span>
                        <Badge
                            variant={paymentInfo.status === 'PAID' ? 'default' : 'secondary'}
                            className={
                                paymentInfo.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                    paymentInfo.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                            }
                        >
                            {paymentInfo.status}
                        </Badge>
                    </div>

                    {/* Payment Characteristics */}
                    <div className="flex justify-between">
                        <span className="text-gray-600">Payment Type:</span>
                        <div className="flex gap-1">
                            {paymentInfo.isPayOnDelivery && (
                                <Badge className="bg-blue-100 text-blue-800 text-xs">
                                    Pay on Delivery
                                </Badge>
                            )}
                            {paymentInfo.requiresPayment && (
                                <Badge className="bg-red-100 text-red-800 text-xs">
                                    Payment Required
                                </Badge>
                            )}
                            {paymentInfo.status === 'PAID' && (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                    Paid
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delivery Information */}
            <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3">Delivery Information</h4>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Type:</span>
                        <Badge className={
                            deliveryInfo.hasSchedule ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                        }>
                            {deliveryInfo.hasSchedule ? 'Scheduled' : 'Standard'}
                        </Badge>
                    </div>

                    {deliveryInfo.scheduledDate && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Scheduled Date:</span>
                            <span className="font-medium">
                                {new Date(deliveryInfo.scheduledDate).toLocaleDateString()}
                            </span>
                        </div>
                    )}

                    {deliveryInfo.timeSlot && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Time Slot:</span>
                            <span className="font-medium">
                                {deliveryInfo.timeSlot.start} - {deliveryInfo.timeSlot.end}
                            </span>
                        </div>
                    )}

                    {deliveryInfo.distance && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Distance:</span>
                            <span className="font-medium">{deliveryInfo.distance} km</span>
                        </div>
                    )}

                    {deliveryInfo.shippingFee && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping Fee:</span>
                            <span className="font-medium">₦{deliveryInfo.shippingFee.toLocaleString()}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};






