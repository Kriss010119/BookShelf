import { useEffect } from 'react';
import { onCLS, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';
import { setMetricsFirebase } from '../firebase/firebase-metrics';
import { useAuth } from './use-auth';

export function useWebVitals() {
  const { id: userId } = useAuth();

  useEffect(() => {
    const reportMetric = (metric: Metric) => {
      setMetricsFirebase(metric, userId);
    };

    onCLS(reportMetric);
    onFCP(reportMetric);
    onLCP(reportMetric);
    onTTFB(reportMetric);
  }, [userId]);
}
