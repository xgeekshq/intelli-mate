import { SignInButton, SignedOut } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';

export default function IndexPage() {
  return (
    <div className="flex h-full flex-col items-center gap-10 py-24">
      <p className="w-1/2 text-xl">LANDING PAGE TO BE CREATED.</p>
      <p className="w-1/2 text-xl">
        Welcome to intelli-mate! Explore our cutting-edge product tailored to
        everything AI-related. With intelli-mate, collaboration takes on a whole
        new dimension as it seamlessly combines chat functionality with AI
        participation.
      </p>
      <p className="w-1/2 text-xl">
        Experience the power of interactive discussions where humans and
        intelligent algorithms work hand in hand. We understand the paramount
        importance of information security, particularly in enterprise
        environments.
      </p>
      <p className="w-1/2 text-xl">
        That is why intelli-mate places a strong emphasis on safeguarding your
        data throughout every interaction. Engage with confidence, knowing that
        your valuable information remains protected. Unleash the potential of
        collaborative AI-driven conversations and elevate your enterprise
        experience with intelli-mate. Get ready to embark on a journey where
        innovation merges seamlessly with enhanced security for unparalleled
        productivity.
      </p>
      <div>
        <SignedOut>
          <SignInButton
            mode="modal"
            afterSignInUrl="/rooms"
            afterSignUpUrl="/rooms"
          >
            <Button value="ghost" size="lg">
              Register / Sign in
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
}
