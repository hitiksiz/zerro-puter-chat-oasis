
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

declare global {
  interface Window {
    puter: any;
  }
}

export const Header = () => {
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load Puter API script
    const script = document.createElement("script");
    script.src = "https://js.puter.com/v2/";
    script.async = true;
    script.onload = checkAuth;
    document.head.appendChild(script);

    // Also add jQuery as requested
    const jqueryScript = document.createElement("script");
    jqueryScript.src = "https://code.jquery.com/jquery-3.6.0.min.js";
    jqueryScript.async = true;
    document.head.appendChild(jqueryScript);
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      if (window.puter && await window.puter.auth.isSignedIn()) {
        const userData = await window.puter.auth.getUser();
        if (userData && userData.email) {
          setUser(userData);
          toast.success(`Welcome back, ${userData.name || userData.email}! 👋`);
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      // First sign in
      await window.puter.auth.signIn();
      
      // Then explicitly get user data
      const userData = await window.puter.auth.getUser();
      if (userData && userData.email) {
        setUser(userData);
        toast.success(`Welcome, ${userData.name || userData.email}! 🎉`);
      } else {
        toast.error("Failed to get user data after sign-in.");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      toast.error("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await window.puter.auth.signOut();
      setUser(null);
      toast.info("You've been signed out. Come back soon! 👋");
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  return (
    <header className="bg-background/70 backdrop-blur-md border-b border-border/50 sticky top-0 z-10">
      <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Puter Chat
          </span>
        </div>
        
        {isLoading ? (
          <Button disabled variant="ghost" size="sm">
            <span className="animate-pulse">Checking...</span>
          </Button>
        ) : user ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarFallback>{user.email ? user.email.charAt(0).toUpperCase() : '?'}</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-sm font-medium">{user.name || user.email}</div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        ) : (
          <Button variant="default" size="sm" onClick={handleSignIn}>
            🔑 Sign In
          </Button>
        )}
      </div>
    </header>
  );
};
