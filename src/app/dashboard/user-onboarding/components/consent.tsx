/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client"
import {useRef, useState } from "react";
import BaseButton from "@/app/components/baseButton";
import BaseToggleBtn from "@/app/components/baseCheckBox";
import useHttpHook from "@/app/includes/useHttpHook";
import { BaseLoader } from "@/app/components/baseLoader";
import { SignUpProps } from "../page";
import moment from "moment";
import html2canvas from "html2canvas";
export interface BankProps {
  accountN?: string;
  firstName?: string;
  lastName?: string;
  town?: string;
  isFather?: string;
}

export const ConsentPage = ({onClose,onSuccess,trackingId,email,userData}:{onClose:()=>void;onSuccess:(data:{rsaPin:string})=>void;trackingId:string;email:string;userData?:SignUpProps}) => {
    const [agree,setAgree] = useState<boolean>(false);
    const {RequestForRSAPIN,loading} = useHttpHook()
    const handleSaveConsent = () => {
        Download().then((res)=>{
        RequestForRSAPIN({email,trackingId,consentForm:res}).then((res)=>{
            if(res.status)
            {
            onSuccess(res.data);   
            }
        })
        });
    }
    const divRef = useRef<HTMLDivElement>(null);
    const Download = async()=>{
     const canvas = await html2canvas(divRef.current!);
    const dataURL = canvas.toDataURL('image/png');
    return dataURL;
    // Create a temporary link to trigger download
    // const link = document.createElement('a');
    // link.href = dataURL;
    // link.download = `consent-form`;
    // link.click();
    }
    return <div className="mt-[20px]">
   <div className="m-auto items-center text-center ">
            <div 
            className="m-auto items-center text-center ">
            <style>{`
    .page {
      margin: 0 auto;
      background: #ffffff;
      padding: 60px 70px;
      padding-bottom:120px;
    }

    .header {
      text-align: center;
      margin-bottom: 36px;
      border-bottom: 2px solid #003366;
      padding-bottom: 24px;
    }

    .header .org {
      font-size: 18px;
      font-weight: bold;
      color: #003366;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .header .plan {
      font-size: 14px;
      color: #444;
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .header .form-title {
      font-size: 20px;
      font-weight: bold;
      color: #1a1a1a;
      margin-top: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .section {
      margin-bottom: 24px;
      text-align:left;
    }

    .section-title {
      font-size: 14px;
      font-weight: bold;
      color: #003366;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .section p {
      font-size: 13.5px;
      line-height: 1.75;
      color: #333;
      margin-bottom: 6px;
    }

    ul.data-list {
      list-style: none;
      padding-left: 0;
      margin: 6px 0;
    }

    ul.data-list li {
      font-size: 13.5px;
      line-height: 1.75;
      color: #333;
      padding-left: 16px;
      position: relative;
    }

    ul.data-list li::before {
      content: "•";
      color: #003366;
      position: absolute;
      left: 0;
    }

    .signature-section {
      margin-top: 36px;
      border-top: 2px solid #003366;
      padding-top: 24px;
    }

    .signature-section .section-title {
      margin-bottom: 20px;
      text-align:left;
    }

    .field {
      display: flex;
      align-items: flex-end;
      margin-bottom: 20px;
      gap: 10px;
    }

    .field label {
      font-size: 13.5px;
      font-weight: bold;
      color: #333;
      white-space: nowrap;
      min-width: 140px;
    }

    .field .line {
      flex: 1;
      border-bottom: 1px solid #555;
      height: 22px;
    }

    @media print {
      body { background: white; padding: 0; }
      .page { box-shadow: none; border: none; padding: 40px; }
    }

    @media (max-width: 600px) {
      .page { padding: 30px 20px; }
    }`}
  </style>
   <div className="m-auto items-center text-center ">
            <div 
            className="m-auto items-center text-center ">
    <div
    ref={divRef}
    className="page">
    <div className="header">
      <div className="org">National Pension Commission</div>
      <div className="plan">Personal Pension Plan (PPP)</div>
      <div className="form-title">Data Subject Consent Form</div>
    </div>

    <div className="section">
      <div className="section-title">1. Purpose</div>
      <p>{`This form authorizes the National Pension Commission (PenCom), Pension Fund Administrators (PFAs), Pension Fund Custodians (PFCs) and Accredited Pension Agents (APAs) to collect and process your personal data for participation in the Personal Pension Plan (PPP) in compliance with the Nigeria Data Protection Act (NDPA) 2023, the Pension Reform Act (PRA) 2014, and PenCom's PPP Guidelines.`}</p>
    </div>

    <div className="section">
      <div className="section-title">2. Personal Data Collected</div>
      <ul className="data-list">
        <li>Name, Date of Birth, Gender, National Identification Number (NIN)</li>
        <li>Phone Number, Email Address, Contact Address</li>
        <li>Bank Account Details &amp; Contribution/Transaction Records</li>
        <li>KYC/Verification Information (e.g., BVN)</li>
        <li>Any additional data required for PPP operations</li>
      </ul>
    </div>

    <div className="section">
      <div className="section-title">3. Purpose of Processing</div>
      <p>Your data will be used for:</p>
      <ul className="data-list">
        <li>PPP registration, onboarding, and identity verification</li>
        <li>Managing contributions, contingent withdrawals, and retirement benefits</li>
        <li>Customer service, notifications, and RSA statements</li>
        <li>Compliance with PenCom regulations, NDPA 2023</li>
        <li>Any PPP‑related operational or contractual obligation</li>
      </ul>
    </div>

    <div className="section">
      <div className="section-title">4. Data Sharing &amp; Disclosure</div>
      <ul className="data-list">
        <li>Your data may be shared with PFAs, PFCs, APAs (with controlled access only)</li>
        <li>APAs cannot store or export your personal data independently and may access it only through PFA‑approved systems.</li>
      </ul>
    </div>

    <div className="section">
      <div className="section-title">5. Your Data Rights</div>
      <p>Under NDPA 2023, you have the right to:</p>
      <ul className="data-list">
        <li>Access and correct your personal data</li>
        <li>Withdraw consent at any time (without affecting earlier lawful processing)</li>
        <li>Request deletion where legally applicable</li>
        <li>Lodge complaints with the Nigeria Data Protection Commission (NDPC)</li>
      </ul>
    </div>

    <div className="section">
      <div className="section-title">6. Consent Declaration</div>
      <p>I / On behalf of, {userData?.firstName} {userData?.lastName},</p>
      
      <p style={{marginTop:12}}>hereby voluntarily consent to the collection, use, processing, and lawful transfer of my personal data / My child or ward by PenCom, PFAs, PFCs, and APAs strictly for the purposes stated above and in accordance with applicable laws and regulations.</p>
      <p style={{marginTop:12}}>I acknowledge that I understand my data rights / rights of my child or ward and authorize any person or entity holding relevant information about me to release such information to PenCom for PPP‑related verification or processing.</p>
    </div>

    <div className="signature-section text-start ">
      <div className="section-title">7. Signature</div>

      <div className="field">
        <label>Signature:</label>
        <div className="line relative"><img src={userData?.signature} className="absolute top-[-60px]" /></div>
      </div>
      <div className="field">
        <label>Full Name:</label>
        <div className="line">{userData?.firstName} {userData?.lastName}</div>
      </div>
      <div className="field">
        <label>Phone Number:</label>
        <div className="line">{userData?.phoneNumber}</div>
      </div>
      <div className="field">
        <label>Email Address:</label>
        <div className="line">{userData?.email}</div>
      </div>
      <div className="field">
        <label>Date:</label>
        <div className="line">{moment().format("Do MMMM, YYYY h:s A")}</div>
      </div>
    </div>
  </div>
    </div>
                        <div
                        className="w-full pb-[16px] text-left">
                            <div className="items-left mb-4 flex gap-2 items-center mt-0">
                            <BaseToggleBtn
                            onChange={()=>setAgree(!agree)}
                            value={agree}
                            type="custom"
                            />
                             <div className="text-gray-500 text-[14px] mt-0">
                            I agree to the terms and conditions
                        </div>
                            </div>
                            <BaseButton
                            disabled={!agree}
                            text={"Request for RSA PIN"}
                            type={"submit"}
                            onClick={()=>handleSaveConsent()}
                            />
                        </div>
                    </div>
                </div>
    </div>
    {loading && <BaseLoader color="green" size="lg" modal />}
    </div>
}