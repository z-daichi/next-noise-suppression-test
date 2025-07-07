'use client';

import { useCallback, useState } from 'react';

interface UseStreamResult {
  getStream: () => Promise<void>;
  stream: MediaStream | null;
}

export const useStream = (): UseStreamResult => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  const getStream = useCallback(async () => {
    // 既存 stream のクリーンアップ
    stream?.getTracks().forEach((track) => {
      track.stop();
    });

    const constraints = {
      video: false,
      audio: true,
    };

    await navigator.mediaDevices
      .getUserMedia(constraints)
      .then(async (stream) => setStream(stream))
      .catch((error: unknown) => {
        // Errorインスタンスであることを確認
        if (error instanceof Error) {
          throw error;
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stream の更新は deps から除外する
  }, []);

  return { getStream, stream };
};
