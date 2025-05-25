// import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
// import { Upload } from "lucide-react";
// import { Label } from "@/components/ui/label";

// interface FileUploadProps {
//   onFileSelect?: (file: File) => void;
//   selectedFile: File | null;
//   setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
// }

// const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile, setSelectedFile }) => {
// 	const [isDragging, setIsDragging] = useState(false);
// 	// const [selectedFile, setSelectedFile] = useState<File | null>(null);
// 	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
// 	const fileInputRef = useRef<HTMLInputElement>(null);

// 	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
// 		e.preventDefault();
// 		e.stopPropagation();
// 		setIsDragging(true);
// 	};

// 	const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
// 		e.preventDefault();
// 		e.stopPropagation();
// 		setIsDragging(false);
// 	};

// 	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
// 		e.preventDefault();
// 		e.stopPropagation();
// 		setIsDragging(false);

// 		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
// 			const file = e.dataTransfer.files[0];
// 			processFile(file);
// 		}
// 	};

// 	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
// 		if (e.target.files && e.target.files.length > 0) {
// 			const file = e.target.files[0];
// 			processFile(file);
// 		}
// 	};

// 	const processFile = (file: File) => {
// 		// Check if file is jpeg or png
// 		if (file.type !== "image/jpeg" && file.type !== "image/png") {
// 			alert("Please upload JPEG or PNG files only");
// 			return;
// 		}

// 		setSelectedFile(file);
// 		onFileSelect?.(file);

// 		// Create preview
// 		const reader = new FileReader();
// 		reader.onload = () => {
// 			setPreviewUrl(reader.result as string);
// 		};
// 		reader.readAsDataURL(file);
// 	};

// 	const handleClick = () => {
// 		fileInputRef.current?.click();
// 	};

// 	const handleRemove = () => {
// 		setSelectedFile(null);
// 		setPreviewUrl(null);
// 		if (fileInputRef.current) {
// 			fileInputRef.current.value = "";
// 		}
// 	};

// 	return (
// 		<div className="w-full">
// 			<Label
// 				htmlFor="photo"
// 				className="text-sm font-medium text-gray-900 mb-2 block"
// 			>
// 				Upload Photo
// 			</Label>

// 			<div
// 				className={`border border-dashed rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
// 					isDragging
// 						? "border-blue-700 bg-blue-50"
// 						: selectedFile
// 						? "border-green-500 bg-green-50"
// 						: "border-blue-500 hover:bg-blue-50"
// 				}`}
// 				onDragOver={handleDragOver}
// 				onDragLeave={handleDragLeave}
// 				onDrop={handleDrop}
// 				onClick={handleClick}
// 			>
// 				<input
// 					type="file"
// 					id="photo"
// 					ref={fileInputRef}
// 					className="hidden"
// 					accept=".jpg,.jpeg,.png"
// 					onChange={handleFileChange}
// 				/>

// 				{previewUrl ? (
// 					<div className="w-full">
// 						<div className="relative w-full max-w-[300px] mx-auto">
// 							<img
// 								src={previewUrl}
// 								alt="Preview"
// 								className="w-full h-auto rounded-md object-cover mb-2"
// 							/>
// 							<button
// 								onClick={(e) => {
// 									e.stopPropagation();
// 									handleRemove();
// 								}}
// 								className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
// 							>
// 								<svg
// 									xmlns="http://www.w3.org/2000/svg"
// 									width="16"
// 									height="16"
// 									viewBox="0 0 24 24"
// 									fill="none"
// 									stroke="currentColor"
// 									strokeWidth="2"
// 									strokeLinecap="round"
// 									strokeLinejoin="round"
// 								>
// 									<line x1="18" y1="6" x2="6" y2="18"></line>
// 									<line x1="6" y1="6" x2="18" y2="18"></line>
// 								</svg>
// 							</button>
// 						</div>
// 						{selectedFile && (
// 							<p className="text-sm text-center mt-2">
// 								{selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
// 							</p>
// 						)}
// 					</div>
// 				) : (
// 					<>
// 						<div className="bg-[#EC9F01] rounded-full p-2 mb-4">
// 							<Upload className="w-5 h-5 text-white" />
// 						</div>
// 						<div className="text-center">
// 							<p className="text-sm font-medium">
// 								Drag & Drop or choose file to upload
// 							</p>
// 							<p className="text-xs text-gray-400">
// 								Supported formats: Jpeg, png
// 							</p>
// 						</div>
// 					</>
// 				)}
// 			</div>
// 		</div>
// 	);
// };

// export default FileUpload;

"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface FileUploadProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  className?: string;
  accept?: string;
}

export default function FileUpload({
  selectedFile,
  setSelectedFile,
  className,
  accept = "image/*"
}: FileUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL for images
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <label className="text-sm font-medium text-gray-900 block">
        Profile Photo <span className="text-gray-500">(Optional)</span>
      </label>
      
      <div className="flex items-center gap-4">
        {previewUrl ? (
          <div className="relative h-24 w-24 rounded-full overflow-hidden border border-gray-200">
            <Image
              src={previewUrl}
              alt="Profile preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full transform translate-x-1/3 -translate-y-1/3"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={handleButtonClick}
            className="h-24 w-24 rounded-full flex flex-col items-center justify-center gap-1 border-dashed border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <Upload className="h-5 w-5 text-gray-500" />
            <span className="text-xs text-gray-500">Upload</span>
          </Button>
        )}
        
        <div className="flex-1">
          <p className="text-sm text-gray-700">
            {selectedFile ? selectedFile.name : "Upload your profile photo"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            JPG, PNG or GIF. Max size 2MB.
          </p>
          
          {!previewUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleButtonClick}
              className="mt-2 text-sm"
            >
              Select a file
            </Button>
          )}
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}