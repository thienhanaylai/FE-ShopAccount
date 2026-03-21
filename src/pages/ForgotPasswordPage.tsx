import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Mail, Key, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { authService } from "../services/auth.service";
import ErrorHandler from "../utils/errorHandler";

export function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const containerClass = "relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20";
    const glowEffectClass = "absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl opacity-20 blur-2xl";
    const titleClass = "text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent";
    const iconWrapperClass = "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl mb-4 shadow-lg shadow-cyan-500/50";
    const inputContainerClass = "relative group";
    const inputClass = "pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10 focus:border-cyan-400/50 transition-all";
    const submitButtonClass = "w-full h-12 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 text-white font-bold shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-[1.02]";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);
        try {
            await authService.forgotPassword(email);
            setIsSubmitted(true);
        } catch (error: unknown) {
            setErrorMessage(ErrorHandler.getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
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

                    <div className="relative text-center">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="inline-flex items-center justify-center mb-6"
                        >
                            <div className="relative w-24 h-24 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
                                <Mail className="w-12 h-12 text-white" />
                            </div>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className={titleClass + " mb-4"}
                        >
                            Kiểm tra email
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-gray-300 mb-8 text-lg"
                        >
                            Link khôi phục mật khẩu đã được gửi đến <br />
                            <span className="text-white font-bold">{email}</span>
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Button
                                onClick={() => setIsSubmitted(false)}
                                className="w-full bg-white/10 hover:bg-white/20 text-white"
                            >
                                Gửi lại link
                            </Button>
                            <div className="mt-4">
                                <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-2">
                                    <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
                                </Link>
                            </div>
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
                <div className={glowEffectClass} />

                <div className="relative">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center mb-8"
                    >
                        <div className={iconWrapperClass}>
                            <Key className="w-8 h-8 text-white" />
                        </div>
                        <div className="inline-flex items-center gap-2 mb-4">
                            <Sparkles className="w-6 h-6 text-cyan-400" />
                            <h2 className={titleClass}>Quên mật khẩu</h2>
                            <Sparkles className="w-6 h-6 text-purple-400" />
                        </div>
                        <p className="text-gray-300">Nhập email để khôi phục tài khoản</p>
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
                            <Label htmlFor="email" className="text-white">Email</Label>
                            <div className={inputContainerClass}>
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 transition-all group-focus-within:scale-110 group-focus-within:text-cyan-300" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={inputClass}
                                    required
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Button type="submit" className={submitButtonClass} disabled={isLoading}>
                                {isLoading ? "Đang gửi..." : "Gửi link khôi phục"}
                            </Button>
                        </motion.div>
                    </form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 text-center text-sm"
                    >
                        <Link
                            to="/login"
                            className="text-gray-300 hover:text-white transition-colors inline-flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
                        </Link>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}