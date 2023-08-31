'use client';

import * as React from 'react';
import { useEffect } from 'react';

export function useBrowserInfo() {
  const [isMacUser, setIsMacUser] = React.useState<Boolean>(false);

  useEffect(() => {
    setIsMacUser(navigator.userAgent.indexOf('Mac OS X') != -1);
  }, []);

  return { isMacUser };
}
