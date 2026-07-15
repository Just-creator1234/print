// app/order/new/payment/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import ReactConfetti from "react-confetti";
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Smartphone,
  Building2,
  FileText,
  MapPin,
  Printer,
  Sparkles,
  Shield,
  Loader2,
  Wallet,
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

interface OrderPricing {
  perSheetPrice: number;
  totalSheets: number;
  subtotal: number;
  bindingPrice: number;
  total: number;
  printPrice: number;
  paperPrice: number;
}

interface OrderDetails {
  pages: number;
  copies: number;
  printType: "bw" | "color";
  binding: "none" | "staple" | "spiral";
  paperSize: "a4" | "a3";
  pricing: OrderPricing;
  fileName: string;
  filePages: number;
}

interface DeliveryData {
  deliveryType: "pickup" | "delivery";
  address: string;
  landmark: string;
  phone: string;
  notes: string;
  slot: string;
}

interface SelectedShop {
  id: string;
  name: string;
  address: string;
  status: "open" | "busy" | "closed";
  pricePerSheet: number;
  deliveryFee: number;
  distance: string;
  rating: number;
  reviews: number;
}

interface StoredData {
  file: UploadedFile | null;
  details: OrderDetails | null;
  delivery: DeliveryData | null;
  shop: SelectedShop | null;
}

interface FinalTotal {
  total: number;
  subtotal: number;
  deliveryFee: number;
  printPrice: number;
  binding: string;
  paperSize: string;
}

// Get stored data from session. Always returns the same shape (never a bare
// `null`) so callers can check individual fields without a top-level guard.
const getStoredData = (): StoredData => {
  if (typeof window === "undefined") {
    return { file: null, details: null, delivery: null, shop: null };
  }
  const fileData = sessionStorage.getItem("uploadedFile");
  const orderDetails = sessionStorage.getItem("orderDetails");
  const deliveryData = sessionStorage.getItem("deliveryData");
  const shopData = sessionStorage.getItem("selectedShop");
  return {
    file: fileData ? JSON.parse(fileData) : null,
    details: orderDetails ? JSON.parse(orderDetails) : null,
    delivery: deliveryData ? JSON.parse(deliveryData) : null,
    shop: shopData ? JSON.parse(shopData) : null,
  };
};

// Generate order number
const generateOrderNumber = () => {
  const year = new Date().getFullYear();
  const count = Math.floor(Math.random() * 9000) + 1000;
  return `PRT-${year}-${count}`;
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

export default function PaymentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderData, setOrderData] = useState<StoredData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"mobile" | "card" | "delivery">("mobile");
  const [mobileNumber, setMobileNumber] = useState("024-XXX-XXXX");
  // `window` doesn't exist during SSR, so the confetti canvas size starts at 0
  // and is filled in from `useEffect` once we're safely on the client.
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Load stored data
  useEffect(() => {
    const data = getStoredData();
    if (!data.file || !data.details || !data.shop) {
      toast.error("Please complete all previous steps");
      router.push("/order/new/upload");
      return;
    }
    setOrderData(data);
    setOrderNumber(generateOrderNumber());
    setIsLoading(false);
  }, [router]);

  // Track window size for the confetti canvas, client-side only.
  useEffect(() => {
    const updateSize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Handle payment
  const handlePayment = () => {
    if (paymentMethod === "mobile" && mobileNumber.length < 10) {
      toast.error("Please enter a valid mobile number");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      setShowConfetti(true);
      toast.success("Payment successful! 🎉");

      // Save order to session
      const order = {
        ...orderData,
        orderNumber,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        paymentMethod,
      };
      sessionStorage.setItem("currentOrder", JSON.stringify(order));

      // Redirect after celebration
      setTimeout(() => {
        setShowConfetti(false);
        router.push("/order/confirmation");
      }, 4000);
    }, 2500);
  };

  // Calculate final total
  const calculateFinalTotal = (): FinalTotal => {
    if (!orderData || !orderData.details || !orderData.shop) {
      return { total: 0, subtotal: 0, deliveryFee: 0, printPrice: 0, binding: "none", paperSize: "a4" };
    }
    const details = orderData.details;
    const shop = orderData.shop;
    const delivery = orderData.delivery;

    const subtotal = details.pricing.total;
    const deliveryFee = delivery?.deliveryType === "delivery" ? shop.deliveryFee : 0;

    return {
      total: subtotal + deliveryFee,
      subtotal,
      deliveryFee,
      printPrice: details.pricing.total,
      binding: details.binding,
      paperSize: details.paperSize,
    };
  };

  const finalTotal = calculateFinalTotal();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-x-hidden ">
      {/* Confetti */}
      {showConfetti && windowSize.width > 0 && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.15}
          colors={["#1D4ED8", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD"]}
        />
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/order/new/shops" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Payment</h1>
                <p className="text-sm text-gray-500">Review and complete your order</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-medium text-blue-600">5</span>
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
                ${step === 5 ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : ""}
                ${step < 5 ? "bg-blue-400 text-white" : ""}
              `}
              >
                {step < 5 ? <CheckCircle className="w-4 h-4" /> : step}
              </div>
              {step < 5 && <div className="flex-1 h-0.5 bg-blue-400" />}
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
        {/* Order Summary Card */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100 bg-blue-50">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Order Summary</h3>
              <span className="ml-auto text-xs text-gray-500">#{orderNumber}</span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* File Info */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{orderData?.file?.name}</p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <span>{orderData?.details?.pages} pages</span>
                  <span>•</span>
                  <span>{orderData?.details?.copies} copies</span>
                  <span>•</span>
                  <span>{orderData?.details?.printType === "bw" ? "Black & White" : "Color"}</span>
                </div>
              </div>
            </div>

            {/* Shop Info */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Printer className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{orderData?.shop?.name}</p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <span>⭐ {orderData?.shop?.rating}</span>
                  <span>•</span>
                  <span>{orderData?.shop?.distance}</span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                {orderData?.delivery?.deliveryType === "delivery" ? (
                  <MapPin className="w-5 h-5 text-blue-600" />
                ) : (
                  <Building2 className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {orderData?.delivery?.deliveryType === "delivery" ? "Doorstep Delivery" : "Pickup In-Store"}
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  {orderData?.delivery?.deliveryType === "delivery" ? (
                    <>
                      <span>{orderData?.delivery?.address}</span>
                      <span>•</span>
                      <span>{orderData?.delivery?.slot}</span>
                    </>
                  ) : (
                    <span>Collect from shop when ready</span>
                  )}
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Printing subtotal</span>
                  <span className="font-medium text-gray-900">GHS {finalTotal.subtotal.toFixed(2)}</span>
                </div>
                {finalTotal.binding !== "none" && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Binding fee</span>
                    <span className="font-medium text-gray-900">
                      GHS {orderData?.details?.pricing?.bindingPrice?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                )}
                {orderData?.delivery?.deliveryType === "delivery" && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery fee</span>
                    <span className="font-medium text-gray-900">GHS {finalTotal.deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-blue-600">GHS {finalTotal.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Method */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Payment Method
          </h3>

          <div className="space-y-3">
            {/* Mobile Money */}
            <button
              onClick={() => setPaymentMethod("mobile")}
              className={`
                w-full p-4 rounded-xl border-2 transition-all text-left
                ${paymentMethod === "mobile" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"}
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${paymentMethod === "mobile" ? "bg-blue-100" : "bg-gray-100"}
                `}
                >
                  <Smartphone
                    className={`
                    w-5 h-5
                    ${paymentMethod === "mobile" ? "text-blue-600" : "text-gray-400"}
                  `}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Mobile Money</p>
                  <p className="text-sm text-gray-500">MTN, Vodafone, AirtelTigo</p>
                </div>
                {paymentMethod === "mobile" && <CheckCircle className="w-5 h-5 text-blue-600" />}
              </div>
            </button>

            {/* Mobile Number Input (conditional) */}
            <AnimatePresence>
              {paymentMethod === "mobile" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pl-14 pr-4 pb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-xl">
                        <span className="text-sm text-gray-600">+233</span>
                      </div>
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="24-XXX-XXXX"
                        className="flex-1 px-4 py-2.5 text-gray-600 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">You'll receive payment confirmation via SMS</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pay on Delivery */}
            <button
              onClick={() => setPaymentMethod("delivery")}
              className={`
                w-full p-4 rounded-xl border-2 transition-all text-left
                ${paymentMethod === "delivery" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"}
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${paymentMethod === "delivery" ? "bg-blue-100" : "bg-gray-100"}
                `}
                >
                  <Wallet
                    className={`
                    w-5 h-5
                    ${paymentMethod === "delivery" ? "text-blue-600" : "text-gray-400"}
                  `}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Pay on Delivery</p>
                  <p className="text-sm text-gray-500">Pay when you receive your order</p>
                </div>
                {paymentMethod === "delivery" && <CheckCircle className="w-5 h-5 text-blue-600" />}
              </div>
            </button>
          </div>

          <div className="mt-4 p-3 bg-blue-50/50 border border-blue-200 rounded-xl flex items-start gap-2">
            <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">Your payment is secure. We use encrypted payment processing.</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="flex items-center justify-end gap-3">
          <Link href="/order/new/shops" className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors">
            Back
          </Link>
          <motion.button
            onClick={handlePayment}
            disabled={isProcessing || isPaid}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            whileHover={{ scale: !isProcessing && !isPaid ? 1.05 : 1 }}
            whileTap={{ scale: !isProcessing && !isPaid ? 0.95 : 1 }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : isPaid ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Paid ✓
              </>
            ) : (
              `Pay GHS ${finalTotal.total.toFixed(2)}`
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

//input