// src/hooks/use-is-admin.ts
"use client";

import { useState, useEffect } from 'react';

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function checkAdmin() {
      try {
        const response = await fetch('/api/admin/check');
        if (!response.ok) {
          if (isMounted) {
            setIsAdmin(false);
            setIsLoading(false);
          }
          return;
        }

        const data = await response.json();
        if (isMounted) {
          setIsAdmin(!!data.isAdmin);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setIsAdmin(false);
          setIsLoading(false);
        }
      }
    }

    checkAdmin();

    return () => {
      isMounted = false;
    };
  }, []);

  return { isAdmin, isLoading };
}
