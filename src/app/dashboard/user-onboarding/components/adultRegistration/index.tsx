import React, { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import {
  Camera,
  Info,
  Upload,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  ChevronDown,
  X,
  FileSignature,
  AlertCircle,
  UserCheck,
  RefreshCw,
} from 'lucide-react';
import useHttpHook from '@/app/includes/useHttpHook';
import BaseSelect from '@/app/components/baseSelect';
import { ItemProps } from '@/app/includes/types';
import { CameraView } from '../cameraView';
import { reduceImageSize } from '../../page';
import { CONSTANT } from '@/app/includes/constants';
import { isValidNigerianMobile, ValidateEmail } from '@/app/includes/functions';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface VerifiedIdentity {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  nin: string;
}

interface FormDataState {
  nin: string;
  phoneNumber: string;
  avatarUrl: string | null;
  signatureFile: File | null;
  signaturePreviewUrl: string | null;
  documentUploadId?:string;
  pfaName?:string;
  pfaCode?:string;
  jobTypeCode?:string;
  jobTypeName?:string;
}

const PFA_OPTIONS = [
  'Access Pensions Limited',
  'Stanbic IBTC Pension Managers Limited',
  'ARM Pension Managers (PFA) Limited',
  'Leadway Pensure PFA Limited',
  'Trustfund Pensions Limited',
  'Premium Pension Limited',
  'CrusaderSterling Pensions Limited',
  'FCMB Pensions Limited',
];

const JOB_TYPE_OPTIONS = [
  'Private Sector Employee',
  'Federal Government / Civil Servant',
  'State Government Employee',
  'Self-Employed / Micro Pension',
  'Military / Paramilitary Personnel',
  'Expatriate / Contract Staff',
];

export default function AdultRegistration({pfaList,jobTypeList}:{pfaList:ItemProps[];jobTypeList:ItemProps[]}) {
  const { VerifyNIN ,ShowMessage} = useHttpHook();
  // Verification workflow states
  const [ninStatus, setNinStatus] = useState<'idle' | 'verifying' | 'verified' | 'error'>('idle');
  const [ninError, setNinError] = useState<string | null>(null);
  const [verifiedData, setVerifiedData] = useState<VerifiedIdentity | null>(null);

  // Form states
  const [formData, setFormData] = useState<FormDataState>({
    nin: '',
    pfaName: '',
    pfaCode: '',
    phoneNumber: '',
    jobTypeCode: '',
    jobTypeName: '',
    avatarUrl: null,
    signatureFile: null,
    signaturePreviewUrl: null,
    documentUploadId:""
  });

  // UI helper states
  const [showAvatarTooltip, setShowAvatarTooltip] = useState<boolean>(false);
  const [showNinTooltip, setShowNinTooltip] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  // Refs for hidden file inputs
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const handleNinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = String(e.target.value);
    setFormData((prev) => ({ ...prev, nin: rawValue }));
    if (ninStatus === 'error') {
      setNinStatus('idle');
      setNinError(null);
    }

    // Automatically trigger verification once 11 digits are typed, or user can click Verify
    if (rawValue.length === 10 && ninStatus === 'idle') {
      triggerNinVerification(rawValue);
    }
  };

  /**
   * Simulate NIN Verification API Call
   */
  const triggerNinVerification = (ninValue: string = formData.nin) => {
    if (ninValue.length !== 11) {
      setNinStatus('error');
      setNinError('Please enter a valid 11-digit National Identification Number.');
      return;
    }

    setNinStatus('verifying');
    setNinError(null);
    VerifyNIN(ninValue).then((res)=>{
        if (res.status) {
          setNinStatus('error');
          setNinError('NIN record not found in PENCOM database. Please check and retry.');
          return;
        }
    //     setVerifiedData({
    //       fullName: 'ADEBAYO CHUKWUEMEKA MUSA',
    //       dateOfBirth: '14 May 1992',
    //       gender: 'Male',
    //       nin: ninValue,
    //     });
    setNinStatus('verified');
    })

  };

  const handleResetNin = () => {
    setNinStatus('idle');
    setVerifiedData(null);
    setNinError(null);
    setFormErrors({});
    setSubmitSuccess(false);
  };

  const handleSignatureUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setFormErrors((prev) => ({
        ...prev,
        signature: 'Upload a PNG, JPG, or PDF signature file.',
      }));
      return;
    }

    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
    setFormData((prev) => ({
      ...prev,
      signatureFile: file,
      signaturePreviewUrl: previewUrl,
    }));

    setFormErrors((prev) => {
      const copy = { ...prev };
      delete copy.signature;
      return copy;
    });
  };

  /**
   * Handle phone number change (digits and leading +)
   */
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^\d+]/g, '').slice(0, 11);
    setFormData((prev) => ({ ...prev, phoneNumber: cleaned }));
    if (formErrors.phoneNumber) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy.phoneNumber;
        return copy;
      });
    }
  };

  /**
   * Validate all fields before proceeding
   */
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (ninStatus !== 'verified') {
      errors.nin = 'Please verify your NIN before proceeding.';
    }
    if (!formData.pfaCode) {
      errors.pfa = 'Please select your Pension Fund Administrator.';
    }
    if (!formData.phoneNumber || formData.phoneNumber.length < 10) {
      errors.phoneNumber = 'Please enter a valid phone number (at least 10 digits).';
    }
    if (!formData.jobTypeCode) {
      errors.jobType = 'Please select your job type.';
    }
    if (!formData.signatureFile) {
      errors.signature = 'Please upload your signature.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 900);
  };

useEffect(()=>{
    if(formData.avatarUrl !== null)
    {
      localStorage.setItem(CONSTANT.LocalStore.formDraft,JSON.stringify(formData)) 
    }
},[formData])
useEffect(()=>{
    const data = localStorage.getItem(CONSTANT.LocalStore.formDraft) 
    if(data !== null)
    {
     setFormData(JSON.parse(data))
    }
},[])
  return (
    <div className="py-5">
      {/* Main Form Card */}
      <div className="w-full max-w-md bg-white py-3 transition-all duration-300">
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col items-center mb-7">
            <div className="relative">
              {/* Outer Green Ring & Avatar Circle */}
              <div
                onClick={() =>{
                   setShowCamera(true)
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setShowCamera(true)}
                aria-label="Upload profile photo"
                className="w-32 h-32 rounded-full border-[3px] border-[#00A859] bg-[#DCE4E8] overflow-hidden flex items-end justify-center cursor-pointer group relative shadow-xs transition-transform duration-200 hover:scale-[1.02]"
              >
                {formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt="Applicant portrait"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  /* Crisp Silhouette Placeholder matching screenshot */
                  <svg
                    viewBox="0 0 128 128"
                    className="w-full h-full text-[#8B9AA4]"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M64 14c-15.5 0-27 11.2-27 27.5 0 2.5.4 5.2 1 7.6-1.8.8-2.8 3.2-2.2 6.4.6 3.1 2.4 5.2 4.3 5.5 2.4 6.8 6.8 12.1 12.3 15v7.5c0 3.2-2.1 6-5.2 7.1L24 98.8c-6.5 2.3-11 8.4-11 15.3V128h102v-13.9c0-6.9-4.5-13-11-15.3l-23.2-8.2c-3.1-1.1-5.2-3.9-5.2-7.1V76c5.5-2.9 9.9-8.2 12.3-15 1.9-.3 3.7-2.4 4.3-5.5.6-3.2-.4-5.6-2.2-6.4.6-2.4 1-5.1 1-7.6C91 25.2 79.5 14 64 14z" />
                  </svg>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-medium bg-black/60 px-2.5 py-1 rounded-full">
                    Change Photo
                  </span>
                </div>
              </div>

              {/* Bottom-Left Info Icon Button */}
              <button
                type="button"
                onClick={() => setShowAvatarTooltip((prev) => !prev)}
                onMouseEnter={() => setShowAvatarTooltip(true)}
                onMouseLeave={() => setShowAvatarTooltip(false)}
                aria-label="Photo upload guidelines"
                className="absolute -bottom-1 -left-2 w-8 h-8 rounded-full bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-xs border border-slate-200 transition-colors cursor-pointer"
              >
                <Info className="w-5 h-5 stroke-[1.8]" />
              </button>

              {/* Bottom-Right Camera Icon Button */}
              <button
                type="button"
                onClick={() => {
                    setShowCamera(true)
                    // avatarInputRef.current?.click()
                }}
                aria-label="Take or upload passport photo"
                className="absolute -bottom-1 -right-2 w-8 h-8 rounded-full bg-white text-slate-900 hover:text-[#00965E] flex items-center justify-center shadow-xs border border-slate-200 transition-colors cursor-pointer"
              >
                <Camera className="w-5 h-5 stroke-[2]" />
              </button>
              {/* Avatar Info Popover */}
              {showAvatarTooltip && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 shadow-lg z-20 leading-relaxed">
                  Upload a clear, recent passport photograph on a plain background. Face must be
                  fully visible without sunglasses or hats.
                </div>
              )}
            </div>

            {formErrors.avatar && (
              <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {formErrors.avatar}
              </p>
            )}
          </div>
          {formData.avatarUrl?<div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="nin-input"
                  className="flex items-center gap-1.5 text-[14px] font-semibold text-[#2D3748]"
                >
                  <button
                    type="button"
                    onClick={() => setShowNinTooltip((prev) => !prev)}
                    aria-label="NIN information"
                    className="text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    <Info className="w-4 h-4 stroke-[1.8]" />
                  </button>
                  <span>
                    NIN (National Identification Number){' '}
                    <span className="text-red-500 font-bold">*</span>
                  </span>
                </label>

                {ninStatus === 'verified' && (
                  <button
                    type="button"
                    onClick={handleResetNin}
                    className="text-xs font-medium text-[#00965E] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Change NIN
                  </button>
                )}
              </div>

              {showNinTooltip && (
                <div className="mb-2.5 p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-start justify-between gap-2">
                  <span>
                    Dial <strong>*346#</strong> on your registered phone number to retrieve your
                    11-digit NIMC NIN.
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowNinTooltip(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="relative flex items-center">
                <input
                  id="nin-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={11}
                  disabled={ninStatus === 'verified' || ninStatus === 'verifying'}
                  value={formData.nin}
                  onChange={handleNinChange}
                  placeholder="Enter NIN."
                  className={`w-full h-12 px-4 pr-28 rounded-lg border text-[15px] transition-all outline-none ${
                    ninStatus === 'verified'
                      ? 'bg-emerald-50/60 border-emerald-500 text-slate-800 font-medium'
                      : ninStatus === 'error'
                      ? 'border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-300 bg-white placeholder:text-slate-400 focus:border-[#00965E] focus:ring-2 focus:ring-[#00965E]/15'
                  }`}
                />

                {/* Inline Action / Status Badge inside NIN field */}
                <div className="absolute right-2 flex items-center">
                  {ninStatus === 'idle' && (
                    <button
                      type="button"
                      onClick={() => triggerNinVerification()}
                      disabled={formData.nin.length < 11}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        formData.nin.length === 11
                          ? 'bg-[#00965E] text-white hover:bg-[#007F4F] cursor-pointer shadow-xs'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Verify
                    </button>
                  )}

                  {ninStatus === 'verifying' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-medium">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Verifying
                    </span>
                  )}

                  {ninStatus === 'verified' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00965E]" />
                      Not registered
                    </span>
                  )}

                  {ninStatus === 'error' && (
                    <button
                      type="button"
                      onClick={() => triggerNinVerification()}
                      className="px-2.5 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 text-xs font-semibold cursor-pointer"
                    >
                      Retry
                    </button>
                  )}
                </div>
              </div>

              {/* Helper counter / Error message */}
              {ninStatus === 'error' && ninError ? (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {ninError}
                </p>
              ) : (
                ninStatus !== 'verified' && (
                  <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400">
                    <span>Enter 11-digit NIN to unlock remaining fields</span>
                    <span className="font-mono">{formData.nin.length}/11</span>
                  </div>
                )
              )}
            </div>

            {/* ==============================================================
                3. VERIFIED IDENTITY SUMMARY BANNER (Shown once verified)
               ============================================================== */}
            {ninStatus === 'verified' && verifiedData && (
              <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 flex items-center gap-3 animate-fadeIn">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#00965E] flex items-center justify-center shrink-0 mt-0.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="text-xs space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950 uppercase tracking-wide">
                      {verifiedData.fullName}
                    </span>
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      NIMC Match
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ==============================================================
                4. PROGRESSIVELY DISCLOSED INPUTS (Only shown AFTER NIN verified)
               ============================================================== */}
            {ninStatus === 'verified' && (
              <div className="space-y-5 pt-1 animate-fadeIn">
                {/* Pension Fund Administrator (PFA) */}
                <div>
                  <label
                    htmlFor="pfa-select"
                    className="block text-start text-[14px] font-semibold text-[#2D3748] mb-2"
                  >
                    Pension Fund Administrator (PFA){' '}
                    <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative text-start">
                    <BaseSelect
                    list={pfaList}
                    custom
                    value={formData.pfaName!}
                    onValueChange={({ name, value,code }) => {
                     setFormData({
                        ...formData,
                        pfaCode:code,
                        pfaName:name
                     })           
                    } } 
                    left
                    name={'pfaList'}                    
                    />
                  </div>
                  {formErrors.pfa && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.pfa}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phone-input"
                    className="block text-start text-[14px] font-semibold text-[#2D3748] mb-2"
                  >
                    Phone Number <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    id="phone-input"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handlePhoneChange}
                    maxLength={11}
                    placeholder="Enter phone number."
                    className={`w-full h-12 px-4 rounded-lg border text-[15px] outline-none transition-all ${
                      formErrors.phoneNumber
                        ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                        : 'border-slate-300 bg-white placeholder:text-slate-400 focus:border-[#00965E] focus:ring-2 focus:ring-[#00965E]/15'
                    }`}
                    onBlur={()=>{
                        if(!isValidNigerianMobile(formData.phoneNumber))
                        {
                          setFormData({
                            ...formData,
                            phoneNumber:""
                        })  
                        ShowMessage({
                            position:"center",
                            status:false,
                            message:"Invalid Phone number!",
                            data:null
                        })
                        }
                    }}
                  />
                  {formErrors.phoneNumber && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.phoneNumber}</p>
                  )}
                </div>

                {/* Select your Job type */}
                <div>
                  <label
                    htmlFor="job-type-select"
                    className="block text-[14px]  text-start font-semibold text-[#2D3748] mb-2"
                  >
                    Select your Job type <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative text-start">
                    <BaseSelect
                    list={jobTypeList}
                    placeholder='Select Your job type'
                    custom
                    value={formData.jobTypeName!}
                    onValueChange={({ name, value,code }) => {
                     setFormData({
                        ...formData,
                        jobTypeCode:code,
                        jobTypeName:name
                     })           
                    } } 
                    left
                    name={'jobTypeList'}                    
                    />
                  </div>
                  {formErrors.jobType && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.jobType}</p>
                  )}
                </div>

                {/* Upload Signature Button / Preview */}
                <div>
                  <input
                    ref={signatureInputRef}
                    type="file"
                    accept="image/png,image/jpeg,application/pdf"
                    onChange={handleSignatureUpload}
                    className="hidden"
                  />

                  {!formData.signatureFile ? (
                    <button
                      type="button"
                      onClick={() => signatureInputRef.current?.click()}
                      className={`w-full h-12 px-4 rounded-lg border bg-white hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center gap-2.5 text-[15px] font-medium text-slate-900 transition-colors cursor-pointer ${
                        formErrors.signature ? 'border-red-400' : 'border-slate-300'
                      }`}
                    >
                      <Upload className="w-5 h-5 stroke-[2]" />
                      <span>Upload Signature</span>
                    </button>
                  ) : (
                    <div className="w-full p-3 rounded-lg border border-emerald-300 bg-emerald-50/40 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {formData.signaturePreviewUrl ? (
                          <img
                            src={formData.signaturePreviewUrl}
                            alt="Signature preview"
                            className="h-9 object-cover w-16 object-contain bg-white rounded border border-slate-200 "
                          />
                        ) : (
                          <div className="w-9 h-9 rounded bg-emerald-100 text-[#00965E] flex items-center justify-center shrink-0">
                            <FileSignature className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {formData.signatureFile.name}
                          </p>
                          <p className="text-[11px] text-emerald-700">Signature attached</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            signatureFile: null,
                            signaturePreviewUrl: null,
                          }))
                        }
                        aria-label="Remove signature"
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-md transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {formErrors.signature && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.signature}</p>
                  )}
                </div>

                {/* Primary Green "Next" Submit Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-13 py-3.5 rounded-xl bg-[#00965E] hover:bg-[#008251] active:bg-[#006F45] text-white text-[16px] font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Next</span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ==============================================================
                5. LOCKED STATE PLACEHOLDER (Before NIN Verification)
               ============================================================== */}
            {ninStatus !== 'verified' && (
              <div className="pt-2">
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-center space-y-1.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-medium text-slate-600">
                    Additional Enrollment Details Locked
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Verify your 11-digit NIN above to unlock PFA selection, contact details, job
                    type, and signature upload.
                  </p>
                </div>
              </div>
            )}
          </div>:<div >
            </div>}
        </form>

        {/* Success Confirmation Toast/Banner */}
        {submitSuccess && (
          <div className="mt-5 p-4 rounded-xl bg-[#00965E] text-white text-sm flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-semibold">Enrollment Step Completed</p>
                <p className="text-xs text-emerald-100">
                  Your verified NIN and PFA details have been saved.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSubmitSuccess(false)}
              className="text-emerald-100 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Subtle Demo Helper Footer */}
      {!formData.avatarUrl ?<p className="mt-4 text-xs text-slate-400 text-center">
        Tip: capture your face by clicking the camera icon.
      </p>:<p className="mt-4 text-xs text-slate-400 text-center">
        Tip: Enter any 11 digits (e.g. <span className="font-mono text-slate-500">12345678901</span>)
        to verify NIN and reveal the remaining form fields.
      </p>}

      {/* Inline keyframe style for smooth reveal */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.32s ease-out forwards;
        }
      `}</style>
      {showCamera && <CameraView
            onSuccess={(base64: string) => {
                reduceImageSize(base64).then((res) => {
                    setFormData({
                        ...formData,
                        avatarUrl: res
                    })
                    setShowCamera(false);
                })
            }}
            onClose={() => {
                setShowCamera(false);
            }}
        />}
    </div>
  );
}