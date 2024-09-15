const SUNO_API_URL = 'https://studio-api.suno.ai/api/external/generate/';

interface GenerateMusicRequest {
  topic: string;
  tags: string;
}

export const generateMusic = async (data: GenerateMusicRequest) => {
  try {
    console.log(process.env.SUNO_API_KEY + "API KEY")
    const response = await fetch(SUNO_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SUNO_API_KEY}`,
        'Content-Type': 'text/plain;charset=UTF-8',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error generating music:', error);
    throw new Error('Failed to generate music');
  }
};