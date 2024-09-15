"use client"
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { OpenAI } from 'openai';
import { HfInference } from '@huggingface/inference';

const SUNO_API_URL = 'https://studio-api.suno.ai/api/external/generate/';
const SUNO_CLIP_STATUS_URL = 'https://studio-api.suno.ai/api/external/clips/?ids=';

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

const GenerateMusicPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [clipId, setClipId] = useState<string | null>(null);
  const [description, setDescription] = useState<string>(''); 
  const [loading, setLoading] = useState<boolean>(false);
  const [polling, setPolling] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY);

  const artistName = searchParams.get('artistName');

  const generateDescriptionUsingOpenAI = async () => {
    try {
      const response = await hf.textGeneration({
        model: 'EleutherAI/gpt-neo-2.7B',
        inputs: `Describe the vibe or style of ${artistName}'s music`,
      });
      return response.generated_text;
    } catch (error) {
      console.error('Error generating description using Hugging Face:', error);
      throw new Error('Failed to generate description.');
    }
  };

  const generateMusic = async () => {
    if (!artistName) return;
    if (!description) {
      setError('Please provide a description for the music.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const aiGeneratedDescription = await generateDescriptionUsingOpenAI();

      const response = await fetch(SUNO_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUNO_API_KEY}`, 
        },
        body: JSON.stringify({
          topic: description + " in the style of heartfelt storytelling with a dynamic mix of country, pop, and indie influences, often capturing themes of love, personal growth, and self-reflection.",
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate music');
      }

      const data = await response.json();
      setClipId(data.id); // Extract the clip ID
      pollForMusic(data.id); // Start polling for the music status
    } catch (error) {
      console.error('Error generating music:', error);
      setError('Failed to generate music. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pollForMusic = async (clipId: string) => {
    setPolling(true);
    let isMounted = true;

    try {
      while (isMounted) {
        const statusResponse = await fetch(`${SUNO_CLIP_STATUS_URL}${clipId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUNO_API_KEY}`,
          },
        });

        if (!statusResponse.ok) {
          throw new Error('Failed to fetch clip status');
        }

        const statusData = await statusResponse.json();
        console.log('Clip Status Data:', statusData);

        const clipStatus = statusData?.[0]?.status;

        if (clipStatus === 'complete') {
          if (isMounted) {
            setMusicUrl(statusData[0].audio_url); // Set the audio URL
            console.log('Audio URL:', statusData[0].audio_url); // Log the audio URL
            setPolling(false); // Stop polling
          }
          break;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }
    } catch (error) {
      console.error('Error fetching music status:', error);
      if (isMounted) {
        setError('Failed to load the generated music.');
      }
    } finally {
      if (isMounted) {
        setPolling(false);
      }
    }

    return () => { isMounted = false; };
  };

  useEffect(() => {
    return () => { setPolling(false); };
  }, []);

  const handleReturnHome = () => {
    router.push('/testing2'); 
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-orange-100 to-orange-200 text-center">
      <h1 className="text-5xl font-bold text-orange-600 mb-8">
        Generate Music for Your Artist
      </h1>

      <p className="text-lg mb-8 text-orange-700">
        Describe the type of music you want to generate, and we will create it for you!
      </p>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the music you want to generate (e.g., 'upbeat rock', 'melancholic piano', etc.)"
        className="w-full max-w-md p-4 rounded-lg border-2 border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-8 text-sm text-gray-800"
        rows={4}
      ></textarea>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <button
        className={`bg-orange-500 text-white py-3 px-6 rounded-full shadow-lg hover:bg-orange-600 transition-transform transform hover:scale-105 mb-8 ${
          loading || polling ? 'cursor-not-allowed opacity-50' : ''
        }`}
        onClick={generateMusic}
        disabled={loading || polling}
      >
        {loading ? 'Generating Music...' : polling ? 'Waiting for Music...' : 'Generate Music'}
      </button>

      {musicUrl ? (
        <div className="mt-6">
          <div className="relative w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-4">
            <audio controls className="w-full rounded-lg">
              <source src={musicUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <div className="mt-2 text-gray-700 text-sm">Now playing your generated music</div>
          </div>
        </div>
      ) : (
        !loading && !polling && (
          <div className="text-orange-700 mt-8">
            No music generated yet. Click the button above to generate music.
          </div>
        )
      )}

      <button
        className="mt-12 bg-white text-orange-500 py-3 px-6 rounded-full shadow-lg border border-orange-500 hover:bg-orange-500 hover:text-white transition-transform transform hover:scale-105"
        onClick={handleReturnHome}
      >
        Return Home
      </button>
    </div>
  );
};

export default GenerateMusicPage;
