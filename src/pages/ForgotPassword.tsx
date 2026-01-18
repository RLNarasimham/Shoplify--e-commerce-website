import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebase";

interface ForgotPasswordForm {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>();

  const onSubmit: SubmitHandler<ForgotPasswordForm> = async (data) => {
    setLoading(true);
    setMessage(null);
    try {
      await sendPasswordResetEmail(auth, data.email);
      setMessage({ type: "success", text: "Reset link sent! Please check your email inbox." });
    } catch (err: any) {
      setMessage({ 
        type: "error", 
        text: err.message || "Failed to send reset email. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-blue-200 to-blue-300 dark:from-blue-400 dark:via-blue-500 dark:to-blue-600 flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md rounded-2xl shadow-xl bg-white dark:bg-gray-900 p-8">
        <div className="mb-8 flex flex-col items-center">
          <Link to="/login" className="self-start mb-4 text-blue-600 dark:text-blue-400 flex items-center gap-1 text-sm hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Reset Password</h2>
          <p className="mt-2 text-gray-400 text-sm text-center">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>}
          </div>

          {message && (
            <p className={`text-sm mt-1 ${message.type === "success" ? "text-green-500" : "text-red-500"}`}>
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 flex justify-center items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition-colors disabled:opacity-50 shadow-md"
          >
            {loading ? "Sending..." : <><Send className="h-5 w-5" /> Send Reset Link</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
