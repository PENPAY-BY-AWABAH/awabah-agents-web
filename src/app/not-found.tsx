"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const navigate = useRouter()
  return (
    <div className="flex min-h-screen items-center justify-center bg-white font-sans text-black">
      <div className="bg-white w-full max-w-lg overflow-hidden border border-gray-100 flex flex-col items-center text-center p-8 sm:p-12 rounded-[3rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
        
        <div className="relative w-full h-72 mb-8 flex items-center justify-center">
            <svg
             viewBox="0 0 200 200" className="absolute w-full h-full opacity-40">
                <circle cx="100" cy="100" r="90" fill="#f1f5f9" />
            </svg>
            
            <svg viewBox="0 0 300 240" className="relative w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <path d="M60 180 Q70 160 85 175 Q75 195 60 180" fill="#475569" opacity="0.8" />
                <path d="M230 170 Q240 150 255 165 Q245 185 230 170" fill="#475569" opacity="0.8" />
                <g transform="translate(100, 40)">
                    <path d="M10 140 Q50 130 90 140 L100 200 L0 200 Z" fill="#475569" />
                    <path d="M40 135 L60 135 L50 170 Z" fill="white" />
                    <path d="M48 135 L52 135 L50 160 Z" fill="#4CAF50" />
                    <path d="M30 60 Q50 45 70 60 L70 95 Q50 110 30 95 Z" fill="#ffdbac" />
                    <path d="M30 65 Q50 45 70 65 L70 75 Q50 65 30 75 Z" fill="#1e293b" />
                    <circle cx="45" cy="80" r="1.5" fill="#1e293b" />
                    <circle cx="55" cy="80" r="1.5" fill="#1e293b" />
                    <path d="M48 90 Q50 93 52 90" fill="none" stroke="#1e293b" strokeWidth="1" />
                </g>
                <text x="50" y="100" fontWeight="900" fontSize="64" fill="#e2e8f0">4</text>
                <text x="210" y="100" fontWeight="900" fontSize="64" fill="#e2e8f0">4</text>
                <g transform="translate(125, 75)">
                    <circle cx="25" cy="25" r="28" fill="white" stroke="#4CAF50" strokeWidth="8" />
                    <line x1="45" y1="45" x2="65" y2="65" stroke="#4CAF50" strokeWidth="8" strokeLinecap="round" />
                </g>
            </svg>
        </div>

        <h4 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
            Page Not Found
        </h4>
        
        <p className="text-gray-500 text-lg mb-10 max-w-[280px] mx-auto leading-relaxed">
            The link you followed might be broken, or the page may have been removed.
        </p>

        <div className="flex flex-col gap-4 w-full px-2">
            <Link href="/" className="w-full py-3 px-3 bg-[#4CAF50] hover:bg-[#43a047] text-white font-bold rounded-2xl shadow-lg shadow-green-100 transition-all transform active:scale-[0.98]">
              Back to Home
            </Link>
            <button 
            onClick={()=>{
              navigate.back();
            }} 
            className="w-full py-3 px-3 text-gray-600 font-bold bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-100 transition-all active:scale-[0.98]">
            Go Back
            </button>
        </div>
        <p className="mt-5 text-sm text-gray-400">
            Having trouble? <Link href="tel:+2347086209827" className="text-[#4CAF50] font-semibold hover:underline">Contact Support</Link>
        </p>
    </div>
    </div>
  );
}
