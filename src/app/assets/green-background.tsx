export const GreenBackground = ()=>{
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if(isMobile){
return <svg  className="w-full h-full" height="151" viewBox="0 0 369 151" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_g_915_7949)">
<rect x="2.60156" y="2.59998" className="w-full" height="145" rx="20" fill="#009668"/>
</g>
<defs>
<filter id="filter0_g_915_7949" x="0.0015626" y="-2.43187e-05" width="1265.2" height="150.2" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feTurbulence type="fractalNoise" baseFrequency="0.1428571492433548 0.1428571492433548" numOctaves="3" seed="8656" />
<feDisplacementMap in="shape" scale="5.1999998092651367" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
<feMerge result="effect1_texture_915_7949">
<feMergeNode in="displacedImage"/>
</feMerge>
</filter>
</defs>
</svg>
}
    return <svg width="1266" height="151" viewBox="0 0 1266 151" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_g_915_7949)">
<rect x="2.60156" y="2.59998" width="1260" height="145" rx="20" fill="#009668"/>
</g>
<defs>
<filter id="filter0_g_915_7949" x="0.0015626" y="-2.43187e-05" width="1265.2" height="150.2" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feTurbulence type="fractalNoise" baseFrequency="0.1428571492433548 0.1428571492433548" numOctaves="3" seed="8656" />
<feDisplacementMap in="shape" scale="5.1999998092651367" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
<feMerge result="effect1_texture_915_7949">
<feMergeNode in="displacedImage"/>
</feMerge>
</filter>
</defs>
</svg>

}