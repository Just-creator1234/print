// app/order/new/shops/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Star,
  CheckCircle,
  AlertCircle,
  Info,
  Filter,
  ChevronDown,
  Store,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

// ---------- Types ----------

interface Shop {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  status: "open" | "busy" | "closed";
  pricePerSheet: number;
  deliveryFee: number;
  distance: string;
  distanceValue: number;
  rating: number;
  reviews: number;
  waitTime: string;
  queue: string;
  deliveryRadius: number;
  experience: string;
  image: string;
}

interface OrderPricing {
  total: number;
}

interface OrderDetails {
  pricing: OrderPricing;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
  pages: number;
}

interface DeliveryData {
  deliveryType: "delivery" | "pickup";
  [key: string]: unknown;
}

interface StoredData {
  file: UploadedFile | null;
  details: OrderDetails | null;
  delivery: DeliveryData | null;
}

// ---------- Mock shop data ----------

const MOCK_SHOPS: Shop[] = [
  {
    id: "shop1",
    name: "Mentor Printing",
    address: "Central Campus, UG",
    lat: 5.651,
    lng: -0.186,
    status: "open",
    pricePerSheet: 0.4,
    deliveryFee: 2.0,
    distance: "0.3 km",
    distanceValue: 0.3,
    rating: 4.8,
    reviews: 120,
    waitTime: "15 min",
    queue: "Light",
    deliveryRadius: 5,
    experience: "10+ years",
    image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=100&h=100&fit=crop",
  },
  {
    id: "shop2",
    name: "Mistic Printing",
    address: "East Legon Campus",
    lat: 5.648,
    lng: -0.182,
    status: "busy",
    pricePerSheet: 0.6,
    deliveryFee: 2.5,
    distance: "0.7 km",
    distanceValue: 0.7,
    rating: 4.5,
    reviews: 85,
    waitTime: "40 min",
    queue: "Heavy",
    deliveryRadius: 3,
    experience: "7+ years",
    image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=100&h=100&fit=crop",
  },
  {
    id: "shop3",
    name: "Golden Print",
    address: "West Campus Mall",
    lat: 5.645,
    lng: -0.178,
    status: "closed",
    pricePerSheet: 0.6,
    deliveryFee: 3.0,
    distance: "1.2 km",
    distanceValue: 1.2,
    rating: 4.2,
    reviews: 45,
    waitTime: "--",
    queue: "Closed",
    deliveryRadius: 2,
    experience: "5+ years",
    image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=100&h=100&fit=crop",
  },
  {
    id: "shop4",
    name: "Emmanuel Printing",
    address: "North Campus",
    lat: 5.655,
    lng: -0.19,
    status: "open",
    pricePerSheet: 0.6,
    deliveryFee: 2.0,
    distance: "1.5 km",
    distanceValue: 1.5,
    rating: 4.6,
    reviews: 98,
    waitTime: "20 min",
    queue: "Moderate",
    deliveryRadius: 4,
    experience: "8+ years",
    image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=100&h=100&fit=crop",
  },
];

// Get stored data from session. Returns a fully-shaped object (never null) so
// callers don't have to null-check the whole result, only its individual fields.
const getStoredData = (): StoredData => {
  if (typeof window === "undefined") {
    return { file: null, details: null, delivery: null };
  }
  const fileData = sessionStorage.getItem("uploadedFile");
  const orderDetails = sessionStorage.getItem("orderDetails");
  const deliveryData = sessionStorage.getItem("deliveryData");
  return {
    file: fileData ? JSON.parse(fileData) : null,
    details: orderDetails ? JSON.parse(orderDetails) : null,
    delivery: deliveryData ? JSON.parse(deliveryData) : null,
  };
};

// Filter options
const FILTERS = [
  { id: "all", label: "All Shops" },
  { id: "open", label: "Open" },
  { id: "busy", label: "Busy" },
  { id: "closest", label: "Closest" },
  { id: "cheapest", label: "Cheapest" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

const statusConfig: Record<
  Shop["status"],
  { label: string; color: string; dotColor: string; icon: typeof Zap }
> = {
  open: {
    label: "Open",
    color: "bg-blue-100 text-blue-700",
    dotColor: "bg-blue-500",
    icon: Zap,
  },
  busy: {
    label: "Busy",
    color: "bg-amber-100 text-amber-700",
    dotColor: "bg-amber-500",
    icon: Users,
  },
  closed: {
    label: "Closed",
    color: "bg-red-100 text-red-700",
    dotColor: "bg-red-500",
    icon: Store,
  },
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

export default function ShopSelectionPage() {
  const router = useRouter();
  const [shops] = useState<Shop[]>(MOCK_SHOPS);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterId>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pricing, setPricing] = useState<OrderPricing | null>(null);
  const [deliveryData, setDeliveryData] = useState<DeliveryData | null>(null);

  // Load stored data
  useEffect(() => {
    const data = getStoredData();
    if (!data.file || !data.details) {
      toast.error("Please complete the previous steps");
      router.push("/order/new/upload");
      return;
    }
    setPricing(data.details.pricing);
    setDeliveryData(data.delivery);
    setIsLoading(false);
  }, [router]);

  // Calculate total price for a shop
  const calculateTotal = (shop: Shop) => {
    if (!pricing) return { total: 0, deliveryFee: 0, subtotal: 0 };
    const deliveryFee = deliveryData?.deliveryType === "delivery" ? shop.deliveryFee : 0;
    const subtotal = pricing.total;
    return {
      total: subtotal + deliveryFee,
      deliveryFee: deliveryFee,
      subtotal: subtotal,
    };
  };

  // Filter shops
  const getFilteredShops = (): Shop[] => {
    let filtered = [...shops];

    switch (selectedFilter) {
      case "open":
        filtered = filtered.filter((s) => s.status === "open");
        break;
      case "busy":
        filtered = filtered.filter((s) => s.status === "busy");
        break;
      case "closest":
        filtered = filtered.sort((a, b) => a.distanceValue - b.distanceValue);
        break;
      case "cheapest":
        filtered = filtered.sort((a, b) => a.pricePerSheet - b.pricePerSheet);
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredShops = getFilteredShops();

  // Handle shop selection
  const handleSelectShop = (shopId: string) => {
    setSelectedShop(shopId);
    toast.success("Shop selected!");

    // Save shop to session
    const selected = shops.find((s) => s.id === shopId);
    if (selected) {
      sessionStorage.setItem("selectedShop", JSON.stringify(selected));
    }
  };

  // Handle continue to payment
  const handleContinue = () => {
    if (!selectedShop) {
      toast.error("Please select a shop");
      return;
    }
    router.push("/order/new/payment");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading shops...</p>
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
              <Link href="/order/new/delivery" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Select Shop</h1>
                <p className="text-sm text-gray-500">Choose a printing shop near you</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-medium text-blue-600">4</span>
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
                ${step === 4 ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : ""}
                ${step < 4 ? "bg-blue-400 text-white" : ""}
                ${step > 4 ? "bg-gray-200 text-gray-400" : ""}
              `}
              >
                {step < 4 ? <CheckCircle className="w-4 h-4" /> : step}
              </div>
              {step < 5 && (
                <div
                  className={`
                  flex-1 h-0.5 transition-all
                  ${step < 4 ? "bg-blue-400" : "bg-gray-200"}
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
        {/* Filters */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-blue-400 transition-colors"
              >
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Filter</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </button>
              {selectedFilter !== "all" && (
                <span className="text-xs text-blue-600 font-medium">
                  • {FILTERS.find((f) => f.id === selectedFilter)?.label}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>{filteredShops.length} shops nearby</span>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 p-3 bg-white border border-gray-200 rounded-xl flex flex-wrap gap-2"
              >
                {FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${
                        selectedFilter === filter.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }
                    `}
                  >
                    {filter.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Shop Cards */}
        <div className="space-y-4">
          {filteredShops.map((shop) => {
            const status = statusConfig[shop.status];
            const total = calculateTotal(shop);
            const isSelected = selectedShop === shop.id;
            const isDisabled = shop.status === "closed";

            return (
              <motion.div
                key={shop.id}
                variants={itemVariants}
                whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                className={`
                  relative bg-white rounded-2xl border-2 transition-all overflow-hidden
                  ${isSelected ? "border-blue-600 shadow-lg shadow-blue-100" : "border-gray-200"}
                  ${isDisabled ? "opacity-70" : ""}
                `}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-0 right-0">
                    <div className="w-16 h-16">
                      <div className="absolute top-0 right-0 w-0 h-0 border-t-[64px] border-r-[64px] border-t-transparent border-r-blue-600"></div>
                      <CheckCircle className="absolute top-1.5 right-1.5 w-4 h-4 text-white" />
                    </div>
                  </div>
                )}

                {/* Shop Header */}
                <div
                  className={`p-4 cursor-pointer ${isDisabled ? "cursor-not-allowed" : ""}`}
                  onClick={() => !isDisabled && handleSelectShop(shop.id)}
                >
                  <div className="flex items-start gap-4">
                    {/* Shop Avatar */}
                    <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Store className="w-8 h-8 text-blue-600" />
                    </div>

                    {/* Shop Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900">{shop.name}</h3>
                            <span
                              className={`
                              inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                              ${status.color}
                            `}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor} animate-pulse`}></span>
                              {status.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{shop.distance}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-blue-500 fill-current" />
                              <span>
                                {shop.rating} ({shop.reviews})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                          GHS {shop.pricePerSheet.toFixed(2)}/sheet
                        </span>
                        {shop.queue !== "Closed" && (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                            {shop.queue} queue
                          </span>
                        )}
                        {deliveryData?.deliveryType === "delivery" && (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                            +GHS {shop.deliveryFee.toFixed(2)} delivery
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {shop.experience}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      {!isDisabled ? (
                        <>
                          <p className="text-sm text-gray-500">Estimated Total</p>
                          <p className="text-2xl font-bold text-gray-900">GHS {total.total.toFixed(2)}</p>
                          <p className="text-xs text-gray-400">
                            Includes {deliveryData?.deliveryType === "delivery" ? "delivery" : "pickup"}
                          </p>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-red-500">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Currently Closed</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => !isDisabled && handleSelectShop(shop.id)}
                      disabled={isDisabled}
                      className={`
                        px-6 py-2.5 rounded-xl font-medium transition-all
                        ${
                          isSelected
                            ? "bg-blue-700 text-white"
                            : isDisabled
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
                        }
                      `}
                    >
                      {isSelected ? "Selected ✓" : isDisabled ? "Unavailable" : "Select Shop"}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info Box */}
        <motion.div variants={itemVariants} className="mt-6">
          <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-700">
                {deliveryData?.deliveryType === "delivery"
                  ? "Selected shops can deliver to your location. Delivery fees vary by shop."
                  : "Choose a shop for pickup. You'll receive a notification when your order is ready."}
              </p>
              <p className="text-xs text-blue-600 mt-1">💡 Tip: Check shop ratings and queue status before selecting</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="mt-8 flex items-center justify-end gap-3">
          <Link href="/order/new/delivery" className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors">
            Back
          </Link>
          <motion.button
            onClick={handleContinue}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: selectedShop ? 1.05 : 1 }}
            whileTap={{ scale: selectedShop ? 0.95 : 1 }}
            disabled={!selectedShop}
          >
            Continue →
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}