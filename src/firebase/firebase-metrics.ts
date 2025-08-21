import { db } from './firebase-config.ts';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { Metric } from 'web-vitals';

export async function setMetricsFirebase(metric: Metric, userId?: string | null): Promise<void> {
  try {
    const metricId = `${metric.name}-${metric.id}-${Date.now()}`;
    const metricRef = doc(db, 'webVitals', metricId);

    const metricData = {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      navigationType: metric.navigationType,
      userId: userId || 'anonymous',
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      pageUrl: window.location.href,
      loadTime: performance.timing
        ? performance.timing.loadEventEnd - performance.timing.navigationStart
        : 0,
      timestamp: serverTimestamp()
    };

    await setDoc(metricRef, metricData);

    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vitals sent:', metric.name, metric.value);
    }
  } catch (error) {
    console.error('Error sending metric to Firebase:', error);
  }
}
