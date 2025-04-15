const performanceLogger = {
  logs: [],
  combinedLog: '',
  errorLog: '',

  start(metric) {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.log(metric, duration);
    };
  },

  log(metric, value, isError = false) {
    const entry = {
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

  logError(metric, error) {
    this.log(metric, `Error: ${error.message}`, true);
  },

  measureFPS(callback) {
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

  getMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(
        2
      );
      this.log('MemoryUsage', `${memory} MB`);
    } else {
      this.log('MemoryUsage', 'Not supported in this browser', true);
    }
  },

  getLogs() {
    return [...this.logs];
  },

  clearLogs() {
    this.logs = [];
    this.combinedLog = '';
    this.errorLog = '';
  },

  downloadLog(type) {
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
