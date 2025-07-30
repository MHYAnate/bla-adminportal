"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface InviteLinkDisplayProps {
    url: string;
    onClose?: () => void;
}

const InviteLinkDisplay: React.FC<InviteLinkDisplayProps> = ({ url, onClose }) => {
    const [copied, setCopied] = useState(false);
    const [linkInfo, setLinkInfo] = useState<any>(null);

    useEffect(() => {
        // Parse the URL to extract information
        try {
            const urlObj = new URL(url);
            const params = urlObj.searchParams;

            const info = {
                email: params.get('email'),
                userId: params.get('userId'),
                expires: params.get('expires'),
                noExpiry: params.get('noExpiry') === 'true',
                hasSignature: !!params.get('signature'),
                hasToken: !!params.get('token')
            };

            setLinkInfo(info);
        } catch (error) {
            console.error('Error parsing URL:', error);
        }
    }, [url]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success('Invite link copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
            toast.error('Failed to copy link');
        }
    };

    const getExpiryInfo = () => {
        if (!linkInfo) return null;

        if (linkInfo.noExpiry) {
            return {
                status: 'permanent',
                text: 'No expiry',
                color: 'bg-blue-100 text-blue-800'
            };
        }

        if (linkInfo.expires) {
            const expiryDate = new Date(parseInt(linkInfo.expires));
            const now = new Date();
            const isExpired = now > expiryDate;
            const timeLeft = expiryDate.getTime() - now.getTime();
            const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));

            return {
                status: isExpired ? 'expired' : 'active',
                text: isExpired
                    ? 'Expired'
                    : `Expires in ${hoursLeft} hour${hoursLeft !== 1 ? 's' : ''}`,
                date: expiryDate.toLocaleString(),
                color: isExpired
                    ? 'bg-red-100 text-red-800'
                    : hoursLeft <= 2
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
            };
        }

        return null;
    };

    const expiryInfo = getExpiryInfo();

    if (!linkInfo) {
        return (
            <Card className="w-full max-w-2xl">
                <CardContent className="p-6">
                    <div className="animate-pulse">Loading link information...</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full ">
            <CardHeader>
                <CardTitle className="flex w-full items-center space-x-2">
                    <span>Admin Invitation Link</span>
                    {expiryInfo && (
                        <Badge className={expiryInfo.color}>
                            {expiryInfo.status === 'expired' && <AlertCircle className="w-3 h-3 mr-1" />}
                            {expiryInfo.status === 'active' && <Clock className="w-3 h-3 mr-1" />}
                            {expiryInfo.text}
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Link Information */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="font-medium text-gray-600">Email:</span>
                        <p className="font-mono text-sm">{linkInfo.email}</p>
                    </div>
                    <div>
                        <span className="font-medium text-gray-600">User ID:</span>
                        <p className="font-mono text-sm">{linkInfo.userId}</p>
                    </div>
                    {expiryInfo?.date && (
                        <div className="col-span-2">
                            <span className="font-medium text-gray-600">Expires:</span>
                            <p className="font-mono text-sm">{expiryInfo.date}</p>
                        </div>
                    )}
                </div>

                {/* Security Indicators */}
                <div className="flex space-x-4 text-xs">
                    <div className={`flex items-center space-x-1 ${linkInfo.hasSignature ? 'text-green-600' : 'text-red-600'}`}>
                        <div className={`w-2 h-2 rounded-full ${linkInfo.hasSignature ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span>Signature {linkInfo.hasSignature ? 'Valid' : 'Missing'}</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${linkInfo.hasToken ? 'text-green-600' : 'text-red-600'}`}>
                        <div className={`w-2 h-2 rounded-full ${linkInfo.hasToken ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span>Token {linkInfo.hasToken ? 'Present' : 'Missing'}</span>
                    </div>
                </div>

                {/* URL Display */}
                <div className="space-y-2">
                    <label className="font-medium text-gray-600">Invitation URL:</label>
                    <div className="">
                        <div className="flex-1 p-3 bg-gray-50 my-4 rounded-lg border">
                            <code className="text-xs text-gray-800 break-all">
                                {url}
                            </code>
                        </div>
                        <Button
                            onClick={copyToClipboard}
                            variant="outline"
                            size="sm"
                            className="flex-shrink-0"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>

                {/* Actions */}
                <div className="items-center pt-4 border-t">
                    <div className="text-xs text-gray-500">
                        Share this link with the new admin to complete registration
                    </div>
                    <div className=" flex gap-6 mt-4">
                        {onClose && (
                            <Button variant="outline" onClick={onClose}>
                                Close
                            </Button>
                        )}
                        <Button className='w-full' onClick={copyToClipboard}>
                            {copied ? 'Copied!' : 'Copy Link'}
                        </Button>
                    </div>
                </div>

                {/* Warning for expired links */}
                {expiryInfo?.status === 'expired' && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2 text-red-800">
                            <AlertCircle className="w-4 h-4" />
                            <span className="font-medium">This invitation link has expired</span>
                        </div>
                        <p className="text-sm text-red-600 mt-1">
                            You'll need to generate a new invitation link for this admin.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default InviteLinkDisplay;