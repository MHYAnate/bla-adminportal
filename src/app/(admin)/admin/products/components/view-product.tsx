"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

interface iProps {
  setClose: () => void;
  productData: any;
}

const ViewProduct: React.FC<iProps> = ({ setClose, productData }) => {

  if (!productData) return null;

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-start mb-auto gap-8">
        <div className="w-full">
          <div className="flex gap-1 items-center mb-4">
            <p className="font-normal text-sm text-[#667085] w-32">Product ID:</p>
            <p className="font-semibold text-sm text-[#111827]">
              #{productData.id}
            </p>
          </div>
          <div className="flex gap-1 items-center mb-4">
            <p className="font-normal text-sm text-[#667085] w-32">Name:</p>
            <p className="font-semibold text-sm text-[#111827]">
              {productData.name}
            </p>
          </div>
          <div className="flex gap-1 items-center mb-4">
            <p className="font-normal text-sm text-[#667085] w-32">Category:</p>
            <p className="font-semibold text-sm text-[#111827]">
              {productData.category.name}
            </p>
          </div>
          <div className="flex gap-1 items-center mb-4">
            <p className="font-normal text-sm text-[#667085] w-32">Manufacturer:</p>
            <p className="font-semibold text-sm text-[#111827]">
              {productData?.manufacturer?.name}
            </p>
          </div>
          <div className="flex gap-1 items-center mb-4">
            <p className="font-normal text-sm text-[#667085] w-32">Status:</p>
            <p className={`inline-flex items-center justify-center whitespace-nowrap text-sm px-3 py-2 font-semibold rounded-md ${productData.options[0]?.inventory === 0
              ? "text-red-600"
              : productData.options[0]?.inventory <= productData.options[0]?.lowStockThreshold
                ? "text-slate-500"
                : "text-green-600"
              }`}>
              {productData.options[0]?.inventory === 0
                ? "Out of Stock"
                : productData.options[0]?.inventory <= productData.options[0]?.lowStockThreshold
                  ? "Low Stock"
                  : "In Stock"}
            </p>
          </div>
          <div className="flex gap-1 items-center mb-4">
            <p className="font-normal text-sm text-[#667085] w-32">Processing time:</p>
            <p className="font-semibold text-sm text-[#111827]">
              {productData?.processingTimeDays || productData?.processingTime || 1} days
            </p>
          </div>
          <div className="flex gap-1 items-center mb-4">
            <p className="font-normal text-sm text-[#667085] w-32">Delivery time:</p>
            <p className="font-semibold text-sm text-[#111827]">
              {productData?.minDeliveryDays && productData?.maxDeliveryDays
                ? `${productData.minDeliveryDays}-${productData.maxDeliveryDays} days${productData.includeSaturdays ? ' (incl. Saturdays)' : ''}`
                : productData?.deliveryTime || '1-7 days'
              }
            </p>
          </div>
          <div className="flex gap-1 items-center mb-4">
            <p className="font-normal text-sm text-[#667085] w-32">Returns:</p>
            <p className="font-semibold text-sm text-[#111827]">
              {productData?.acceptsReturns !== false ? 'Accepted' : 'Not Accepted'}
            </p>
          </div>
          <div className="flex gap-1 items-center mb-4">
            <p className="font-normal text-sm text-[#667085] w-32">Created:</p>
            <p className="font-semibold text-sm text-[#111827]">
              {new Date(productData.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="min-w-[274px]">
          <Image
            width={274}
            height={274}
            alt="Product image"
            src={productData.options[0]?.image?.[0] ? productData.options[0].image[0] : "/images/bladmin-login.jpg"}
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Product Options</h3>
        {productData.options.map((option: any, index: number) => (
          <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="font-bold text-md text-[#111827] mb-3">Option {index + 1}:</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex gap-1 items-center mb-2">
                <p className="font-normal text-sm text-[#667085] w-20">Value:</p>
                <p className="font-semibold text-sm text-[#111827]">
                  {option.value || 'Standard'}
                </p>
              </div>

              <div className="flex gap-1 items-center mb-2">
                <p className="font-normal text-sm text-[#667085] w-20">Weight:</p>
                <p className="font-semibold text-sm text-[#111827]">
                  {option.weight} {option.unit}
                </p>
              </div>

              <div className="flex gap-1 items-center mb-2">
                <p className="font-normal text-sm text-[#667085] w-20">Price:</p>
                <p className="font-semibold text-sm text-[#111827]">
                  ₦{option.price}
                </p>
              </div>

              <div className="flex gap-1 items-center mb-2">
                <p className="font-normal text-sm text-[#667085] w-20">Stock:</p>
                <p className="font-semibold text-sm text-[#111827]">{option.inventory}</p>
              </div>

              {option.stockPrice && option.stockPrice > 0 && (
                <>
                  <div className="flex gap-1 items-center mb-2">
                    <p className="font-normal text-sm text-[#667085] w-20">Stock Price:</p>
                    <p className="font-semibold text-sm text-[#111827]">
                      ₦{option.stockPrice}
                    </p>
                  </div>

                  <div className="flex gap-1 items-center mb-2">
                    <p className="font-normal text-sm text-[#667085] w-20">Min Bulk Qty:</p>
                    <p className="font-semibold text-sm text-[#111827]">
                      {option.minimumBulkQuantity || option.moq || 1} units
                    </p>
                  </div>
                </>
              )}
            </div>

            {option.image && option.image.length > 0 && (
              <div className="mt-3">
                <p className="font-normal text-sm text-[#667085] mb-2">Images:</p>
                <div className="flex gap-2 flex-wrap">
                  {option.image.slice(0, 4).map((img: string, imgIndex: number) => (
                    <Image
                      key={imgIndex}
                      width={60}
                      height={60}
                      alt={`Option ${index + 1} image ${imgIndex + 1}`}
                      src={img}
                      className="w-15 h-15 object-cover rounded border"
                    />
                  ))}
                  {option.image.length > 4 && (
                    <div className="w-15 h-15 bg-gray-200 rounded border flex items-center justify-center">
                      <span className="text-xs text-gray-600">+{option.image.length - 4}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Product Description</h3>
        <div className="mb-4">
          {productData.shortDescription && (
            <div className="mb-4">
              <p className="font-bold text-md text-[#111827] mb-2">Short Description</p>
              <p className="font-semibold text-sm text-[#111827]">
                {productData.shortDescription}
              </p>
            </div>
          )}

          <div className="mb-4">
            <p className="font-bold text-md text-[#111827] mb-2">Full Description</p>
            <p className="font-semibold text-sm text-[#111827] leading-relaxed">
              {productData.description || "No description available"}
            </p>
          </div>
        </div>
      </div>

      <div className="gap-5 justify-end flex mt-8">
        <Button
          variant="warning"
          className="w-auto px-8 py-3 font-bold text-base"
          size="xl"
          onClick={setClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default ViewProduct;