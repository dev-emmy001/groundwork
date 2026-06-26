import Image from "next/image";

export default function Home() {
  return (
  <div className="flex flex-col items-center justify-center h-screen">
    <div className="flex items-center gap-2">
    <Image
      src="/groundworkmascot.png"
      alt="ai mascot image"
      width={40} 
      height={40}
    />
    <h1 className="text-4xl font-bold">Groundwork</h1>
    </div>
    <p className="mt-4">A proof-of-concept for a local LLM assistant</p>
  </div>
  );
}
