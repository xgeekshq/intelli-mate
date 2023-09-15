'use client';

import { RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';

type ErrorLayoutProps = {
  minHeight: 'min-h-[calc(100vh-65px)]' | 'min-h-[calc(100%-41px)]';
};

export default function ErrorLayout({ minHeight }: ErrorLayoutProps) {
  return (
    <div className={`flex ${minHeight} items-center justify-center`}>
      <section className="bg-white dark:bg-gray-900">
        <div className="container px-6 py-12">
          <div className="mx-auto flex max-w-sm flex-col items-center text-center">
            <h1 className="mt-3 text-2xl font-semibold md:text-3xl">
              An unexpected error has occurred
            </h1>
            <p className="mt-4 text-gray-500">
              Unfortunately something goes wrong. Please attempt to refresh the
              page, if the problem persists, kindly consider creating a GitHub
              issue for further assistance.
            </p>

            <div className="mt-6 flex w-full items-center gap-x-3 sm:w-auto">
              <Button variant="outline" onClick={() => location.reload()}>
                <div className="flex items-center gap-2">
                  <RefreshCcw width="16" height="16" />
                  Refresh
                </div>
              </Button>

              <Button variant="link">
                <a
                  href="https://github.com/xgeekshq/intelli-mate/issues"
                  target="_blank"
                >
                  Create an issue
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
