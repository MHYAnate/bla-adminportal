"use client";

import { Button } from "@/components/ui/button";

interface CategorySuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    categoryName?: string;
}

const CategorySuccessModal: React.FC<CategorySuccessModalProps> = ({
    isOpen,
    onClose,
    categoryName
}) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-auto p-8 text-center">
                    {/* Success Icon */}
                    <div className="w-16 h-16 bg-[#F7931E] rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Category Successfully Submitted
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-6">
                        {categoryName
                            ? `You have successfully submitted "${categoryName}" category for approval`
                            : 'You have successfully submitted a new category for approval'
                        }
                    </p>

                    {/* Done Button */}
                    <Button
                        onClick={onClose}
                        className="w-full h-12 bg-[#F7931E] hover:bg-[#e8851a] text-white font-medium"
                    >
                        DONE
                    </Button>
                </div>
            </div>
        </>
    );
};

export default CategorySuccessModal;