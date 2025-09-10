import React, { useState, useMemo, useEffect } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    AlertTriangle,
    CreditCard,
    DollarSign,
    RefreshCw,
    Info,
    Truck,
    Package,
    Calculator
} from "lucide-react";
import { toast } from "sonner";
import httpService from "@/services/httpService";
import { routes } from "@/services/api-routes";

interface RefundModalProps {
    order: any;
    isOpen: boolean;
    onClose: () => void;
    onRefundSuccess: () => void;
}

interface RefundCalculation {
    refundAmount: number;
    itemsRefund: number;
    shippingRefund: number;
    canRefundShipping: boolean;
    isShipped: boolean;
    maxRefundable: number;
    breakdown: {
        originalTotal: number;
        itemsSubtotal: number;
        shippingFee: number;
        nonRefundable: number;
    };
}

export const RefundModal: React.FC<RefundModalProps> = ({
    order,
    isOpen,
    onClose,
    onRefundSuccess,
}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [refundType, setRefundType] = useState<'full' | 'partial'>('full');
    const [customAmount, setCustomAmount] = useState('');
    const [reason, setReason] = useState('');

    // ✅ Calculate refund details based on order status and shipping
    const refundCalculation = useMemo((): RefundCalculation => {
        const totalPrice = Number(order?.totalPrice) || 0;
        const shippingFee = Number(order?.shipping?.totalShippingFee) || 0;
        const itemsSubtotal = totalPrice - shippingFee;

        // Determine if order has been shipped
        const isShipped = ['SHIPPED', 'DELIVERED', 'COMPLETED'].includes(order?.status);
        const canRefundShipping = !isShipped;

        let refundAmount = 0;
        let itemsRefund = 0;
        let shippingRefund = 0;

        if (refundType === 'full') {
            if (isShipped) {
                // If shipped: Only refund items, not shipping
                itemsRefund = itemsSubtotal;
                shippingRefund = 0;
                refundAmount = itemsRefund;
            } else {
                // If not shipped: Refund everything
                itemsRefund = itemsSubtotal;
                shippingRefund = shippingFee;
                refundAmount = totalPrice;
            }
        } else if (refundType === 'partial') {
            const requestedAmount = Number(customAmount) || 0;
            const maxRefundable = isShipped ? itemsSubtotal : totalPrice;

            if (requestedAmount <= maxRefundable) {
                refundAmount = requestedAmount;

                if (isShipped) {
                    // For shipped orders, partial refund comes only from items
                    itemsRefund = refundAmount;
                    shippingRefund = 0;
                } else {
                    // For non-shipped orders, calculate proportional refund
                    const itemsProportion = itemsSubtotal / totalPrice;
                    const shippingProportion = shippingFee / totalPrice;

                    itemsRefund = refundAmount * itemsProportion;
                    shippingRefund = refundAmount * shippingProportion;
                }
            }
        }

        return {
            refundAmount: Math.round(refundAmount * 100) / 100,
            itemsRefund: Math.round(itemsRefund * 100) / 100,
            shippingRefund: Math.round(shippingRefund * 100) / 100,
            canRefundShipping,
            isShipped,
            maxRefundable: isShipped ? itemsSubtotal : totalPrice,
            breakdown: {
                originalTotal: totalPrice,
                itemsSubtotal,
                shippingFee,
                nonRefundable: totalPrice - refundAmount
            }
        };
    }, [order, refundType, customAmount]);

    // Reset custom amount when switching to full refund
    useEffect(() => {
        if (refundType === 'full') {
            setCustomAmount('');
        }
    }, [refundType]);

    const handleRefund = async () => {
        // Validation
        if (!reason.trim()) {
            toast.error('Please provide a reason for the refund');
            return;
        }

        if (refundType === 'partial') {
            const amount = Number(customAmount);
            if (!amount || amount <= 0) {
                toast.error('Please enter a valid refund amount');
                return;
            }
            if (amount > refundCalculation.maxRefundable) {
                toast.error(`Refund amount cannot exceed ₦${refundCalculation.maxRefundable.toLocaleString()}`);
                return;
            }
        }

        if (refundCalculation.refundAmount <= 0) {
            toast.error('Invalid refund amount');
            return;
        }

        setIsProcessing(true);

        try {
            const requestData = {
                amount: refundCalculation.refundAmount,
                reason: reason.trim(),
                refundType,
                breakdown: refundCalculation.breakdown
            };

            console.log('🔄 Sending refund request:', requestData);

            // ✅ FIX: Correct parameter order for httpService.postData(data, endpoint)
            const response = await httpService.postData(
                requestData,                          // data parameter first
                routes.processRefund(order.id)       // endpoint parameter second
            );

            toast.success('Refund processed successfully');
            onRefundSuccess();
            onClose();

            // Reset form
            setRefundType('full');
            setCustomAmount('');
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
                        <p className="text-gray-600 mb-4">
                            Refunds are only available for paid orders that haven't been refunded or cancelled.
                        </p>
                        <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Payment Status:</span>
                                <Badge variant={order?.paymentStatus === 'PAID' ? 'default' : 'secondary'}>
                                    {order?.paymentStatus}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Order Status:</span>
                                <Badge variant="outline">{order?.status}</Badge>
                            </div>
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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-blue-500" />
                        Process Refund - Order #{order?.id}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Order Status Info */}
                    <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Info className="w-4 h-4 text-blue-500" />
                                <span className="font-semibold">Order Status Information</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    <span>Status: <Badge variant="outline">{order?.status}</Badge></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Truck className="w-4 h-4" />
                                    <span>Shipped: {refundCalculation.isShipped ? '✅ Yes' : '❌ No'}</span>
                                </div>
                            </div>
                            {refundCalculation.isShipped && (
                                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                                    <AlertTriangle className="w-4 h-4 text-yellow-600 inline mr-1" />
                                    <span className="text-yellow-800">
                                        Since this order has been shipped, shipping fees cannot be refunded.
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <Card>
                        <CardContent className="p-4">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Calculator className="w-4 h-4" />
                                Order Breakdown
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Items Subtotal:</span>
                                    <span className="font-medium">₦{refundCalculation.breakdown.itemsSubtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping Fee:</span>
                                    <span className="font-medium">₦{refundCalculation.breakdown.shippingFee.toLocaleString()}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-semibold">
                                    <span>Total Paid:</span>
                                    <span>₦{refundCalculation.breakdown.originalTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Refund Type Selection - Using standard radio inputs */}
                    <div>
                        <Label className="text-base font-semibold">Refund Type</Label>
                        <div className="mt-2 space-y-3">
                            <div className="flex items-start space-x-3">
                                <input
                                    type="radio"
                                    id="full"
                                    name="refundType"
                                    value="full"
                                    checked={refundType === 'full'}
                                    onChange={(e) => setRefundType(e.target.value as 'full' | 'partial')}
                                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <Label htmlFor="full" className="flex-1 cursor-pointer">
                                    <div>
                                        <div className="font-medium">
                                            Full Refund
                                            {refundCalculation.isShipped && (
                                                <span className="text-sm text-gray-500"> (Items Only)</span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Refund ₦{refundCalculation.refundAmount.toLocaleString()}
                                            {refundCalculation.isShipped
                                                ? ' (excluding shipping)'
                                                : ' (including shipping)'
                                            }
                                        </div>
                                    </div>
                                </Label>
                            </div>
                            <div className="flex items-start space-x-3">
                                <input
                                    type="radio"
                                    id="partial"
                                    name="refundType"
                                    value="partial"
                                    checked={refundType === 'partial'}
                                    onChange={(e) => setRefundType(e.target.value as 'full' | 'partial')}
                                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <Label htmlFor="partial" className="flex-1 cursor-pointer">
                                    <div>
                                        <div className="font-medium">Partial Refund</div>
                                        <div className="text-sm text-gray-600">
                                            Specify custom amount (max: ₦{refundCalculation.maxRefundable.toLocaleString()})
                                        </div>
                                    </div>
                                </Label>
                            </div>
                        </div>
                    </div>

                    {/* Custom Amount Input */}
                    {refundType === 'partial' && (
                        <div>
                            <Label htmlFor="amount">Refund Amount (₦)</Label>
                            <Input
                                id="amount"
                                type="number"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                placeholder={`Enter amount (max: ₦${refundCalculation.maxRefundable.toLocaleString()})`}
                                min="1"
                                max={refundCalculation.maxRefundable}
                                className="mt-1"
                            />
                            {customAmount && Number(customAmount) > refundCalculation.maxRefundable && (
                                <p className="text-sm text-red-600 mt-1">
                                    Amount exceeds maximum refundable amount
                                </p>
                            )}
                        </div>
                    )}

                    {/* Refund Preview */}
                    {refundCalculation.refundAmount > 0 && (
                        <Card className="bg-green-50 border-green-200">
                            <CardContent className="p-4">
                                <h4 className="font-semibold text-green-800 mb-3">Refund Preview</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Items Refund:</span>
                                        <span className="font-medium text-green-700">
                                            ₦{refundCalculation.itemsRefund.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping Refund:</span>
                                        <span className="font-medium text-green-700">
                                            ₦{refundCalculation.shippingRefund.toLocaleString()}
                                        </span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-semibold text-green-800">
                                        <span>Total Refund:</span>
                                        <span>₦{refundCalculation.refundAmount.toLocaleString()}</span>
                                    </div>
                                    {refundCalculation.breakdown.nonRefundable > 0 && (
                                        <div className="flex justify-between text-gray-600">
                                            <span>Non-refundable:</span>
                                            <span>₦{refundCalculation.breakdown.nonRefundable.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Reason */}
                    <div>
                        <Label htmlFor="reason">Refund Reason *</Label>
                        <Textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Please provide a detailed reason for this refund..."
                            className="mt-1"
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter className="flex gap-3">
                    <Button onClick={onClose} variant="outline" disabled={isProcessing}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRefund}
                        disabled={
                            isProcessing ||
                            !reason.trim() ||
                            refundCalculation.refundAmount <= 0 ||
                            (refundType === 'partial' && (!customAmount || Number(customAmount) > refundCalculation.maxRefundable))
                        }
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isProcessing ? (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Processing Refund...
                            </>
                        ) : (
                            <>
                                <CreditCard className="w-4 h-4 mr-2" />
                                Process Refund (₦{refundCalculation.refundAmount.toLocaleString()})
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// Enhanced Payment Info Component with refund history
export const PaymentInfoDisplay: React.FC<{ order: any }> = ({ order }) => {
    const getPaymentMethodInfo = () => {
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

    const getRefundInfo = () => {
        // Check timeline for refund events
        const refundEvents = order.timeline?.filter((event: any) =>
            event.action === 'REFUND_PROCESSED'
        ) || [];

        return {
            hasRefunds: refundEvents.length > 0,
            refundEvents,
            isRefunded: order.paymentStatus === 'REFUNDED'
        };
    };

    const paymentInfo = getPaymentMethodInfo();
    const refundInfo = getRefundInfo();

    const formatPaymentMethod = (method: string) => {
        const methodMap: Record<string, string> = {
            'CARD': 'Credit/Debit Card',
            'BANK_TRANSFER': 'Bank Transfer',
            'CASH_ON_DELIVERY': 'Cash on Delivery',
            'PAY_ON_DELIVERY': 'Pay on Delivery',
            'PAYSTACK': 'Paystack',
            'FLUTTERWAVE': 'Flutterwave'
        };
        return methodMap[method] || method;
    };

    return (
        <div className="space-y-4">
            {/* Payment Method */}
            <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Payment Method:</span>
                <span className="font-semibold">
                    {formatPaymentMethod(paymentInfo.method)}
                </span>
            </div>

            {/* Payment Status */}
            <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Payment Status:</span>
                <Badge
                    variant={
                        paymentInfo.status === 'PAID' ? 'default' :
                            paymentInfo.status === 'REFUNDED' ? 'destructive' :
                                'secondary'
                    }
                >
                    {paymentInfo.status}
                </Badge>
            </div>

            {/* Amount Information */}
            <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Amount Paid:</span>
                <span className="font-semibold">
                    ₦{(order.amountPaid || 0).toLocaleString()}
                </span>
            </div>

            {order.amountDue > 0 && (
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Amount Due:</span>
                    <span className="font-semibold text-red-600">
                        ₦{(order.amountDue || 0).toLocaleString()}
                    </span>
                </div>
            )}

            {/* Refund Information */}
            {refundInfo.isRefunded && (
                <>
                    <Separator className="my-3" />
                    <div className="space-y-2">
                        <h4 className="font-semibold text-red-600 flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Refund Information
                        </h4>
                        {refundInfo.refundEvents.map((event: any, index: number) => (
                            <div key={index} className="bg-red-50 border border-red-200 rounded p-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-medium text-red-800">
                                            Refund Processed
                                        </div>
                                        <div className="text-sm text-red-600">
                                            {event.details?.reason || 'No reason provided'}
                                        </div>
                                        {event.details?.breakdown && (
                                            <div className="text-xs text-red-600 mt-1">
                                                Items: ₦{(event.details.itemsRefund || 0).toLocaleString()} •
                                                Shipping: ₦{(event.details.shippingRefund || 0).toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-red-800">
                                            ₦{(event.details?.refundAmount || 0).toLocaleString()}
                                        </div>
                                        <div className="text-xs text-red-600">
                                            {new Date(event.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Transaction History */}
            {order.transactions && order.transactions.length > 0 && (
                <>
                    <Separator className="my-3" />
                    <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700">Transaction History</h4>
                        {order.transactions.slice(0, 3).map((transaction: any, index: number) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">
                                    {transaction.reference || `Transaction ${index + 1}`}
                                </span>
                                <div className="flex-col items-start text-center justify-center gap-2truncate max-w-[100px] mx-auto">
                                    <Badge
                                        variant={
                                            transaction.status === 'success' ? 'default' :
                                                transaction.status === 'refunded' ? 'destructive' :
                                                    'secondary'
                                        }
                                        className="text-xs"
                                    >
                                        {transaction.status}
                                    </Badge>
                                    <span className="font-medium">
                                        ₦{(transaction.amount || 0).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};