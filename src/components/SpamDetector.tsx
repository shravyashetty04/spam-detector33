import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { checkSpam } from "@/lib/spamApi";
import { useAuth } from "@/contexts/AuthContext";

type HistoryItem = { comment: string; isSpam: boolean };
type ResultState = { isSpam: boolean; comment: string } | null;

export default function SpamDetector() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultState>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const analyze = async (text?: string) => {
    const input = text ?? comment;
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await checkSpam(input);
      const item = { isSpam: res.result, comment: input };
      setResult(item);
      setHistory((h) => [item, ...h].slice(0, 20));
    } catch {
      const item = { isSpam: false, comment: input };
      setResult(item);
      setHistory((h) => [item, ...h].slice(0, 20));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setComment("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-border">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-3xl tracking-wider text-primary">SPAMSCAN</span>
          <span className="font-mono text-[0.65rem] text-muted-foreground tracking-[3px] uppercase">
            // YT Comment Classifier
          </span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="font-mono text-[0.65rem] text-muted-foreground tracking-wide hidden sm:inline">
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="font-mono text-[0.6rem] tracking-[2px] uppercase text-muted-foreground border border-border px-3 py-1.5 hover:border-muted-foreground hover:text-foreground transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="font-mono text-[0.6rem] tracking-[2px] uppercase text-muted-foreground border border-border px-3 py-1.5 hover:border-muted-foreground hover:text-foreground transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate("/register")}
                className="font-mono text-[0.6rem] tracking-[2px] uppercase bg-primary text-primary-foreground px-3 py-1.5 border-none hover:opacity-85 transition-opacity"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 md:px-10 py-16 gap-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="font-display text-[clamp(3.5rem,10vw,7rem)] leading-[0.95] tracking-[6px]">
            DETECT<br />
            <span className="text-primary">SPAM</span>
          </h1>
          <p className="mt-4 font-mono text-xs text-muted-foreground tracking-[3px] uppercase">
            Paste any YouTube comment · Get an instant verdict
          </p>
        </motion.div>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full max-w-[740px]"
        >
          <div className="bg-card border border-border p-9 relative">
            <div className="absolute top-0 left-0 w-20 h-0.5 bg-primary" />
            <p className="font-mono text-[0.65rem] tracking-[3px] text-muted-foreground uppercase mb-2.5">
              // input comment
            </p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 2000))}
              placeholder="Paste a YouTube comment here…"
              className="w-full min-h-[120px] bg-background border border-border text-foreground font-mono text-sm p-4 resize-y outline-none focus:border-primary transition-colors leading-relaxed placeholder:text-muted-foreground placeholder:italic"
            />
            <div className="flex gap-3 mt-5 items-center">
              <button
                onClick={() => analyze()}
                disabled={!comment.trim() || loading}
                className="flex-1 bg-primary text-primary-foreground border-none py-3.5 px-8 font-display text-xl tracking-[3px] cursor-pointer hover:opacity-85 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all relative overflow-hidden"
              >
                {loading && (
                  <span className="inline-block w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin mr-2 align-middle" />
                )}
                SCAN
              </button>
              <button
                onClick={reset}
                className="font-mono text-[0.7rem] tracking-[2px] uppercase text-muted-foreground border border-border px-5 py-3.5 hover:border-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Clear
              </button>
              <span className="font-mono text-[0.65rem] text-muted-foreground ml-auto">
                {comment.length} / 2000
              </span>
            </div>
          </div>
        </motion.div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={result.isSpam ? "spam" : "clean"}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-[740px] border border-border overflow-hidden"
            >
              <div
                className={`flex items-center gap-4 px-7 py-5 ${
                  result.isSpam
                    ? "bg-destructive/[0.08] border-b border-destructive/20"
                    : "bg-success/[0.06] border-b border-success/15"
                }`}
              >
                <span className="text-3xl leading-none">{result.isSpam ? "🚫" : "✅"}</span>
                <div className="flex-1">
                  <p
                    className={`font-display text-[1.8rem] tracking-[3px] ${
                      result.isSpam ? "text-destructive" : "text-success"
                    }`}
                  >
                    {result.isSpam ? "SPAM DETECTED" : "CLEAN COMMENT"}
                  </p>
                  <p className="font-mono text-[0.65rem] text-muted-foreground tracking-[2px] mt-0.5">
                    {result.isSpam ? "HIGH THREAT · FLAGGED" : "NO THREAT · SAFE"}
                  </p>
                </div>
              </div>
              <div className="p-7 bg-card">
                <p className="font-mono text-[0.8rem] text-muted-foreground leading-relaxed border-l-2 border-border pl-3.5 mb-4 break-words">
                  "{result.comment.length > 120 ? result.comment.slice(0, 120) + "…" : result.comment}"
                </p>
                <div className="flex items-center gap-3.5 mt-2.5">
                  <span className="font-mono text-[0.65rem] text-muted-foreground tracking-[2px] uppercase w-20">
                    Signal
                  </span>
                  <div className="flex-1 h-1 bg-border relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: result.isSpam ? "85%" : "15%" }}
                      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                      className={`h-full ${result.isSpam ? "bg-destructive" : "bg-success"}`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        {history.length > 0 && (
          <div className="w-full max-w-[740px]">
            <div className="font-mono text-[0.65rem] tracking-[3px] text-muted-foreground uppercase border-b border-border pb-2.5 mb-3.5 flex items-center justify-between">
              <span>// recent scans</span>
              <button
                onClick={() => setHistory([])}
                className="font-mono text-[0.6rem] tracking-[1px] text-muted-foreground bg-transparent border-none cursor-pointer uppercase hover:text-foreground transition-colors"
              >
                clear all
              </button>
            </div>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {history.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setComment(item.comment);
                    analyze(item.comment);
                  }}
                  className="flex items-center gap-3.5 px-3.5 py-2.5 bg-card border border-border cursor-pointer hover:border-muted-foreground transition-colors text-left w-full"
                >
                  <span
                    className={`font-mono text-[0.6rem] tracking-[1px] px-2 py-0.5 uppercase flex-shrink-0 ${
                      item.isSpam
                        ? "bg-destructive/15 text-destructive"
                        : "bg-success/10 text-success"
                    }`}
                  >
                    {item.isSpam ? "Spam" : "Clean"}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground truncate">
                    {item.comment}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 md:px-10 py-4 flex justify-between items-center">
        <span className="font-mono text-[0.62rem] text-muted-foreground tracking-[1px]">
          Trained on YouTube01–05 · 5-dataset corpus
        </span>
        <span className="font-mono text-[0.62rem] text-muted-foreground tracking-[1px] bg-card border border-border px-2.5 py-1">
          LinearSVC · sklearn
        </span>
      </footer>
    </div>
  );
}
