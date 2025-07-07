"use client";

import { useEffect, useRef } from "react";
import { useStream } from "./hooks/useStream";
import { useAudioVolume } from "./hooks/useAudioVolume";

// 取得した　 stream を video として表示するコンポーネント
const Video = ({ stream, volume }: { stream: MediaStream, volume: number }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="w-[40px] h-[40px] object-cover rounded-full bg-gray-300"
      style={{
        outline: `${volume / 10}px solid teal`,
      }}
    />
  );
};

export default function Home() {
  const { stream, getStream } = useStream();
  const { volume } = useAudioVolume({ stream });

  return (
    <main className="flex flex-col items-center justify-center h-screen gap-8">
      <h1>noise suppression test</h1>
      <div className="flex gap-3">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700"
          onClick={() => getStream()}
        >
          start
        </button>
        <button
          className="bg-teal-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-teal-700"
          onClick={() => console.log("TODO: start noise suppression")}
        >
          start noise suppression
        </button>
      </div>
      {
        stream !== null && (
          <div className="flex gap-5 items-center justify-center">
            <Video stream={stream} volume={volume} />
            <div className="min-w-[100px]">
              volume: {volume}
            </div>
          </div>
        )
      }
    </main>
  );
}
