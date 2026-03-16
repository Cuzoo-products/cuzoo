import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0c] text-white overflow-hidden">
      {/* Background: gradient mesh + noise */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 70% 20%, rgba(77, 55, 179, 0.25), transparent), radial-gradient(ellipse 60% 40% at 20% 80%, rgba(77, 55, 179, 0.12), transparent)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl mx-auto text-center">
          {/* 404 number: oversized, clipped, with gradient */}
          <div className="relative mb-2">
            <span
              className="block text-[clamp(6rem,18vw,12rem)] font-black leading-none tracking-tighter tabular-nums select-none"
              style={{
                background: "linear-gradient(135deg, #4D37B3 0%, #7c5ce8 50%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              404
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-semibold text-white/90 mb-2 tracking-tight">
            Page not found
          </h1>
          <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto mb-10">
            The link might be broken or the page has been moved. No worries—you can head back or start from home.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto bg-white text-[#0a0a0c] hover:bg-white/90 font-medium gap-2 rounded-full px-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 hover:border-white/30 font-medium gap-2 rounded-full px-6"
            >
              <Link to="/">
                <Home className="w-4 h-4" />
                Home
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-6 text-center">
        <p className="text-white/30 text-xs">
          If this seems wrong,{" "}
          <a href="mailto:support@cuzoo.com" className="text-white/50 hover:text-white/70 underline underline-offset-2">
            contact support
          </a>
        </p>
      </footer>
    </div>
  );
};

export default NotFoundPage;
