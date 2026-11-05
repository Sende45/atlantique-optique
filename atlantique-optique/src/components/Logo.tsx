import { Dancing_Script } from "next/font/google";

const script = Dancing_Script({ subsets: ["latin"], weight: ["600"] });

function EyeO() {
  return (
    <svg viewBox="0 0 48 32" aria-hidden="true" className="mx-[0.03em] inline-block h-[0.82em] w-auto">
      <path d="M2 16 Q24 -5 46 16 Q24 37 2 16 Z" fill="#ffffff" />
      <circle cx="24" cy="16" r="9.5" fill="#5e8f76" />
      <circle cx="24" cy="16" r="5" fill="#123a28" />
      <circle cx="20.8" cy="12.8" r="2" fill="#ffffff" opacity="0.9" />
    </svg>
  );
}

type Props = {
  className?: string;
};

// La taille se règle avec une classe de taille de texte, ex : "text-[22px]"
export default function Logo({ className = "text-[22px]" }: Props) {
  return (
    <span
      role="img"
      aria-label="Atlantique Optique – Cabinet des yeux"
      className={`inline-flex flex-col items-end rounded-[0.15em] bg-brand-500 px-[0.45em] pb-[0.2em] pt-[0.3em] leading-none ${className}`}
    >
      <span className="flex items-center whitespace-nowrap font-bold tracking-tight text-white">
        ATLANTIQUE&nbsp;&nbsp;
        <EyeO />
        PTIQUE
      </span>
      <span className={`${script.className} -mt-[0.05em] text-[0.62em] text-brand-900`}>Cabinet des yeux</span>
    </span>
  );
}