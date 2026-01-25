export const CloseBtn = ({onClick}:{onClick:()=>void})=>{
    return <button 
        onClick={onClick}
        className="text-gray-600 hover:text-gray-900 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
}