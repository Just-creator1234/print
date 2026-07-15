// app/order/verify/[orderId]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ReactConfetti from "react-confetti";
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle,
  Package, 
  MapPin, 
  Clock, 
  Phone,
  FileText,
  Printer,
  AlertCircle,
  Shield,
  Eye,
  EyeOff,
  Check,
  Home,
  Star,
  Truck
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

// Mock order data for verification
const MOCK_ORDER = {
  orderNumber: "PRT-2026-004",
  fileName: "Assignment_1.pdf",
  pages: 20,
  copies: 2,
  shopName: "Mentor Printing",
  address: "UG - Legon Hall, Room 204",
  landmark: "Behind the cafeteria",
  phone: "024-XXX-XXXX",
  deliverySlot: "12PM - 1PM",
  deliveryCode: "482931",
  total: 18.00,
  status: "DELIVERED"
};

export default function OrderVerificationPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.orderId || "PRT-2026-004";
  
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Focus first input on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  // Handle code input
  const handleCodeChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError(null);

    // Auto advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all digits filled
    if (newCode.every(digit => digit !== "")) {
      handleVerify(newCode.join(""));
    }
  };

  // Handle keydown for backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    const digits = pasted.replace(/\D/g, "").slice(0, 6);
    if (digits.length === 6) {
      const newCode = digits.split("");
      setCode(newCode);
      // Auto submit
      setTimeout(() => handleVerify(digits), 100);
    } else {
      toast.error("Please paste a valid 6-digit code");
    }
  };

  // Verify code
  const handleVerify = async (enteredCode: string) => {
    if (isVerifying || isVerified) return;
    
    setIsVerifying(true);
    setError(null);

    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check against mock code
    if (enteredCode === MOCK_ORDER.deliveryCode) {
      setIsVerified(true);
      setShowConfetti(true);
      toast.success("Delivery verified successfully! 🎉");
      
      // Stop confetti after 4 seconds
      setTimeout(() => {
        setShowConfetti(false);
        router.push('/order/verify-success');
      }, 4000);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError(`Invalid code. ${newAttempts}/5 attempts used`);
      
      // Shake animation trigger
      const container = document.getElementById('code-container');
      if (container) {
        container.classList.add('shake');
        setTimeout(() => container.classList.remove('shake'), 500);
      }
      
      // Clear code on error
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      
      if (newAttempts >= 5) {
        toast.error("Too many failed attempts. Please contact support.");
        setError("Too many failed attempts. Please contact support.");
      }
    }
    
    setIsVerifying(false);
  };

  // Handle resend code
  const handleResendCode = () => {
    toast.success("Verification code resent to your email!");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Confetti */}
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.15}
          colors={['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B']}
        />
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href="/dashboard"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Verify Delivery</h1>
            <p className="text-sm text-gray-500">Confirm receipt of your order</p>
          </div>
        </div>

        {/* Main Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Order Info Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">Order #{orderId}</span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  DELIVERED
                </span>
              </div>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{MOCK_ORDER.fileName}</p>
                  <p className="text-xs text-gray-500">{MOCK_ORDER.pages} pages · {MOCK_ORDER.copies} copies</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Printer className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{MOCK_ORDER.shopName}</p>
                  <p className="text-xs text-gray-500">GHS {MOCK_ORDER.total.toFixed(2)} total</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{MOCK_ORDER.address}</p>
                  <p className="text-xs text-gray-500">{MOCK_ORDER.landmark}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{MOCK_ORDER.deliverySlot}</p>
                  <p className="text-xs text-gray-500">Delivery time slot</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Verification Section */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Your Order Has Been Delivered!
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Enter the 6-digit verification code to confirm receipt
              </p>
            </div>

            {/* Code Input */}
            <div 
              id="code-container"
              className="flex justify-center gap-2 mb-4"
              onPaste={handlePaste}
            >
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`
                    w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                    transition-all bg-gray-50
                    ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
                    ${isVerified ? 'border-emerald-500 bg-emerald-50' : ''}
                  `}
                  disabled={isVerifying || isVerified}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mb-4"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Code Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-2">
              <button
                onClick={() => setShowCode(!showCode)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showCode ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                {showCode ? "Hide" : "Show"} verification code
              </button>

              <button
                onClick={handleResendCode}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Resend Code
              </button>
            </div>

            {/* Verification Code Reveal */}
            <AnimatePresence>
              {showCode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                    <p className="text-sm text-gray-500">Your verification code is:</p>
                    <p className="text-3xl font-bold text-gray-900 tracking-widest">
                      {MOCK_ORDER.deliveryCode}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(MOCK_ORDER.deliveryCode);
                        toast.success("Code copied!");
                      }}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Copy Code
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Verify Button */}
            <button
              onClick={() => handleVerify(code.join(""))}
              disabled={code.some(d => d === "") || isVerifying || isVerified || attempts >= 5}
              className={`
                w-full mt-4 py-3 rounded-xl font-semibold transition-all
                ${code.every(d => d !== "") && !isVerifying && !isVerified && attempts < 5
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isVerifying ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </span>
              ) : isVerified ? (
                <span className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />
                  Verified ✓
                </span>
              ) : (
                "Verify Delivery"
              )}
            </button>

            {/* Warning */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-700">
                ⚠️ Only verify after you have received your printed materials. 
                Verification confirms successful delivery.
              </p>
            </div>
          </motion.div>

          {/* Help Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Need Help?</p>
                <p className="text-xs text-gray-500">
                  Contact the shop directly at <span className="text-blue-600">{MOCK_ORDER.phone}</span>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* CSS for shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}