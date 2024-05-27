import React from 'react'
import CookieConsent from "react-cookie-consent";

function CookieConsentement() {
  return (
    <div><CookieConsent
    onAccept={(acceptedByScrolling) => {
      if (acceptedByScrolling) {
        // triggered if user scrolls past threshold
        alert("Accept was triggered by user scrolling");
      } else {
        alert("Accept was triggered by clicking the Accept button");
      }
    }}
  ></CookieConsent></div>
  )
}

export default CookieConsentement