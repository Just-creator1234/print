// app/order/new/upload/page.tsx
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone, type FileRejection } from "react-dropzone";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  File,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  Image,
  FileArchive,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface FilePreview {
  url: string;
  pages: number;
}

// Mock file processing (simulates upload)
const processFile = (file: File): Promise<FilePreview> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock page count based on file type
      let pages = 0;
      if (file.type === "application/pdf") {
        pages = Math.floor(Math.random() * 30) + 5; // 5-35 pages
      } else if (file.type.includes("word") || file.type.includes("document")) {
        pages = Math.floor(Math.random() * 20) + 3; // 3-23 pages
      } else if (file.type.includes("image")) {
        pages = 1;
      } else {
        pages = Math.floor(Math.random() * 15) + 2; // 2-17 pages
      }

      resolve({
        url: URL.createObjectURL(file),
        pages: pages,
      });
    }, 1500);
  });
};

// File type icons
const getFileIcon = (file: File): LucideIcon => {
  if (file.type === "application/pdf") return FileText;
  if (file.type.includes("image")) return Image;
  if (file.type.includes("zip") || file.type.includes("archive")) return FileArchive;
  return File;
};

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

// Animation variants — typed as `Variants` so framer-motion keeps `type: "spring"`
// as the literal union member it expects, instead of widening it to `string`.
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const [filePreview, setFilePreview] = useState<FilePreview | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    // Check for rejected files
    if (rejectedFiles.length > 0) {
      const rejectionError = rejectedFiles[0].errors[0];
      if (rejectionError.code === "file-too-large") {
        toast.error("File is too large. Maximum size is 20MB.");
        setError("File is too large. Maximum size is 20MB.");
      } else if (rejectionError.code === "file-invalid-type") {
        toast.error("File type not supported. Please upload PDF, DOC, DOCX, PNG, or JPG.");
        setError("File type not supported. Please upload PDF, DOC, DOCX, PNG, or JPG.");
      } else {
        toast.error("Failed to upload file. Please try again.");
        setError("Failed to upload file. Please try again.");
      }
      return;
    }

    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    setError(null);
    setFile(selectedFile);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    try {
      const result = await processFile(selectedFile);
      setFilePreview(result);
      setUploadProgress(100);

      setTimeout(() => {
        setIsUploading(false);
        setIsUploaded(true);
        toast.success("File uploaded successfully!");
        clearInterval(interval);
      }, 300);
    } catch {
      clearInterval(interval);
      setIsUploading(false);
      setError("Failed to process file. Please try again.");
      toast.error("Failed to upload file. Please try again.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxSize: 20 * 1024 * 1024, // 20MB
    multiple: false,
    disabled: isUploading || isUploaded,
  });

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    setIsUploaded(false);
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
    toast.success("File removed");
  };

  const handleContinue = () => {
    if (isUploaded && filePreview) {
      // Save to session storage for next page
      sessionStorage.setItem(
        "uploadedFile",
        JSON.stringify({
          name: file?.name,
          size: file?.size,
          type: file?.type,
          url: filePreview.url,
          pages: filePreview.pages,
        })
      );
      router.push("/order/new/details");
    }
  };

  const FileIcon = file ? getFileIcon(file) : File;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">New Order</h1>
                <p className="text-sm text-gray-500">Upload your file</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-medium text-blue-600">1</span>
              <span className="text-gray-300">/</span>
              <span>5</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-8">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex-1 flex items-center gap-2">
              <div
                className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                ${step === 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : ""}
                ${step > 1 ? "bg-gray-200 text-gray-400" : ""}
              `}
              >
                {step > 1 ? <CheckCircle className="w-4 h-4" /> : step}
              </div>
              {step < 5 && (
                <div
                  className={`
                  flex-1 h-0.5 transition-all
                  ${step === 1 ? "bg-blue-600" : "bg-gray-200"}
                `}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
          <span>Upload</span>
          <span>Details</span>
          <span>Delivery</span>
          <span>Shop</span>
          <span>Payment</span>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        className="max-w-3xl mx-auto px-4 sm:px-6 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-xs text-red-600 hover:text-red-700 font-medium mt-1"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Zone */}
        <motion.div variants={itemVariants}>
          <div
            {...getRootProps()}
            className={`
              relative border-2 border-dashed rounded-2xl p-8 sm:p-12 transition-all cursor-pointer
              ${isUploading || isUploaded ? "cursor-default" : ""}
              ${
                isDragActive && !isUploading && !isUploaded
                  ? "border-blue-500 bg-blue-50/50 scale-[1.02]"
                  : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30"
              }
              ${isUploaded ? "border-blue-500 bg-blue-50/50" : ""}
              ${error ? "border-red-300 bg-red-50/50" : ""}
            `}
          >
            <input {...getInputProps()} />

            <AnimatePresence mode="wait">
              {!file && !isUploading && !isUploaded && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {isDragActive ? "Drop your file here" : "Upload your file"}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">Drag and drop or click to browse</p>
                  <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
                    <span className="px-3 py-1 bg-gray-100 rounded-full">PDF</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full">DOC</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full">DOCX</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full">PNG</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full">JPG</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-4">Max file size: 20MB</p>
                </motion.div>
              )}

              {isUploading && (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Uploading...</h3>
                  <div className="w-full max-w-xs mx-auto">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {uploadProgress < 100 ? `${Math.round(uploadProgress)}% uploaded` : "Processing..."}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-4">
                    {file?.name} • {file && formatFileSize(file.size)}
                  </p>
                </motion.div>
              )}

              {isUploaded && filePreview && (
                <motion.div
                  key="uploaded"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <CheckCircle className="w-12 h-12 text-blue-600" />
                    </motion.div>
                  </div>
                  <motion.h3
                    className="text-lg font-semibold text-gray-900 mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    File Uploaded Successfully! 🎉
                  </motion.h3>
                  <motion.div
                    className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <FileIcon className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{file?.name}</span>
                    <span className="text-gray-300">•</span>
                    <span>{file && formatFileSize(file.size)}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-blue-600">{filePreview.pages} pages detected</span>
                  </motion.div>
                  <motion.button
                    onClick={removeFile}
                    className="text-sm text-red-500 hover:text-red-600 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Remove file
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* File Preview (if uploaded) */}
        <AnimatePresence>
          {isUploaded && filePreview && file && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>{filePreview.pages} pages</span>
                    <span>•</span>
                    <span className="capitalize">{file.type.split("/")[1] || "unknown"}</span>
                  </div>
                </div>
                <button onClick={removeFile} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue Button */}
        <motion.div variants={itemVariants} className="mt-8 flex items-center justify-end gap-3">
          <Link href="/dashboard" className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors">
            Cancel
          </Link>
          <motion.button
            onClick={handleContinue}
            disabled={!isUploaded}
            className={`
              px-8 py-3 rounded-xl font-semibold transition-all
              ${
                isUploaded
                  ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:scale-105"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
            whileHover={isUploaded ? { scale: 1.05 } : {}}
            whileTap={isUploaded ? { scale: 0.95 } : {}}
          >
            Continue →
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}