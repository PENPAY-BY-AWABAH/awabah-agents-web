import { AlertCircle, CheckSquare, FileText, ShieldCheck, Square, X } from "lucide-react";
import { useState } from "react";
import { SignUpProps } from "../../page";
interface ConsentFormButtonProps {
    error:string | null;
    formData:SignUpProps | null;
    
}
const ConsentFormButton = ({error,formData}:ConsentFormButtonProps)=>{
    const [isConsentModalOpen,setIsConsentModalOpen] = useState<boolean>(false);
    const [accepted,setAccepted] = useState<boolean>(false);
    return <div>
                  <button
                    type="button"
                    onClick={() => setIsConsentModalOpen(true)}
                    className={`w-full py-3 px-4 rounded-lg border flex items-center justify-between text-left transition-all cursor-pointer ${
                      accepted
                        ? 'border-emerald-300 bg-emerald-50/50 text-emerald-950'
                        : !error
                        ? 'border-red-400 bg-red-50/30 text-slate-800'
                        : 'border-slate-300 bg-slate-50/60 hover:bg-slate-100/70 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          accepted
                            ? 'bg-emerald-100 text-[#00965E]'
                            : 'bg-white border border-slate-200 text-slate-600'
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold">
                          Data & Identity Verification Consent Form{' '}
                          <span className="text-red-500 font-bold">*</span>
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {accepted
                            ? 'Reviewed and accepted by applicant'
                            : 'Click to read and accept terms'}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-md shrink-0 ${
                        accepted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-white border border-slate-200 text-[#00965E]'
                      }`}
                    >
                      {accepted ? 'Accepted' : 'Open Form'}
                    </span>
                  </button>

                  {error && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {error}
                    </p>
                  )}

        {isConsentModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn"
        >
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#00965E] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 id="consent-modal-title" className="text-base font-bold text-slate-900">
                    Identity & Pension Enrollment Consent
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Nigeria Data Protection Act (NDPA) & PenCom Compliance
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsConsentModalOpen(false)}
                aria-label="Close consent modal"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-[13px] text-slate-600 leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700">
                <p className="font-semibold text-slate-900 mb-1">Applicant Declaration</p>
                <p>
                  I,{' '}
                  <span className="font-semibold text-slate-900">
                    {formData?.firstName || 'the undersigned applicant'}
                  </span>
                  , hereby authorize the retrieval, verification, and processing of my personal
                  identity records for Retirement Savings Account (RSA) onboarding.
                </p>
              </div>

              <div className="space-y-2.5">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    1. NIMC & NIBSS Verification Authorization
                  </h3>
                  <p className="mt-0.5">
                    I consent to the validation of my National Identification Number (NIN) with the
                    National Identity Management Commission (NIMC) and my Bank Verification Number
                    (BVN) with the Nigeria Inter-Bank Settlement System (NIBSS).
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">
                    2. Pension Fund Administrator (PFA) Data Sharing
                  </h3>
                  <p className="mt-0.5">
                    I authorize my selected PFA (
                    <span className="font-medium text-slate-800">{"formData.pfa"}</span>) and the
                    National Pension Commission (PenCom) to securely store my biometric photograph,
                    signature specimen, and employment classification for regulatory compliance.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">3. Accuracy of Information</h3>
                  <p className="mt-0.5">
                    I confirm that all details, photographs, and uploaded signature documents
                    submitted in this application are authentic and belong solely to me.
                  </p>
                </div>
              </div>

              {/* Interactive Agreement Checkbox inside Modal */}
              <button
                type="button"
                onClick={() => {
                  setAccepted(true);
                  
                }}
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100/80 flex items-start gap-3 text-left transition-colors cursor-pointer"
              >
                {accepted ? (
                  <CheckSquare className="w-5 h-5 text-[#00965E] shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                )}
                <span className="text-xs font-medium text-slate-800">
                  I have read, understood, and agree to the Identity Verification & Pension
                  Enrollment Consent terms stated above.
                </span>
              </button>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsConsentModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setAccepted(true);
                  setIsConsentModalOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-[#00965E] hover:bg-[#008251] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Accept & Continue
              </button>
            </div>
          </div>
        </div>
      )}
                </div>
}
export default ConsentFormButton;