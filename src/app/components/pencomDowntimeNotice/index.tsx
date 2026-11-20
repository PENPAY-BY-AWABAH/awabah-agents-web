"use client";
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react";
import { CONSTANT } from "../../includes/constants";
const CLOSED_KEY = "pencomDowntimeNoticeClosed";

// A short fingerprint of the login token: closing the notice hides it for this login only,
// so it shows again on the next login without keeping a second copy of the token.
function loginFingerprint(token: string): string {
  let hash = 5381;
  for (let i = 0; i < token.length; i++) hash = ((hash << 5) + hash + token.charCodeAt(i)) | 0;
  return String(hash >>> 0);
}

// Shown once per login at the top of the logged-in pages until the downtime ends; closable.
export default function PencomDowntimeNotice() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (Date.now() >= NOTICE_ENDS_AT) return;
    try {
      const token = localStorage.getItem(CONSTANT.LocalStore.token) || "";
      if (token !== "" && localStorage.getItem(CLOSED_KEY) !== loginFingerprint(token)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);
  const close = useCallback(() => {
    setOpen(false);
    try {
      localStorage.setItem(CLOSED_KEY, loginFingerprint(localStorage.getItem(CONSTANT.LocalStore.token) || ""));
    } catch {
      // Storage unavailable: the notice simply shows again next time.
    }
  }, []);
  if (!open) return null;
  return <NoticeBanner wideSrc="/pencom-downtime-notice.png" phoneSrc="/pencom-downtime-notice-mobile.png" onClose={close} />;
}

// PenCom downtime notice (BAH-422). PenCom is replacing ECRS and RTS with PENCAS, so RSA
// registration and pension remittance are unavailable from 21 Nov to 5 Dec 2026.
// The banner stops showing on its own after 5 December (Lagos time).
const NOTICE_ENDS_AT = Date.parse("2026-12-06T00:00:00+01:00");
const NOTICE_ALT =
  "Important notice. Dear User, due to maintenance carried out by PENCOM, Enhanced Contributors Registration System (ECRS) " +
  "and the RSA transfer System (RTS) being replaced by the new unified system called PENCAS. Unavailable services: " +
  "RSA Registration and Pension Remittance. This will run from November 21st to December 5th, 2026. For further support " +
  "and guidance, kindly reach out to us via business@penpay.com.ng.";

// The wide design on larger screens, the square phone design below 640px.
const NOTICE_CSS = `
.pencom-notice{position:relative;width:100%;margin:0 0 16px}
.pencom-notice img{display:block;width:100%;height:auto;border-radius:12px}
.pencom-notice-close{position:absolute;top:8px;right:8px;width:32px;height:32px;border-radius:50%;border:0;background:rgba(255,255,255,.95);color:#111;font-size:20px;line-height:32px;text-align:center;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.3);padding:0}
.pencom-notice-close:focus-visible{outline:2px solid #FFD400;outline-offset:1px}
`;

function NoticeBanner({ wideSrc, phoneSrc, onClose }: { wideSrc: string; phoneSrc: string; onClose: () => void }) {
  return (
    <section className="pencom-notice" aria-label="Important notice: PenCom downtime">
      <style>{NOTICE_CSS}</style>
      <picture>
        <source media="(max-width: 639px)" srcSet={phoneSrc} />
        <img src={wideSrc} alt={NOTICE_ALT} />
      </picture>
      <button type="button" className="pencom-notice-close" aria-label="Close notice" onClick={onClose}>&times;</button>
    </section>
  );
}
