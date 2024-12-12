import { useRef, useState } from 'react'

export function useWhispherChat() {
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const [recordedText, setRecordedText] = useState<string>('');

    const onTranscribe = async (audioBlob: Blob) => {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');

      const urlParams = new URLSearchParams(window.location.search);
      const apiKey = urlParams.get('ok');
      if (!apiKey) {
        throw new Error('API key is missing from the URL');
      }

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
        'Authorization': `Bearer ${apiKey}`
        },
        body: formData
      });

      const result = await response.json();
      setRecordedText(result.text);
    };

    const startMediaRecording = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        if (audioChunksRef.current.length === 0) {
          throw new Error('No audio data available');
        }
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onTranscribe(audioBlob);
        audioChunksRef.current = [];
      };

      recorder.start();
      setMediaRecorder(recorder);
    };

    const stopMediaRecording = () => {
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
    };

    return {
      startMediaRecording,
      stopMediaRecording,
      recordedText
    }
}
