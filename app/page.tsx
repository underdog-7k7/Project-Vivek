"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@/lib/hooks";
import { jwtDecode } from "jwt-decode";
import { useRef } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { idToken, login: authLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (idToken) {
      router.push("/chat");
    }
  }, [idToken, router]);

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential;

    if (!token) {
      console.error("Google credential token missing");
      return;
    }

    const decoded: any = jwtDecode(token);
    setIsLoading(true);

    authLogin(token, {
      name: decoded.name,
      email: decoded.email,
    });
  };

  const handleGoogleError = () => {
    setIsLoading(false);
    console.error("Google login failed");
  };

  const handleCustomButtonClick = () => {
    const googleButton = googleButtonRef.current?.querySelector(
      'div[role="button"]'
    ) as HTMLElement;
    googleButton?.click();
  };

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center p-4 md:p-8 manuscript-bg">
      <div className="w-full max-w-2xl relative z-10">
        {/* Flip Card Container */}
        <div className="flip-card-container" onClick={handleFlipCard}>
          <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
            {/* Front Face - Login */}
            <div className="flip-card-face flip-card-front">
              <div className="bg-card rounded-2xl p-8 md:p-12 shadow-lg border border-border h-full relative">
                {/* Flip Button - Top Right */}
                <button
                  onClick={handleFlipCard}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300 group z-10"
                  aria-label="Learn about Garud Puran"
                >
                  <svg
                    className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>

                {/* Header */}
                <div className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
                    Project Vivek
                  </h1>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    I have always been curious about life after death, exploring
                    different perspectives about what happens after we go for our
                    eternal sleep
                  </p>
                  <br />
                  <p className="text-base text-muted-foreground leading-relaxed">
                    This project is an attempt to connect with one such perspective,
                    a sacred text from my own religious heritage, the Garud Puraan.{" "}
                  </p>
                  <br />
                  <p className="text-base text-muted-foreground leading-relaxed">
                    I hope you enjoy this venture, Would Love your feedback.. And
                    let's connect!
                  </p>
                </div>

                {/* Form Section */}
                <div className="space-y-6" onClick={(e) => e.stopPropagation()}>
                  {/* Sign In Button */}
                  <div>
                    <button
                      onClick={handleCustomButtonClick}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-primary to-primary/85 hover:from-primary/90 hover:to-primary/75 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 group shadow-md hover:shadow-lg"
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      <span>
                        {isLoading ? "Signing in..." : "Sign in to Continue"}
                      </span>
                    </button>
                  </div>

                  {/* Hidden Google Login button */}
                  <div ref={googleButtonRef} className="hidden">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-border/50">
                  <div className="flex items-center justify-center gap-4">
                    {/* LinkedIn Link */}
                    <a
                      href="https://www.linkedin.com/in/animesh-pandey-26b282211/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[#0077B5] transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg
                        className="w-13 h-13"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </div>
                  <br />
                  <p className="text-m text-muted-foreground text-center mb-3">
                    Animesh Pandey - November, 2025
                  </p>
                </div>
              </div>
            </div>

            {/* Back Face - About Garud Puran */}
            <div className="flip-card-face flip-card-back">
              <div className="bg-card rounded-2xl p-8 md:p-12 shadow-lg border border-border h-full relative">
                {/* Flip Button - Top Right */}
                <button
                  onClick={handleFlipCard}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300 group z-10"
                  aria-label="Return to login"
                >
                  <svg
                    className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>

                {/* Decorative Element */}
                <div className="mb-8 flex justify-center">
                  <div className="w-40 h-40 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/10 rounded-xl flex items-center justify-center border-2 border-primary/30">
                    <svg
                      className="w-32 h-32 text-primary"
                      viewBox="0 0 200 200"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <circle cx="100" cy="100" r="80" opacity="0.3" />
                      <path
                        d="M100 30 Q130 60 140 100 Q130 110 100 120 Q70 110 60 100 Q70 60 100 30"
                        fillOpacity="0.1"
                        fill="currentColor"
                      />
                      <path d="M100 30 Q130 60 140 100 Q130 110 100 120 Q70 110 60 100 Q70 60 100 30" />
                      <path d="M60 80 Q40 90 35 110" />
                      <path d="M140 80 Q160 90 165 110" />
                      <path d="M100 120 Q80 140 85 160" />
                      <path d="M100 120 Q120 140 115 160" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    About The Garud Puran
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    Garud Puran is one of the eighteen Mahapuranas, a genre of
                    ancient Indian texts, likely composed in the first millennium CE.
                    It deals with various aspects of life, death, and afterlife,
                    cosmology and others offering insights and spiritual guidance.
                  </p>
                  <br />
                  <p className="text-muted-foreground leading-relaxed text-base">
                    It is said to have 19,000 shlokas. However, the manuscripts that
                    have survived into the modern era have preserved about 8,000
                    verses. The book which serves as the Knowledge source for this RAG
                    is The book Garudapuranasaroddhara, translated by Ernest Wood and
                    SV Subrahmanyam
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
