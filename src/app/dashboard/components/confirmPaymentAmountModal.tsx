"use client"

import BaseModal from "@/app/components/baseModal";
import { NairaSymbol } from "@/app/includes/constants";
import { useMemo } from "react";

export interface ConfirmPaymentAmountModalProps {
  open: boolean;
  onClose: () => void;
  amount: string;
  charges?: number;
  currencySymbol?: string;
  onReview?: () => void;
  onConfirmPay?: () => void;
  slideUp?: boolean;
}

export interface ConfirmPaymentPayload {
  amount: number;
  charges: number;
  total: number;
}

export function ConfirmPaymentAmountModal(props: ConfirmPaymentAmountModalProps) {
  const {
    open,
    onClose,
    amount,
    charges = 0,
    currencySymbol = NairaSymbol,
    onReview,
    onConfirmPay,
    slideUp = false,
  } = props;
const formatCurrency = (value: number) => `₦${Number(value || 0).toLocaleString()}`;
function calculateExcessCharge(amount: number) {
  const baseValue = 20000;
  const unitSize = 1000;
  const ratePerUnit = 1;

  if (amount > baseValue) {
    const excess = amount - baseValue;
    const units = excess / unitSize;
    return amount + units * ratePerUnit + 60;
  }
  return amount + 60;
}

function reverseExcessCharge(total: number) {
  return calculateExcessCharge(total) - total;
}
const total = useMemo(() => calculateExcessCharge(Number(amount || 0)), [amount]);

  if (!open) return null;

  return (<BaseModal
    title="" 
    onClose={()=>onClose()} 
    slideUp={slideUp} slideUpOnMobile={true} type="sm">
      <div className="px-1 py-1 md:px-2 md:py-2 ">
        <div className="text-[20px] font-semibold text-[#0f172a]">
        Confirm exact payment amount
        </div>
        <p className="mt-5 text-[14px] text-[#64748b]">
     Please transfer the exact amount displayed, including applicable charges, to ensure your payment is processed successfully.
        </p>
        <div className="mt-10 rounded-[28px] border border-[#e2e8f0] bg-linear-to-br from-[#f8fafc] via-white to-[#eef7f2] p-7 md:p-9 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          <div className="flex items-start justify-between text-[16px] md:text-[18px] text-[#64748b]">
            <div>Amount</div>
            <div className="font-semibold text-[#0f172a] text-[16px] ">
              {formatCurrency(parseFloat(amount))} 
            </div>
          </div>
          <div className="mt-6 flex items-start justify-between text-[16px] md:text-[18px] text-[#64748b]">
            <div>Charges</div>
            <div className="font-semibold text-[#0f172a] text-[16px] md:text-[16px]">
              {formatCurrency(reverseExcessCharge(total))}
            </div>
          </div>
          <div className="mt-7 h-px w-full bg-linear-to-r from-transparent via-[#cbd5e1] to-transparent" />
          <div className="mt-7 flex items-start justify-between">
            <div className="text-[16px]  text-[#0f172a]">
              Exact amount to transfer
            </div>
            <div className="text-[16px] font-extrabold tracking-tight text-[#0f172a]">
              {formatCurrency(total)}
            </div>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.5fr)] gap-4">
          <button
            type="button"
            onClick={() => onReview?.()}
            className="h-14 cursor-pointer rounded-[22px] border border-[#cbd5e1] bg-white text-[14px]font-semibold text-[#0f172a] hover:bg-[#f8fafc] active:bg-[#eef2f7] transition-colors shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.04)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => onConfirmPay?.()}
            className={`relative cursor-pointer h-14 rounded-[22px] text-[14px] font-semibold text-white transition-all duration-200 shadow-[0_14px_30px_-12px_rgba(0,150,104,0.45)] bg-linear-to-r from-[#37B181] via-[#009668] to-[#00805B] hover:brightness-[1.03] active:brightness-[0.97]`}
          >
           I&apos;ll pay exactly {formatCurrency(total)}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}

export default ConfirmPaymentAmountModal;
