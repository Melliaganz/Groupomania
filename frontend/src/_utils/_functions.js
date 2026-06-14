const UNITS = [
  ["year", 31536000],
  ["month", 2592000],
  ["week", 604800],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
  ["second", 1],
];

const functions = {
  convertDateForHuman(createdAt, lang = "fr") {
    return new Date(createdAt).toLocaleString(lang, {
      dateStyle: "long",
      timeStyle: "short",
    });
  },

  timeAgo(createdAt, lang = "fr") {
    const seconds = (Date.now() - new Date(createdAt).getTime()) / 1000;
    const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
    for (const [unit, unitSeconds] of UNITS) {
      if (Math.abs(seconds) >= unitSeconds || unit === "second") {
        return rtf.format(-Math.round(seconds / unitSeconds), unit);
      }
    }
  },
};

export default functions;
