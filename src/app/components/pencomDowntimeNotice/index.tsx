"use client";
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { CONSTANT } from "../../includes/constants";

const CLOSED_KEY = "pencomDowntimeNoticeClosed";

// PenCom downtime notice (BAH-422). PenCom is replacing ECRS and RTS with PENCAS, so RSA
// registration and pension remittance are unavailable from 21 Nov to 5 Dec 2026.
// The banner stops showing on its own after 5 December (Lagos time, WAT / UTC+1).
const NOTICE_ENDS_AT = Date.parse("2026-12-06T00:00:00+01:00");

const NOTICE_ALT =
  "Important notice. Dear User, due to maintenance carried out by PENCOM, Enhanced Contributors Registration System (ECRS) " +
  "and the RSA Transfer System (RTS) are being replaced by a new unified system called PENCAS. Unavailable services: " +
  "RSA Registration and Pension Remittance. This will run from November 21st to December 5th, 2026. For further support " +
  "and guidance, kindly reach out to us via business@penpay.com.ng.";

const NOTICE_CSS = `
.pencom-notice {
  position: relative;
  width: 100%;
  margin: 0 0 16px;
}
.pencom-notice img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 12px;
}
.pencom-notice-close {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 0;
  background: rgba(255, 255, 255, 0.95);
  color: #111;
  font-size: 20px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  padding: 0;
}
.pencom-notice-close:hover {
  background: #ffffff;
}
.pencom-notice-close:focus-visible {
  outline: 2px solid #FFD400;
  outline-offset: 2px;
}
`;

// Short DJB2 fingerprint of the login token: closing hides the notice for the current
// login session only without storing a duplicate copy of the sensitive token.
function loginFingerprint(token: string): string {
  let hash = 5381;
  for (let i = 0; i < token.length; i++) {
    hash = ((hash << 5) + hash + token.charCodeAt(i)) | 0;
  }
  return String(hash >>> 0);
}

// Lightweight pub/sub so closing updates the component (and other tabs via storage event)
let memoryClosed = false;
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot(): boolean {
  if (memoryClosed || Date.now() >= NOTICE_ENDS_AT) return false;
  try {
    const token = localStorage.getItem(CONSTANT.LocalStore.token) ?? "";
    if (!token) return false;
    return localStorage.getItem(CLOSED_KEY) !== loginFingerprint(token);
  } catch {
    try {
      return sessionStorage.getItem(CLOSED_KEY) !== "1";
    } catch {
      return true;
    }
  }
}

function getServerSnapshot(): boolean {
  return false;
}

// Shown once per login at the top of logged-in pages until the downtime ends; closable.
export default function PencomDowntimeNotice() {
  const open = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const close = useCallback(() => {
    memoryClosed = true;
    try {
      const token = localStorage.getItem(CONSTANT.LocalStore.token) ?? "";
      if (token) {
        localStorage.setItem(CLOSED_KEY, loginFingerprint(token));
      }
    } catch {
      try {
        sessionStorage.setItem(CLOSED_KEY, "1");
      } catch {
        // Storage completely unavailable; memoryClosed keeps it dismissed for this page session
      }
    }
    emitChange();
  }, []);
  
const [show,setShow] = useState<boolean>(false);

useEffect(()=>{
  fetch("https://prod.penpay.com.ng/v1/pencom-downtime",{}).then((res)=>res.json()).then((res)=>{
    if(res.status)
    {
      setShow(res.data);
    }
  })
 },[])

 if(!show)
 {
  return null;
 }
  if (!open) return null;

  return (
    <NoticeBanner
      wideSrc="/pencom-downtime-notice.png"
      phoneSrc="/pencom-downtime-notice-mobile.png"
      onClose={close}
    />
  );
}

interface NoticeBannerProps {
  wideSrc: string;
  phoneSrc: string;
  onClose: () => void;
}

function NoticeBanner({ wideSrc, phoneSrc, onClose }: NoticeBannerProps) {
const [show,setShow] = useState<boolean>(false);
 useEffect(()=>{
  fetch("https://prod.penpay.com.ng/v1/pencom-downtime",{}).then((res)=>res.json()).then((res)=>{
    if(res.status)
    {
      setShow(res.data);
    }
  })
 },[])
 if(!show)
 {
  return null;
 }
  return (
    <section className="pencom-notice" aria-label="Important notice: PenCom downtime">
      <style>{NOTICE_CSS}</style>
      <picture>
        <source media="(max-width: 639px)" srcSet={phoneSrc} />
        <img src={wideSrc} alt={NOTICE_ALT} />
      </picture>
      <button
        type="button"
        className="pencom-notice-close"
        aria-label="Close notice"
        onClick={onClose}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </section>
  );
}