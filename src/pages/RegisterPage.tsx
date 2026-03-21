import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import ErrorHandler from "../utils/errorHandler";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const containerClass = "relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20";
  const glowEffectClass = "absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-3xl opacity-20 blur-2xl";
  const titleClass = "text-4xl font-black bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent";
  const inputContainerClass = "relative group";
  const inputClass = "pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10 focus:border-cyan-400/50 transition-all";
  const inputPinkClass = "pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10 focus:border-pink-400/50 transition-all";
  const passwordInputPinkClass = "pl-12 pr-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10 focus:border-pink-400/50 transition-all";
  const passwordInputCyanClass = "pl-12 pr-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10 focus:border-cyan-400/50 transition-all";
  const submitButtonClass = "w-full h-12 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-400 hover:via-purple-400 hover:to-cyan-400 text-white font-bold shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-[1.02]";
  const socialButtonClass = "flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsLoading(true);
    try {
      await register(formData.fullName, formData.email, formData.password, "");
      navigate("/");
    } catch (error: unknown) {
      setErrorMessage(ErrorHandler.getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = () => {
    setIsShowPassword(!isShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsShowConfirmPassword(!isShowConfirmPassword);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative"
    >
      <div className={containerClass}>
        <div className={glowEffectClass} />

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-pink-400" />
              <h2 className={titleClass}>
                Đăng ký
              </h2>
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-gray-300">Tham gia cộng đồng game thủ ngay!</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="fullName" className="text-white">Họ và tên</Label>
              <div className={inputContainerClass}>
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400 transition-all group-focus-within:scale-110 group-focus-within:text-pink-300" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Họ và tên"
                  value={formData.fullName}
                  onChange={(e) => handleUpdateField("fullName", e.target.value)}
                  className={inputPinkClass}
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="space-y-2"
            >
              <Label htmlFor="email" className="text-white">Email</Label>
              <div className={inputContainerClass}>
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 transition-all group-focus-within:scale-110 group-focus-within:text-cyan-300" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => handleUpdateField("email", e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
            </motion.div>



            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
              className="space-y-2"
            >
              <Label htmlFor="password" className="text-white">Mật khẩu</Label>
              <div className={inputContainerClass}>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400 transition-all group-focus-within:scale-110 group-focus-within:text-pink-300" />
                <Input
                  id="password"
                  type={isShowPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleUpdateField("password", e.target.value)}
                  className={passwordInputPinkClass}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {isShowPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="confirmPassword" className="text-white">Xác nhận mật khẩu</Label>
              <div className={inputContainerClass}>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 transition-all group-focus-within:scale-110 group-focus-within:text-cyan-300" />
                <Input
                  id="confirmPassword"
                  type={isShowConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleUpdateField("confirmPassword", e.target.value)}
                  className={passwordInputCyanClass}
                  required
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {isShowConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="flex items-start gap-2 pt-2"
            >
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-0"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-300">
                Tôi đồng ý với{" "}
                <a href="#" className="text-cyan-400 hover:text-cyan-300 font-medium">
                  Điều khoản dịch vụ
                </a>{" "}
                và{" "}
                <a href="#" className="text-cyan-400 hover:text-cyan-300 font-medium">
                  Chính sách bảo mật
                </a>
              </label>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-2"
            >
              <Button
                type="submit"
                className={submitButtonClass}
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng ký ngay"}
              </Button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-center text-sm"
          >
            <span className="text-gray-300">Đã có tài khoản? </span>
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
            >
              Đăng nhập ngay
            </Link>
          </motion.div>

          <div className="flex items-center gap-4 mt-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/20"></div>

            <span className="text-gray-400 text-sm whitespace-nowrap">
              Hoặc đăng ký
            </span>

            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/20"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 grid grid-cols-2 gap-4"
          >
            <button className={socialButtonClass}>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm font-medium text-white">Google</span>
            </button>
            <button className={socialButtonClass}>
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-sm font-medium text-white">Facebook</span>
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}