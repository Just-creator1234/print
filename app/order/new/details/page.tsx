// app/order/new/details/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  BookOpen,
  Layers,
  Sparkles,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

// ---------- Types ----------

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
  pages: number;
}

interface PrintTypeOption {
  id: "bw" | "color";
  label: string;
  price: number;
  icon: string;
}

interface BindingOption {
  id: "none" | "staple" | "spiral";
  label: string;
  price: number;
  icon: string;
}

interface PaperSizeOption {
  id: "a4" | "a3";
  label: string;
  price: number;
}

interface Pricing {
  perSheetPrice: number;
  totalSheets: number;
  subtotal: number;
  bindingPrice: number;
  total: number;
  printPrice: number;
  paperPrice: number;
}

// ---------- Mock data for printing options ----------

const PRINT_TYPES: PrintTypeOption[] = [
  { id: "bw", label: "Black & White", price: 0.4, icon: "⚫" },
  { id: "color", label: "Color", price: 1.2, icon: "🌈" },
];

const BINDING_OPTIONS: BindingOption[] = [
  { id: "none", label: "None", price: 0, icon: "📄" },
  { id: "staple", label: "Staple", price: 0.5, icon: "📎" },
  { id: "spiral", label: "Spiral Binding", price: 2.0, icon: "📘" },
];

const PAPER_SIZES: PaperSizeOption[] = [
  { id: "a4", label: "A4", price: 0 },
  { id: "a3", label: "A3", price: 0.8 },
];

// Get stored file data from session
const getStoredFile = (): UploadedFile | null => {
  if (typeof window === "undefined") return null;
  const data = sessionStorage.getItem("uploadedFile");
  if (!data) return null;
  try {
    return JSON.parse(data) as UploadedFile;
  } catch {
    return null;
  }
};

// Animation variants — typed as `Variants` so `type: "spring"` stays a literal
// instead of widening to `string`, which is what framer-motion's types require.
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
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

export default function OrderDetailsPage() {
  const router = useRouter();
  const [fileData, setFileData] = useState<UploadedFile | null>(null);
  const [pages, setPages] = useState(20);
  const [copies, setCopies] = useState(2);
  const [printType, setPrintType] = useState<PrintTypeOption["id"]>("bw");
  const [binding, setBinding] = useState<BindingOption["id"]>("none");
  const [paperSize, setPaperSize] = useState<PaperSizeOption["id"]>("a4");
  const [isLoading, setIsLoading] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Load stored file data
  useEffect(() => {
    const stored = getStoredFile();
    if (stored) {
      setFileData(stored);
      setPages(stored.pages || 20);
    } else {
      // If no file, redirect back to upload
      toast.error("Please upload a file first");
      router.push("/order/new/upload");
    }
    setIsLoading(false);
  }, [router]);

  // Calculate pricing
  const calculateTotal = (): Pricing => {
    const printPrice = PRINT_TYPES.find((p) => p.id === printType)?.price || 0;
    const bindingPrice = BINDING_OPTIONS.find((b) => b.id === binding)?.price || 0;
    const paperPrice = PAPER_SIZES.find((p) => p.id === paperSize)?.price || 0;

    const perSheetPrice = printPrice + paperPrice;
    const totalSheets = pages * copies;
    const subtotal = totalSheets * perSheetPrice;
    const total = subtotal + bindingPrice;

    return {
      perSheetPrice,
      totalSheets,
      subtotal,
      bindingPrice,
      total,
      printPrice,
      paperPrice,
    };
  };

  const pricing = calculateTotal();

  // Handle continue
  const handleContinue = () => {
    if (pages < 1 || copies < 1) {
      toast.error("Please enter valid page and copy numbers");
      return;
    }

    // Save order details to session
    const orderDetails = {
      pages,
      copies,
      printType,
      binding,
      paperSize,
      pricing,
      fileName: fileData?.name || "Unknown",
      filePages: fileData?.pages || 0,
    };
    sessionStorage.setItem("orderDetails", JSON.stringify(orderDetails));

    toast.success("Order details saved!");
    router.push("/order/new/delivery");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!fileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No File Found</h3>
          <p className="text-gray-500 mb-4">Please upload a file first</p>
          <Link
            href="/order/new/upload"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Upload File
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/order/new/upload" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Print Settings</h1>
                <p className="text-sm text-gray-500">Configure your print options</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-medium text-blue-600">2</span>
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
                ${step === 2 ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : ""}
                ${step < 2 ? "bg-blue-400 text-white" : ""}
                ${step > 2 ? "bg-gray-200 text-gray-400" : ""}
              `}
              >
                {step < 2 ? <CheckCircle className="w-4 h-4" /> : step}
              </div>
              {step < 5 && (
                <div
                  className={`
                  flex-1 h-0.5 transition-all
                  ${step < 2 ? "bg-blue-400" : "bg-gray-200"}
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
        {/* File Info Card */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{fileData.name}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{fileData.pages} pages detected</span>
                <span>•</span>
                <span className="text-blue-600">✅ Ready to print</span>
              </div>
            </div>
            <span className="text-xs text-gray-400">{new Date().toLocaleDateString()}</span>
          </div>
        </motion.div>

        {/* Basic Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
  {/* Pages per copy */}
  <motion.div variants={itemVariants}>
    <label className="block text-sm font-medium text-gray-700 mb-2">Pages per copy</label>
    <div className="relative">
      <input
        type="number"
        min="1"
        max="1000"
        value={pages}
        onChange={(e) => setPages(Math.max(1, parseInt(e.target.value, 10) || 1))}
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-600 font-medium placeholder:text-gray-400"
      />

    </div>
  </motion.div>

  {/* Number of copies */}
  <motion.div variants={itemVariants}>
    <label className="block text-sm font-medium text-gray-700 mb-2">Number of copies</label>
    <div className="flex items-center gap-2">
      <button
        onClick={() => setCopies(Math.max(1, copies - 1))}
        className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-xl font-semibold text-gray-600"
      >
        −
      </button>
      <input
        type="number"
        min="1"
        max="100"
        value={copies}
        onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value, 10) || 1))}
        className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center transition-all text-gray-600 font-medium placeholder:text-gray-400"
      />
      <button
        onClick={() => setCopies(Math.min(100, copies + 1))}
        className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-xl font-semibold text-gray-600"
      >
        +
      </button>
    </div>
  </motion.div>
</div>

        {/* Print Type Selection */}
        <motion.div variants={itemVariants} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Print Type</label>
          <div className="grid grid-cols-2 gap-3">
            {PRINT_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setPrintType(type.id)}
                className={`
                  p-4 rounded-xl border-2 text-left transition-all
                  ${printType === type.id ? "border-blue-600 bg-blue-50 shadow-sm" : "border-gray-200 hover:border-gray-300 bg-white"}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{type.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{type.label}</p>
                    <p className="text-sm text-gray-500">GHS {type.price.toFixed(2)}/sheet</p>
                  </div>
                  {printType === type.id && <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Advanced Options Toggle */}
        <motion.div variants={itemVariants}>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <Layers className="w-4 h-4" />
            <span>Advanced Options</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pt-2">
                  {/* Binding Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Binding</label>
                    <div className="space-y-2">
                      {BINDING_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setBinding(option.id)}
                          className={`
                            w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all
                            ${binding === option.id ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300 bg-white"}
                          `}
                        >
                          <span className="text-xl">{option.icon}</span>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-gray-900">{option.label}</p>
                            {option.price > 0 && <p className="text-xs text-gray-500">+ GHS {option.price.toFixed(2)}</p>}
                          </div>
                          {binding === option.id && <CheckCircle className="w-4 h-4 text-blue-600" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Paper Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Paper Size</label>
                    <div className="space-y-2">
                      {PAPER_SIZES.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => setPaperSize(size.id)}
                          className={`
                            w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all
                            ${paperSize === size.id ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300 bg-white"}
                          `}
                        >
                          <BookOpen className={`w-5 h-5 ${paperSize === size.id ? "text-blue-600" : "text-gray-400"}`} />
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-gray-900">{size.label}</p>
                            {size.price > 0 && <p className="text-xs text-gray-500">+ GHS {size.price.toFixed(2)}/sheet</p>}
                          </div>
                          {paperSize === size.id && <CheckCircle className="w-4 h-4 text-blue-600" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Order Summary */}
        <motion.div variants={itemVariants} className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Order Summary</h3>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Pages</span>
              <span className="font-medium text-gray-900">
                {pages} × {copies} copy{copies > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total sheets</span>
              <span className="font-medium text-gray-900">{pricing.totalSheets} sheets</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Print type</span>
              <span className="font-medium text-gray-900">{PRINT_TYPES.find((p) => p.id === printType)?.label}</span>
            </div>
            {binding !== "none" && (
              <div className="flex justify-between">
                <span className="text-gray-600">Binding</span>
                <span className="font-medium text-gray-900">{BINDING_OPTIONS.find((b) => b.id === binding)?.label}</span>
              </div>
            )}
            {paperSize !== "a4" && (
              <div className="flex justify-between">
                <span className="text-gray-600">Paper size</span>
                <span className="font-medium text-gray-900">{PAPER_SIZES.find((p) => p.id === paperSize)?.label}</span>
              </div>
            )}

            <div className="border-t border-blue-200/50 pt-3 mt-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Per sheet</span>
                <span className="font-medium text-gray-900">GHS {pricing.perSheetPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">GHS {pricing.subtotal.toFixed(2)}</span>
              </div>
              {binding !== "none" && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Binding fee</span>
                  <span className="font-medium text-gray-900">GHS {pricing.bindingPrice.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-blue-200/50 mt-2">
                <span>Total</span>
                <span className="text-blue-600">GHS {pricing.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-100/50 rounded-xl flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">Delivery fee and shop pricing will be added in the next step</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="mt-8 flex items-center justify-end gap-3">
          <Link href="/order/new/upload" className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors">
            Back
          </Link>
          <motion.button
            onClick={handleContinue}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue →
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}