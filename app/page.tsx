import Image from "next/image";
import ScenePage from "./scene/page";

export default function Home() {
  return (
    <div className="flex  items-center justify-center bg-zinc-50 font-sans dark:bg-black h-screen w-full">
<ScenePage></ScenePage>
    </div>
  );
}
