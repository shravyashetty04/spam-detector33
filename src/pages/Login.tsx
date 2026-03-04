import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged in successfully!");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-border">
        <Link to="/" className="flex items-baseline gap-3">
          <span className="font-display text-3xl tracking-wider text-primary">SPAMSCAN</span>
          <span className="font-mono text-[0.65rem] text-muted-foreground tracking-[3px] uppercase hidden sm:inline">
            // Auth
          </span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <h1 className="font-display text-5xl tracking-[4px]">SIGN IN</h1>
            <p className="font-mono text-xs text-muted-foreground tracking-[3px] uppercase mt-3">
              Access your account
            </p>
          </div>

          <form onSubmit={handleLogin} className="bg-card border border-border p-8 relative space-y-6">
            <div className="absolute top-0 left-0 w-20 h-0.5 bg-primary" />

            <div>
              <label className="font-mono text-[0.65rem] tracking-[3px] text-muted-foreground uppercase block mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-background border border-border text-foreground font-mono text-sm p-3 outline-none focus:border-primary transition-colors placeholder:text-muted-foreground placeholder:italic"
              />
            </div>

            <div>
              <label className="font-mono text-[0.65rem] tracking-[3px] text-muted-foreground uppercase block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-background border border-border text-foreground font-mono text-sm p-3 pr-16 outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[0.6rem] tracking-[1px] text-muted-foreground uppercase hover:text-foreground transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground border-none py-3.5 font-display text-xl tracking-[3px] cursor-pointer hover:opacity-85 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {loading && (
                <span className="inline-block w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin mr-2 align-middle" />
              )}
              SIGN IN
            </button>

            <p className="text-center font-mono text-[0.7rem] text-muted-foreground tracking-wide">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
