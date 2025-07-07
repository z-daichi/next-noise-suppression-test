'use client';

import { useEffect, useState } from 'react';

interface UseAudioVolumeProps {
  stream: MediaStream | null;
}

interface UseAudioVolumeResult {
  volume: number;
}

export const useAudioVolume = ({ stream }: UseAudioVolumeProps): UseAudioVolumeResult => {
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    // AudioTrack が存在しない場合は 0 を返す
    if (stream === null || stream.getAudioTracks().length === 0) {
      setVolume(0);
      return;
    }

    // mediaStream AudioContext を生成
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);

    // 音声の時間と周波数取得の Analyser を生成
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    source.connect(analyser);

    const { frequencyBinCount } = analyser;
    const bufferLength = frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let animationFrameId: number | null = null;
    const updateVolume = (): void => {
      analyser.getByteFrequencyData(dataArray);

      // 振幅の最大値を取得（0〜255の範囲）
      const max = Math.max(...dataArray);

      // 0〜100に正規化
      const level = Math.round((max / 255) * 100);

      setVolume(level);
      animationFrameId = requestAnimationFrame(updateVolume);
    };
    updateVolume();

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      source.disconnect();
      void audioContext.close();
    };
  }, [stream]);

  return { volume };
};
