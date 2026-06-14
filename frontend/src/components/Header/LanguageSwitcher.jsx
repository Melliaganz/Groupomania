import React from "react";
import { useI18n } from "../../_utils/i18n/I18nContext";

const LanguageSwitcher = () => {
  const { lang, setLang } = useI18n();

  return (
    <div className="lang-switcher" role="group" aria-label="Language">
      <button
        type="button"
        className={`lang-btn ${lang === "fr" ? "active" : ""}`}
        onClick={() => setLang("fr")}
        aria-pressed={lang === "fr"}
      >
        FR
      </button>
      <span className="lang-sep">/</span>
      <button
        type="button"
        className={`lang-btn ${lang === "en" ? "active" : ""}`}
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
