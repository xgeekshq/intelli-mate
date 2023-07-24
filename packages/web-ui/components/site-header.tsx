import Link from 'next/link';
import { siteConfig } from '@/site-config/site';
import { SignedIn, UserButton } from '@clerk/nextjs';

import { buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { MainNav } from '@/components/main-nav';
import { ThemeToggle } from '@/components/theme-toggle';

export function SiteHeader() {
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b px-4">
      <div className="flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center gap-1">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: 'sm',
                  variant: 'ghost',
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <ThemeToggle />
            <div className="pl-3">
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
