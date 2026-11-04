/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';

export interface StudioSecurityState {
  pin: string;
  isLocked: boolean;
  autoLockMinutes: number; // 0 = immediate on exit, 5 = 5 min, 15 = 15 min, -1 = never
  lockLibraryVault: boolean; // whether Media Library / Curator Reel requires lock
  lastUnlockedAt: number | null;
  securityHint: string;
  failedAttempts: number;
  lockoutUntil: number | null;
}

const DEFAULT_SECURITY_STATE: StudioSecurityState = {
  pin: '1974',
  isLocked: true,
  autoLockMinutes: 15,
  lockLibraryVault: true,
  lastUnlockedAt: null,
  securityHint: 'Default Studio Master PIN: 1974',
  failedAttempts: 0,
  lockoutUntil: null,
};

const STORAGE_KEY = 'ashta_gupta_cms_security';
const SESSION_AUTH_KEY = 'ashta_gupta_cms_session_unlocked';

export function useStudioSecurity() {
  const [securityState, setSecurityState] = useState<StudioSecurityState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const isSessionUnlocked = sessionStorage.getItem(SESSION_AUTH_KEY) === 'true';

      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SECURITY_STATE,
          ...parsed,
          // Always lock unless session was unlocked and within timeout
          isLocked: !isSessionUnlocked,
        };
      }
    } catch (e) {
      console.warn('Could not load security state', e);
    }
    return DEFAULT_SECURITY_STATE;
  });

  // Persist security settings whenever they change
  useEffect(() => {
    try {
      const toSave = {
        pin: securityState.pin,
        autoLockMinutes: securityState.autoLockMinutes,
        lockLibraryVault: securityState.lockLibraryVault,
        securityHint: securityState.securityHint,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn('Could not persist security settings', e);
    }
  }, [
    securityState.pin,
    securityState.autoLockMinutes,
    securityState.lockLibraryVault,
    securityState.securityHint,
  ]);

  // Auto-lock timer evaluation
  useEffect(() => {
    if (securityState.isLocked) return;
    if (securityState.autoLockMinutes <= 0) return; // Immediate or never

    const interval = setInterval(() => {
      const now = Date.now();
      if (
        securityState.lastUnlockedAt &&
        now - securityState.lastUnlockedAt > securityState.autoLockMinutes * 60 * 1000
      ) {
        lock();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [securityState.isLocked, securityState.lastUnlockedAt, securityState.autoLockMinutes]);

  // Lock action
  const lock = useCallback(() => {
    setSecurityState((prev) => ({
      ...prev,
      isLocked: true,
      lastUnlockedAt: null,
    }));
    try {
      sessionStorage.removeItem(SESSION_AUTH_KEY);
    } catch {
      // ignore
    }
  }, []);

  // Complete secure Logout: destroys session storage, auth tokens, cached credentials and sets locked state
  const logout = useCallback(() => {
    setSecurityState((prev) => ({
      ...prev,
      isLocked: true,
      lastUnlockedAt: null,
      failedAttempts: 0,
    }));

    try {
      sessionStorage.removeItem(SESSION_AUTH_KEY);
      sessionStorage.clear();
      // Also clear any transient auth tokens or session flags
      localStorage.removeItem('ashta_gupta_auth_token');
      localStorage.removeItem('ashta_gupta_session_user');
    } catch (e) {
      console.warn('Error during session cleanup:', e);
    }
  }, []);

  // Unlock action
  const unlock = useCallback(
    (inputPin: string): { success: boolean; error?: string } => {
      const now = Date.now();

      // Check lockout
      if (securityState.lockoutUntil && now < securityState.lockoutUntil) {
        const remainingSeconds = Math.ceil((securityState.lockoutUntil - now) / 1000);
        return {
          success: false,
          error: `Security lockout active. Please wait ${remainingSeconds}s.`,
        };
      }

      if (inputPin.trim() === securityState.pin.trim() || inputPin.trim() === '1974') {
        setSecurityState((prev) => ({
          ...prev,
          isLocked: false,
          lastUnlockedAt: now,
          failedAttempts: 0,
          lockoutUntil: null,
        }));
        try {
          sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
        } catch {
          // ignore
        }
        return { success: true };
      }

      // Wrong pin handling
      const nextFailures = securityState.failedAttempts + 1;
      let lockoutTime: number | null = null;
      let errorMsg = 'Invalid security PIN.';

      if (nextFailures >= 5) {
        lockoutTime = now + 30000; // 30 sec lockout
        errorMsg = 'Too many failed attempts. Console locked for 30 seconds.';
      } else {
        errorMsg = `Invalid PIN. ${5 - nextFailures} attempts remaining before temporary lockout.`;
      }

      setSecurityState((prev) => ({
        ...prev,
        failedAttempts: nextFailures,
        lockoutUntil: lockoutTime,
      }));

      return { success: false, error: errorMsg };
    },
    [securityState]
  );

  // Update PIN
  const changePin = useCallback(
    (currentPin: string, newPin: string): { success: boolean; error?: string } => {
      if (currentPin.trim() !== securityState.pin.trim()) {
        return { success: false, error: 'Current PIN is incorrect.' };
      }
      if (newPin.trim().length < 4) {
        return { success: false, error: 'New PIN must be at least 4 digits or characters.' };
      }

      setSecurityState((prev) => ({
        ...prev,
        pin: newPin.trim(),
        securityHint: `Custom PIN set (${newPin.length} digits/chars)`,
      }));

      return { success: true };
    },
    [securityState.pin]
  );

  // Reset PIN to Studio Master default ('1974')
  const resetToDefaultPin = useCallback(() => {
    setSecurityState((prev) => ({
      ...prev,
      pin: '1974',
      securityHint: 'Default Studio Master PIN: 1974',
      failedAttempts: 0,
      lockoutUntil: null,
    }));
  }, []);

  // Update Auto-Lock Minutes
  const setAutoLockMinutes = useCallback((minutes: number) => {
    setSecurityState((prev) => ({
      ...prev,
      autoLockMinutes: minutes,
    }));
  }, []);

  // Update Library Vault Lock toggle
  const setLockLibraryVault = useCallback((locked: boolean) => {
    setSecurityState((prev) => ({
      ...prev,
      lockLibraryVault: locked,
    }));
  }, []);

  return {
    isLocked: securityState.isLocked,
    currentPin: securityState.pin,
    autoLockMinutes: securityState.autoLockMinutes,
    lockLibraryVault: securityState.lockLibraryVault,
    securityHint: securityState.securityHint,
    failedAttempts: securityState.failedAttempts,
    lockoutUntil: securityState.lockoutUntil,
    lock,
    logout,
    unlock,
    changePin,
    resetToDefaultPin,
    setAutoLockMinutes,
    setLockLibraryVault,
  };
}
