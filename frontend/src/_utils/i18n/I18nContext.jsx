import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import fr from "./fr.json";
import en from "./en.json";

const dictionaries = { fr, en };
const STORAGE_KEY = "lang";

const I18nContext = createContext(null);

const resolve = (obj, path) =>
  path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);

export const I18nProvider = ({ children }) => {
  const [lang, setLangState] = useState(
    () => localStorage.getItem(STORAGE_KEY) || "fr"
  );

  const setLang = useCallback((next) => {
    localStorage.setItem(STORAGE_KEY, next);
    setLangState(next);
    document.documentElement.lang = next;
  }, []);

  const t = useCallback(
    (key, vars) => {
      const value = resolve(dictionaries[lang], key) ?? resolve(dictionaries.fr, key);
      if (typeof value !== "string") return key;
      if (!vars) return value;
      return value.replace(/\{(\w+)\}/g, (_, name) =>
        vars[name] != null ? vars[name] : `{${name}}`
      );
    },
    [lang]
  );

  const contextValue = useMemo(() => ({ t, lang, setLang }), [t, lang, setLang]);

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n doit etre utilise dans un I18nProvider");
  return ctx;
};
