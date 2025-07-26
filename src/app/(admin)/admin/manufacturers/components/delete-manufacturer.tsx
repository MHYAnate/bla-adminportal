import { Button } from "@/components/ui/button";
import { CautionIcon } from "../../../../../../public/icons";
import { Loader2 } from "lucide-react";

interface iProps {
    handleClose: () => void;
    handleClick?: () => void;
    title: string;
    loading?: boolean;
    warningMessage?: string;
}

const DeleteManufacturer: React.FC<iProps> = ({
    handleClose,
    handleClick,
    title,
    loading,
    warningMessage,
}) => {
    return (
        <div className="p-4">
            <div className="mb-6 flex items-center justify-center">
                <CautionIcon />
            </div>

            <h5 className="mb-2 text-center text-[#16151C] font-bold text-xl">
                Delete {title}?
            </h5>

            <p className="font-medium text-base text-gray-600 mb-6 text-center">
                {warningMessage ||
                    "This action is irreversible and will permanently remove all associated data."}
            </p>

            <div className="flex gap-4 justify-center">
                <Button
                    variant="outline"
                    className="w-full py-3 px-6 font-medium"
                    onClick={handleClose}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    variant="destructive"
                    className="w-full py-3 px-6 font-medium flex items-center justify-center"
                    onClick={handleClick}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                        </>
                    ) : (
                        "Delete Manufacturer"
                    )}
                </Button>
            </div>
        </div>
    );
};

export default DeleteManufacturer;