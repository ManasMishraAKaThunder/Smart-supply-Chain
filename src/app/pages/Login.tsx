import { motion } from "motion/react";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft } from "lucide-react";

export default function Login() {
  const { role } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("userRole", role || "");
    // Supplier has its own onboarding flow inside the dashboard
    if (role === "supplier") {
      navigate("/dashboard/supplier");
    } else {
      navigate("/order-entry");
    }
  };

  const getRoleTitle = () => {
    return role?.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="absolute -top-12 left-0 flex items-center text-blue-200/80 hover:text-blue-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to roles
        </button>

        {/* Glassmorphism card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {getRoleTitle()} Login
            </h2>
            <p className="text-blue-200/70">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-blue-200/40 focus:border-blue-400/50 focus:ring-blue-400/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-blue-200/40 focus:border-blue-400/50 focus:ring-blue-400/20"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/20 transition-all duration-300"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <a href="#" className="text-sm text-blue-300/70 hover:text-blue-300 transition-colors block">
              Forgot password?
            </a>
            <p className="text-sm text-blue-200/50">
              Don't have an account?{" "}
              <button
                onClick={() => navigate(`/register/${role}`)}
                className="text-blue-300 hover:text-blue-200 font-medium transition-colors"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
