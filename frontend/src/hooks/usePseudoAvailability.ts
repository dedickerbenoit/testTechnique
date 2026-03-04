import { useState, useEffect } from "react";
import type { TFunction } from "i18next";
import useDebounce from "./useDebounce";
import { checkPseudoAvailability } from "../services/userService";

interface UsePseudoAvailabilityReturn {
  pseudoAvailable: boolean | null;
  pseudoChecking: boolean;
  pseudoError: string;
}

function usePseudoAvailability(
  pseudo: string,
  t: TFunction,
): UsePseudoAvailabilityReturn {
  const [pseudoAvailable, setPseudoAvailable] = useState<boolean | null>(null);
  const [lastCheckedPseudo, setLastCheckedPseudo] = useState<string | null>(null);
  const [pseudoError, setPseudoError] = useState("");

  const debouncedPseudo = useDebounce(pseudo, 500);
  const isPseudoTooShort = !debouncedPseudo || debouncedPseudo.length < 3;
  const pseudoChecking =
    !isPseudoTooShort && debouncedPseudo !== lastCheckedPseudo;

  useEffect(() => {
    if (isPseudoTooShort) {
      setPseudoAvailable(null);
      setPseudoError("");
      return;
    }

    let cancelled = false;
    checkPseudoAvailability(debouncedPseudo)
      .then((data) => {
        if (cancelled) return;
        setPseudoAvailable(data.available);
        setLastCheckedPseudo(debouncedPseudo);
        setPseudoError(
          data.available ? "" : t("register.errors.pseudo.unique"),
        );
      })
      .catch(() => {
        if (cancelled) return;
        setPseudoAvailable(null);
        setLastCheckedPseudo(debouncedPseudo);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedPseudo, t, isPseudoTooShort]);

  const effectivePseudoAvailable = isPseudoTooShort ? null : pseudoAvailable;

  return {
    pseudoAvailable: effectivePseudoAvailable,
    pseudoChecking,
    pseudoError,
  };
}

export default usePseudoAvailability;
