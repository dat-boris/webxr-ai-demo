import { useRef, useState } from 'react'

const getOpenAIKey = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const apiKey = urlParams.get('ok');
  if (!apiKey) {
    throw new Error('API key is missing from the URL');
  }
  return apiKey;
}

// This is the URL of the image which OpenAI will read from - and needs to be publicly available.
// see `server/package.json:ngrok` for the domain.
const ImageUrl = "https://webxrdemo.ngrok.dev/image";

export function useWhispherChat(options: { enableOculusHack?: boolean } = {}) {

    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const [recordedText, setRecordedText] = useState<string>('');
    const [chatReply, setChatReply] = useState<string>('');
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const chatWithGPT = async (message: string) => {
      const apiKey = getOpenAIKey();

      const userContent = [
        {
          "type": "text",
          "text": message
        }
      ];

      if (options.enableOculusHack) {
        userContent.push({
          "type": "image_url",
          "image_url": {
            "url": ImageUrl
          }
        });
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'user', content: userContent},
        ]
      })
      });

      try {
        const result = await response.json();
        setIsProcessing(false);
        setChatReply(result.choices[0].message.content);
        return result.choices[0].message.content;
      } catch (error) {
        console.error('Failed to fetch chat reply', error);
        setIsProcessing(false);
        setChatReply(`Error: ${error}`);
        return '';
      }
    };

    const onTranscribe = async (audioBlob: Blob) => {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');

      const apiKey = getOpenAIKey();
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
        'Authorization': `Bearer ${apiKey}`
        },
        body: formData
      });

      const result = await response.json();
      setRecordedText(result.text);
      chatWithGPT(result.text);
    };

    const startMediaRecording = async () => {
      if (isProcessing) {
        console.log('Already processing audio');
        return;
      }
      setIsProcessing(true);
      setIsRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        setIsRecording(false);
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
      setIsRecording(false);
    };

    return {
      startMediaRecording,
      stopMediaRecording,
      recordedText,
      chatReply,
      isRecording,
      isProcessing
    }
}
