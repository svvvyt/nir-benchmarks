type Metric =
  | 'LoadingSpeed' // Скорость загрузки
  | 'Time To Interactive' // Время до интерактивности
  | 'EventHandlingLatency' // Задержка обработки событий
  | 'FPS' // Кадровая частота
  | 'RouteTransitionSpeed' // Скорость перехода по маршрутам
  | 'MemoryUsage' // Потребление памяти
  | 'APIResponseTime' // Время обработки серверных данных
  | 'BundleSize' // Размер бандла (статический замер, логируется отдельно)
  | 'ReRenderPerformance'; // Скорость повторного рендеринга

interface LogEntry {
  metric: Metric;
  value: number | string; // Время в мс или строка (например, для FPS или памяти)
  timestamp: string;
  isError?: boolean;
}

const performanceLogger = {
  logs: [] as LogEntry[],
  combinedLog: '',
  errorLog: '',

  start(metric: Metric): () => void {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.log(metric, duration);
    };
  },

  log(metric: Metric, value: number | string, isError: boolean = false): void {
    const entry: LogEntry = {
      metric,
      value,
      timestamp: new Date().toISOString(),
      isError,
    };
    this.logs.push(entry);

    const logLine = `[${entry.timestamp}] ${metric}: ${value}${
      typeof value === 'number' ? 'ms' : ''
    }\n`;
    this.combinedLog += logLine;
    if (isError) {
      this.errorLog += logLine;
    }

    console.log(
      `[Performance] ${metric}: ${value}${
        typeof value === 'number' ? 'ms' : ''
      }`
    );
  },

  logError(metric: Metric, error: Error): void {
    this.log(metric, `Error: ${error.message}`, true);
  },

  measureFPS(callback: () => void): void {
    let frameCount = 0;
    let lastTime = performance.now();

    const measure = () => {
      frameCount++;
      const currentTime = performance.now();
      const elapsed = currentTime - lastTime;

      if (elapsed >= 1000) {
        const fps = Math.round((frameCount * 1000) / elapsed);
        this.log('FPS', fps.toString());
        frameCount = 0;
        lastTime = currentTime;
      }

      callback();
      requestAnimationFrame(measure);
    };

    requestAnimationFrame(measure);
  },

  getMemoryUsage(): void {
    if ('memory' in performance) {
      // @ts-ignore
      const memory = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(
        2
      );
      this.log('MemoryUsage', `${memory} MB`);
    } else {
      this.log('MemoryUsage', 'Not supported in this browser', true);
    }
  },

  getLogs(): LogEntry[] {
    return [...this.logs];
  },

  clearLogs(): void {
    this.logs = [];
    this.combinedLog = '';
    this.errorLog = '';
  },

  downloadLog(type: 'combined' | 'error'): void {
    const content = type === 'combined' ? this.combinedLog : this.errorLog;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};

export default performanceLogger;
