import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, CheckCircle2, Shield, Sparkles, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { authService } from "../services/auth.service";
import ErrorHandler from "../utils/errorHandler";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const checkPasswordStrength = (password: string) => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handlePasswordChange = (value: string) => {
    setFormData((prev) => ({ ...prev, password: value }));
    checkPasswordStrength(value);
  };

  const handleConfirmPasswordChange = (value: string) => {
    setFormData((prev) => ({ ...prev, confirmPassword: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Mật khẩu không khớp.");
      return;
    }

    const token = searchParams.get("token") || "";
    if (!token) {
      setErrorMessage("Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(token, formData.password);
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: unknown) {
      if (ErrorHandler.isNotFoundError(error)) {
        setErrorMessage("Hệ thống chưa hỗ trợ endpoint đặt lại mật khẩu. Vui lòng liên hệ quản trị viên.");
      } else {
        setErrorMessage(ErrorHandler.getErrorMessage(error));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthScore = () => {
    return Object.values(passwordStrength).filter(Boolean).length;
  };

  const getStrengthColor = () => {
    const score = getStrengthScore();
    if (score <= 2) return "from-red-500 to-orange-500";
    if (score <= 3) return "from-yellow-500 to-orange-500";
    if (score <= 4) return "from-blue-500 to-cyan-500";
    return "from-green-500 to-emerald-500";
  };

  const getStrengthText = () => {
    const score = getStrengthScore();
    if (score <= 2) return "Yếu";
    if (score <= 3) return "Trung bình";
    if (score <= 4) return "Khá";
    return "Mạnh mẽ";
  };

  const togglePasswordVisibility = () => setIsShowPassword(!isShowPassword);
  const toggleConfirmPasswordVisibility = () => setIsShowConfirmPassword(!isShowConfirmPassword);

  const containerClass = "relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20";
  const glowSuccessClass = "absolute -inset-0.5 bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-500 rounded-3xl opacity-20 blur-2xl animate-pulse";
  const glowFormClass = "absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-3xl opacity-20 blur-2xl";
  const inputContainerClass = "relative group";
  const passwordInputClass = "pl-12 pr-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10 focus:border-purple-400/50 transition-all";
  const confirmPasswordInputClass = "pl-12 pr-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10 focus:border-pink-400/50 transition-all";
  const submitButtonClass = "w-full h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-400 hover:via-pink-400 hover:to-cyan-400 text-white font-bold shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative"
      >
        <div className={containerClass}>
          <div className={glowSuccessClass} />
          
          <div className="relative text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center mb-6"
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full blur-2xl"
                />
                <div className="relative w-28 h-28 bg-gradient-to-br from-green-400 via-emerald-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl">
                  <CheckCircle2 className="w-16 h-16 text-white" />
                </div>
              </div>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-black bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-4"
            >
              Thành công!
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-300 mb-8 text-lg"
            >
              Mật khẩu của bạn đã được đặt lại thành công.
              <br />
              Bạn sẽ được chuyển hướng đến trang đăng nhập...
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-2"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 bg-cyan-400 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 bg-purple-400 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                className="w-2 h-2 bg-pink-400 rounded-full"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative"
    >
      <div className={containerClass}>
        <div className={glowFormClass} />
        
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg shadow-purple-500/50">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h2 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Đặt lại mật khẩu
              </h2>
              <Sparkles className="w-6 h-6 text-pink-400" />
            </div>
            <p className="text-gray-300">Tạo mật khẩu mạnh mẽ cho tài khoản</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="rounded-lg border border-red-300/60 bg-red-500/15 px-4 py-3 text-sm text-red-100">
                {errorMessage}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="password" className="text-white">Mật khẩu mới</Label>
              <div className={inputContainerClass}>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 transition-all group-focus-within:scale-110 group-focus-within:text-purple-300" />
                <Input
                  id="password"
                  type={isShowPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className={passwordInputClass}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {isShowPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <AnimatePresence>
                {formData.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 pt-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        Độ mạnh:
                      </span>
                      <span className={`text-sm font-bold bg-gradient-to-r ${getStrengthColor()} bg-clip-text text-transparent`}>
                        {getStrengthText()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-2">
                      {[...Array(5)].map((_, index) => (
                        <motion.div
                          key={index}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className={`h-2 rounded-full ${
                            index < getStrengthScore()
                              ? `bg-gradient-to-r ${getStrengthColor()}`
                              : "bg-white/10"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                      <div className={`flex items-center gap-2 leading-none ${passwordStrength.hasMinLength ? "text-green-400" : "text-gray-500"}`}>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>8+ ký tự</span>
                      </div>
                      <div className={`flex items-center gap-2 leading-none ${passwordStrength.hasUpperCase ? "text-green-400" : "text-gray-500"}`}>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Chữ hoa</span>
                      </div>
                      <div className={`flex items-center gap-2 leading-none ${passwordStrength.hasLowerCase ? "text-green-400" : "text-gray-500"}`}>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Chữ thường</span>
                      </div>
                      <div className={`flex items-center gap-2 leading-none ${passwordStrength.hasNumber ? "text-green-400" : "text-gray-500"}`}>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Số</span>
                      </div>
                      <div className={`flex items-center gap-2 leading-none ${passwordStrength.hasSpecialChar ? "text-green-400" : "text-gray-500"}`}>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Ký tự đặc biệt</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <Label htmlFor="confirmPassword" className="text-white">Xác nhận mật khẩu</Label>
              <div className={inputContainerClass}>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400 transition-all group-focus-within:scale-110 group-focus-within:text-pink-300" />
                <Input
                  id="confirmPassword"
                  type={isShowConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  className={confirmPasswordInputClass}
                  required
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {isShowConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <AnimatePresence>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-red-400"
                  >
                    ⚠️ Mật khẩu không khớp
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-2"
            >
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  getStrengthScore() < 3 ||
                  formData.password !== formData.confirmPassword
                }
                className={submitButtonClass}
              >
                <Shield className="w-5 h-5 mr-2" />
                {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
              </Button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-sm"
          >
            <span className="text-gray-300">Nhớ mật khẩu? </span>
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
              Đăng nhập ngay
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}