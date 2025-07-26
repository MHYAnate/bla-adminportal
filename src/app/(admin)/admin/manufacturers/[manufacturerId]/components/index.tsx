"use client";

import Header from "@/app/(admin)/components/header";
import { Card, CardContent } from "@/components/ui/card";
import SupplierManagementCard from "@/components/widgets/supplier-management";
import { useEffect, useState } from "react";
import {
    useDeleteManufacturerProduct,
    useGetManufacturerInfo,
    useGetManufacturerProducts,
    useGetManufacturers,
    useUpdateManufacturerStatus,
    useDeleteManufacturer
} from "@/services/manufacturers";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft } from "lucide-react";
import EditManufacturer from "../../components/edit-manufacturer";
import DeleteManufacturer from "../../components/delete-manufacturer";
import ViewProduct from "@/app/(admin)/admin/products/components/view-product";
import EditProduct from "@/app/(admin)/admin/products/components/edit-products";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import DatePickerWithRange from "@/components/ui/date-picker";
import { productTypeList } from "@/constant";
import { capitalizeFirstLetter, showSuccessAlert } from "@/lib/utils";
import { useDeleteProduct } from "@/services/products";
import { useRouter } from "next/navigation";
import ManufacturerProductTable from "./manufacturer-product-table";
import DeleteContent from "@/app/(admin)/components/delete-content";
import { toast } from "sonner";

interface ManufacturerDetailsProps {
    manufacturerId: string;
}

const ManufacturerDetails: React.FC<ManufacturerDetailsProps> = ({ manufacturerId }) => {
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);
    const [tab, setTab] = useState<string>("update");
    const [filter, setFilter] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [pageSize, setPageSize] = useState<string>("10");
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const onPageChange = (page: number) => {
        setCurrentPage(page);
    };

    const {
        getManufacturersData,
        getManufacturersIsLoading,
        refetchManufacturers,
        setManufacturersFilter,
    } = useGetManufacturers();

    const findManufacturerById = (id: string) => {
        if (!getManufacturersData?.data) return null;
        return getManufacturersData.data.find(
            (manufacturer: { id: any }) => String(manufacturer.id) === String(id)
        );
    };

    const manufacturer = findManufacturerById(manufacturerId);

    const {
        deleteProduct,
        isLoading: isDeletingProduct
    } = useDeleteProduct({
        onSuccess: () => {
            toast.success("Product deleted successfully!");
            refetchManufacturerProducts();
            setOpen(false);
        },
    });

    const {
        deleteManufacturer,
        isLoading: isDeletingManufacturer
    } = useDeleteManufacturer({
        onSuccess: () => {
            toast.success("Manufacturer deleted successfully!");
            setOpen(false);
            setTimeout(() => {
                router.push('/admin/manufacturers');
            }, 1000);
        },
    });

    const {
        getManufacturerInfoData: data,
        getManufacturerInfoIsLoading,
        refetchManufacturerInfo,
        setManufacturerInfoFilter,
    } = useGetManufacturerInfo();

    useEffect(() => {
        if (manufacturerId) {
            setManufacturerInfoFilter(manufacturerId);
        }
    }, [manufacturerId, setManufacturerInfoFilter]);

    const handleDeleteManufacturer = async () => {
        if (!manufacturer) return;

        try {
            await deleteManufacturer(manufacturer.id);
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Failed to delete manufacturer");
        }
    };

    const {
        getManufacturerProductsData,
        getManufacturerProductsError,
        getManufacturerProductsIsLoading,
        refetchManufacturerProducts,
        setManufacturerProductsFilter,
    } = useGetManufacturerProducts();

    const {
        updateManufacturerStatusData,
        updateManufacturerStatusIsLoading,
        updateManufacturerStatusPayload,
    } = useUpdateManufacturerStatus(() => {
        refetchManufacturerInfo();
        refetchManufacturers();
        toast.success("Manufacturer status updated successfully!");
    });

    const payload = {
        page: currentPage,
        pageSize,
        type: status,
    };

    useEffect(() => {
        if (manufacturerId) {
            setManufacturerProductsFilter({ manufacturerId, data: payload });
        }
    }, [currentPage, filter, status, pageSize, manufacturerId, setManufacturerProductsFilter]);

    // Handlers for product actions
    const handleViewProduct = (product: any) => {
        setSelectedProduct(product);
        setTab("view");
        setOpen(true);
    };

    const handleEditProduct = (product: any) => {
        setSelectedProduct(product);
        setTab("edit");
        setOpen(true);
    };

    const handleDeleteProduct = (product: any) => {
        setSelectedProduct(product);
        setTab("delete-product");
        setOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedProduct) {
            deleteProduct(selectedProduct.id);
        }
    };

    const renderItem = () => {
        switch (tab) {
            case "update":
                return <EditManufacturer setClose={() => setOpen(false)} manufacturer={manufacturer} />;
            case "delete":
                return (
                    <DeleteManufacturer
                        handleClose={() => setOpen(false)}
                        title={manufacturer?.name || "Manufacturer"}
                        handleClick={handleDeleteManufacturer}
                        loading={isDeletingManufacturer}
                        warningMessage="Deleting this manufacturer will permanently remove it and all associated data. This action cannot be undone."
                    />
                );
            case "view":
                return (
                    <ViewProduct
                        setClose={() => setOpen(false)}
                        productData={selectedProduct}
                    />
                );
            case "edit":
                return (
                    <EditProduct
                        setClose={() => setOpen(false)}
                        product={selectedProduct}
                        manufacturers={getManufacturersData?.data || []}
                    />
                );
            case "delete-product":
                return (
                    <DeleteContent
                        handleClose={() => setOpen(false)}
                        title="Product"
                        handleClick={handleConfirmDelete}
                        isLoading={isDeletingProduct}
                    />
                );
            default:
                return <EditManufacturer manufacturer={manufacturer} setClose={() => setOpen(false)} />;
        }
    };

    const handleToggleStatus = async () => {
        try {
            // Toggle the status - if currently active, make inactive, and vice versa
            const newStatus = !manufacturer?.status;

            await updateManufacturerStatusPayload({
                payload: { status: newStatus },
                id: manufacturerId,
            });
        } catch (error) {
            console.error("Status update failed:", error);
            toast.error("Failed to update manufacturer status");
        }
    };

    // Don't render if manufacturer is not found
    if (!manufacturer && !getManufacturersIsLoading) {
        return (
            <div className="p-4">
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-lg text-gray-600">Manufacturer not found</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div>
            <Card>
                <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-6">
                        <Header
                            title="Manufacturer"
                            subtext="Manage Manufacturer"
                            showBack={true}
                        />
                    </div>

                    {manufacturer && (
                        <div className="mb-6">
                            <SupplierManagementCard
                                item={manufacturer}
                                handleUpdateManufacturerStatus={handleToggleStatus}
                                showToggle={true}
                                showOptions={true}
                                setTab={setTab}
                                setOpen={setOpen}
                                loading={updateManufacturerStatusIsLoading}
                            />
                        </div>
                    )}

                    <div className="flex items-center gap-4 mb-6">
                        <InputFilter
                            setQuery={setFilter}
                            placeholder="Search by product name, description"
                        />

                        <SelectFilter
                            setFilter={setStatus}
                            placeholder="Product Type"
                            list={productTypeList}
                        />
                        <DatePickerWithRange
                            setFromDate={setStartDate}
                            setToDate={setEndDate}
                        />
                    </div>

                    <ManufacturerProductTable
                        handleEdit={handleEditProduct}
                        handleView={handleViewProduct}
                        handleDelete={handleDeleteProduct}
                        setPageSize={setPageSize}
                        data={getManufacturerProductsData?.data || []}
                        currentPage={currentPage}
                        onPageChange={onPageChange}
                        pageSize={Number(pageSize)}
                        totalPages={getManufacturerProductsData?.pagination?.totalPages || 1}
                        loading={getManufacturerProductsIsLoading}
                    />
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={() => setOpen(!open)}>
                <DialogContent
                    className={`${tab !== "delete" && tab !== "delete-product"
                        ? "right-0 p-8 max-w-[47.56rem] h-screen overflow-y-scroll"
                        : "max-w-[33.75rem] left-[50%] translate-x-[-50%] py-10"
                        }`}
                >
                    {tab !== "delete" && tab !== "delete-product" && (
                        <DialogHeader>
                            <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
                                <div onClick={() => setOpen(false)} className="cursor-pointer">
                                    <ChevronLeft size={24} />
                                </div>
                                {capitalizeFirstLetter(tab)}{" "}
                                {tab === "update" ? "Manufacturer" : "Product"}
                            </DialogTitle>
                        </DialogHeader>
                    )}
                    {renderItem()}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManufacturerDetails;