import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ShieldAlert, ShieldCheck, Send, RotateCcw, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { checkSpam } from "@/lib/spamApi";
import { useAuth } from "@/contexts/AuthContext";

const EXAMPLE_COMMENTS = [
  "This song is amazing! Love the beat 🎶",
  "Check out my channel and subscribe for free iPhone giveaway!!! http://spam.com",
  "Gangnam Style changed my life honestly",
  "CLICK HERE to win $1000 gift card www.totallylegit.com",
  "The choreography in this video is legendary",
];

type ResultState = { isSpam: boolean; comment: string } | null;

export default function SpamDetector() {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultState>(null);

  const analyze = async (text?: string) => {
    const input = text ?? comment;
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await checkSpam(input);
      setResult({ isSpam: res.result, comment: input });
    } catch {
      setResult({ isSpam: false, comment: input });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setComment("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 mb-6">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm font-mono font-medium text-muted-foreground">
            SVM-Powered Detection
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          YouTube Spam
          <span className="text-primary"> Detector</span>
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Paste a YouTube comment to classify it as spam or legitimate using a trained LinearSVC model.
        </p>
      </motion.div>

      {/* Input Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="w-full max-w-xl"
      >
        <div className="rounded-xl border bg-card shadow-lg p-6">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Type or paste a YouTube comment…"
            className="min-h-[120px] resize-none font-mono text-sm bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
          <div className="flex gap-3 mt-4">
            <Button
              onClick={() => analyze()}
              disabled={!comment.trim() || loading}
              className="flex-1 gap-2"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <RotateCcw className="h-4 w-4" />
                </motion.div>
              ) : (
                <Send className="h-4 w-4" />
              )}
              {loading ? "Analyzing…" : "Analyze Comment"}
            </Button>
            {result && (
              <Button variant="outline" onClick={reset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={result.isSpam ? "spam" : "ham"}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              className={`mt-4 rounded-xl border-2 p-6 text-center ${
                result.isSpam
                  ? "border-accent bg-accent/5"
                  : "border-success bg-success/5"
              }`}
            >
              {result.isSpam ? (
                <ShieldAlert className="h-10 w-10 text-accent mx-auto mb-3" />
              ) : (
                <ShieldCheck className="h-10 w-10 text-success mx-auto mb-3" />
              )}
              <p className="font-bold text-lg">
                {result.isSpam ? "🚫 Spam Detected" : "✅ Legitimate Comment"}
              </p>
              <p className="text-sm text-muted-foreground mt-1 font-mono">
                "{result.comment.length > 80
                  ? result.comment.slice(0, 80) + "…"
                  : result.comment}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Example comments */}
        <div className="mt-8">
          <p className="text-xs font-mono text-muted-foreground mb-3 uppercase tracking-wider">
            Try an example
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_COMMENTS.map((ex, i) => (
              <button
                key={i}
                onClick={() => {
                  setComment(ex);
                  analyze(ex);
                }}
                disabled={loading}
                className="text-xs px-3 py-1.5 rounded-full border bg-card hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground truncate max-w-[260px]"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-xs text-muted-foreground text-center mt-10 font-mono">
          Running in demo mode • Connect your Flask API via{" "}
          <code className="bg-secondary px-1.5 py-0.5 rounded text-foreground">VITE_API_URL</code>
        </p>
      </motion.div>
    </div>
  );
}
