/**
 * Check if the backend API is accessible
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch('https://msp-attendance-dashboard-j8k1.vercel.app/api/health', {
      method: 'GET',
       headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.status === 'ok';
    }
    return false;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}
