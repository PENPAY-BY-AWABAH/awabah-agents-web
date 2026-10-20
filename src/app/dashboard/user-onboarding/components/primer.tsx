"use client";
import BaseModal from "@/app/components/baseModal";
import { CheckCircle } from "lucide-react";

interface PrimerComponentProps {
  onClose: () => void;
  onContinue?: () => void;
  userIsMinor?: boolean;
}

const adultItems = [
  { icon: "📷", text: "A clear photo of yourself — please be in a well-lit environment." },
  { icon: "🪪", text: "Your NIN." },
  { icon: "📱", text: "An active phone number." },
  { icon: "🏦", text: "Your preferred PFA." },
  { icon: "💼", text: "Your job/employment details." },
  { icon: "✍️", text: "Your signature." },
  { icon: "🏠", text: "Your residential address and location." },
  { icon: "👤", text: "Your Next of Kin (NOK) details." },
];

const minorItems = [
  { icon: "🪪", text: "The minor's registration details." },
  { icon: "👤", text: "Guardian's RSA PIN." },
  { icon: "📱", text: "Guardian's phone number." },
  { icon: "💼", text: "Guardian's job/employment details." },
  { icon: "📋", text: "Other required registration and NOK details." },
];

const BulletRow = ({ icon, text }: { icon: string; text: string }) => (
  <div className="flex items-start gap-3 py-2">
    <div className="text-2xl leading-6 shrink-0">{icon}</div>
    <div className="text-[14px] text-gray-700 leading-6">{text}</div>
  </div>
);

export const PrimerComponent = ({ onClose, onContinue, userIsMinor }: PrimerComponentProps) => {
  return (
    <BaseModal
      onClose={onClose}
      title="Registration Requirements"
      type="md"
      slideUpOnMobile
    >
       <div className="flex items-center  justify-center w-full m-auto">
      <div className="text-left text-gray-800 m-auto">
        <div>
          <div className="text-[15px] font-semibold text-gray-900 mb-1">Before you begin</div>
          <div className="text-[14px] text-gray-600 leading-6">
            To complete your RSA PIN registration, please have the following ready:
          </div>
        </div>
        <div className="rounded-[16px] mt-3 border border-green-100 bg-green-50/50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-700" />
            <div className="text-[16px] font-semibold text-green-900">
              {userIsMinor ? "For Minor Registration" : "For Adult Registration"}
            </div>
          </div>
          <div className="divide-y divide-green-100/60">
            {(userIsMinor ? minorItems : adultItems).map((item, i) => (
              <BulletRow key={i} icon={item.icon} text={item.text} />
            ))}
          </div>
        </div>
        <div className="rounded-[16px] mt-3 border border-gray-200 bg-gray-50 p-4">
          <div className="text-[14px] leading-6 text-gray-700">
            <b className="text-gray-900">Note: </b>
            Please ensure the information you provide is accurate and that you have the
            necessary details available before you begin.
          </div>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-[12px] text-[15px] font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              if (onContinue) onContinue();
              onClose();
            }}
            className="px-5 py-3 rounded-[12px] text-[15px] font-semibold text-white bg-[#009668] hover:bg-[#007a54] cursor-pointer"
          >
            Start registration
          </button>
        </div>
      </div>
      </div>
    </BaseModal>
  );
};

export default PrimerComponent;
