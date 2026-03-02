import React from "react";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <div className="border-b border-(--foreground)/10">
      <div className="flex container h-16 items-center justify-between px-4 mx-auto">
        <div className="text-xl font-semibold">RAG Chatbot</div>

        <div className="flex gap-2">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="ghost">Sign Up</Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <SignOutButton>
              <Button variant="outline">Sign Out</Button>
            </SignOutButton>
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
