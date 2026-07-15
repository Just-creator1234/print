// app/order/confirmation/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ReactConfetti from "react-confetti";
import {
  CheckCircle,
  PartyPopper,
  FileText,
  Printer,
  MapPin,
  Package,
  ArrowRight,
  Share2,
  Copy,
  Check,
  Home,
  ShoppingBag,
  Star,
  Clock as ClockIcon,
  Shield,
  type LucideIcon,
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
  waitTime: string;
}

interface CurrentOrder {
  file: UploadedFile | null;
  details: OrderDetails | null;
  delivery: DeliveryData | null;
  shop: SelectedShop | null;
  orderNumber: string;
  status: string;
  createdAt: string;
  paymentMethod: "mobile" | "card" | "delivery";
}

interface StatusStep {
  id: number;
  label: string;
  icon: LucideIcon;
  time: string;
}

// Get stored order from session
const getStoredData = (): CurrentOrder | null => {
  if (typeof window === "undefined") return null;
  const order = sessionStorage.getItem("currentOrder");
  return order ? (JSON.parse(order) as CurrentOrder) : null;
};

export default function OrderConfirmationPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<CurrentOrder | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Load order data
  useEffect(() => {
    const data = getStoredData();
    if (!data) {
      toast.error("No order found");
      router.push("/dashboard");
      return;
    }
    setOrderData(data);
    setIsLoading(false);

    // Get window size for confetti (client-only; `window` isn't available during SSR)
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  // Handle copy order number
  const handleCopy = () => {
    if (orderData?.orderNumber) {
      navigator.clipboard.writeText(orderData.orderNumber);
      setCopied(true);
      toast.success("Order number copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "PrintPulse Order",
          text: `My PrintPulse order #${orderData?.orderNumber} is confirmed!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      toast.success("Order details copied to clipboard");
    }
  };

  // Total paid: subtotal plus delivery fee, but only if this order was a delivery.
  // (The original version always added `shop.deliveryFee`, even for pickup orders,
  // which would silently overcharge on the confirmation screen.)
  const getTotalPaid = (): number => {
    const subtotal = orderData?.details?.pricing?.total ?? 0;
    const deliveryFee =
      orderData?.delivery?.deliveryType === "delivery" ? orderData?.shop?.deliveryFee ?? 0 : 0;
    return subtotal + deliveryFee;
  };

  // Status timeline steps
  const statusSteps: StatusStep[] = [
    { id: 1, label: "Order Placed", icon: CheckCircle, time: "Just now" },
    { id: 2, label: "Shop Confirms", icon: Printer, time: "~15 min" },
    { id: 3, label: "Printing", icon: FileText, time: "~30 min" },
    { id: 4, label: "Ready", icon: Package, time: "~45 min" },
    orderData?.delivery?.deliveryType === "delivery"
      ? { id: 5, label: "Delivered", icon: MapPin, time: "~60 min" }
      : { id: 5, label: "Collected", icon: ShoppingBag, time: "~60 min" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50  overflow-x-hidden ">
      {/* Confetti */}
      {showConfetti && windowSize.width > 0 && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={true}
          numberOfPieces={200}
          gravity={0.12}
          colors={["#1D4ED8", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD"]}
        />
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="text-center mb-8"
        >
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
              >
                <CheckCircle className="w-12 h-12 text-blue-600" />
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute -top-2 -right-2"
            >
              <PartyPopper className="w-8 h-8 text-blue-500" />
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            Order Placed Successfully! 🎉
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500"
          >
            Your order has been received and is being processed
          </motion.p>
        </motion.div>

        {/* Order Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden mb-6"
        >
          {/* Order Header */}
          <div className="p-6 bg-blue-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold text-gray-900">{orderData?.orderNumber}</p>
                  <button onClick={handleCopy} className="p-1.5 hover:bg-white/50 rounded-lg transition-colors">
                    {copied ? <Check className="w-4 h-4 text-blue-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                  </button>
                  <button onClick={handleShare} className="p-1.5 hover:bg-white/50 rounded-lg transition-colors">
                    <Share2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Status</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                  PENDING
                </span>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="p-6 space-y-4">
            {/* File */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{orderData?.file?.name}</p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <span>{orderData?.details?.pages} pages</span>
                  <span>•</span>
                  <span>{orderData?.details?.copies} copies</span>
                  <span>•</span>
                  <span>{orderData?.details?.printType === "bw" ? "Black & White" : "Color"}</span>
                  {orderData?.details?.binding !== "none" && (
                    <>
                      <span>•</span>
                      <span className="capitalize">{orderData?.details?.binding}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Shop */}
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
                  <span>•</span>
                  <span>~{orderData?.shop?.waitTime}</span>
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                {orderData?.delivery?.deliveryType === "delivery" ? (
                  <MapPin className="w-5 h-5 text-blue-600" />
                ) : (
                  <Package className="w-5 h-5 text-blue-600" />
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

            {/* Total */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-500">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900">GHS {getTotalPaid().toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Payment Method</p>
                <p className="text-sm font-medium text-gray-700 capitalize">
                  {orderData?.paymentMethod === "mobile" ? "Mobile Money" : "Pay on Delivery"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Estimated Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <ClockIcon className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Estimated Timeline</h3>
            <span className="ml-auto text-xs text-gray-400">Approximate times</span>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "100%" }}
                transition={{ duration: 1.5, delay: 0.8 }}
                className="w-full bg-blue-500 rounded-full"
              />
            </div>

            {/* Steps */}
            <div className="space-y-6">
              {statusSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div
                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10
                    ${index === 0 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}
                  `}
                  >
                    {index === 0 ? <CheckCircle className="w-5 h-5" /> : <span className="text-sm font-medium">{step.id}</span>}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className={`text-sm font-medium ${index === 0 ? "text-gray-900" : "text-gray-500"}`}>{step.label}</p>
                    <p className="text-xs text-gray-400">{step.time}</p>
                  </div>
                  {index === 0 && <span className="text-xs text-blue-600 font-medium">✓ Complete</span>}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Delivery Code (if delivery) */}
        {orderData?.delivery?.deliveryType === "delivery" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-blue-50 rounded-2xl border border-blue-200 p-6 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Delivery Code</p>
                  <p className="text-2xl font-bold text-gray-900 tracking-widest">482931</p>
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("482931");
                  toast.success("Delivery code copied!");
                }}
                className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-blue-600 hover:shadow-md transition-all"
              >
                Copy Code
              </button>
            </div>
            <p className="text-xs text-blue-700 mt-3">⚠️ Keep this code safe. You'll need it to verify delivery receipt.</p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link
            href="/dashboard"
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <Link
            href={`/order/${orderData?.orderNumber}`}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            Track Order
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Rating Prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm text-center"
        >
          <p className="text-sm text-gray-600 mb-2">Enjoyed your experience?</p>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="p-1 hover:scale-110 transition-transform"
                onClick={() => toast.success(`Thanks for rating ${star} ⭐`)}
              >
                <Star className="w-6 h-6 text-gray-300 hover:text-blue-400 transition-colors" />
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">Tap a star to rate your experience</p>
        </motion.div>
      </div>
    </div>
  );
}