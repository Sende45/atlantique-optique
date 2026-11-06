import Image from "next/image";
import { Eye } from "lucide-react";
import Reveal from "@/components/motion/Reveal";

export default function WhyChooseImage({ src }: { src: string | null }) {
  return (
    <Reveal x={-40} y={0} className="relative min-h-[260px] overflow-hidden bg-brand-100 sm:min-h-[320px]">
      {src && (
        <>
          <Image
            src={src}
            alt="Salle d'examen de la vue d'Atlantique Optique"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover object-[50%_60%] transition duration-700 hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-900/70 via-brand-900/10 to-transparent" />
          <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-brand-900/70 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm sm:bottom-6 sm:left-6">
            <Eye className="h-4 w-4 text-gold-400" />
            Examen de la vue sur place
          </div>
        </>
      )}
    </Reveal>
  );
}