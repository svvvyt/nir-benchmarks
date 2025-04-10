import { useEffect } from 'react';
import { CustomRouter } from './router';
import performanceLogger from './utils/performanceLogger';

function App() {
  useEffect(() => {
    performanceLogger.getMemoryUsage();
    const interval = setInterval(
      () => performanceLogger.getMemoryUsage(),
      10000
    ); // Каждые 10 сек
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='App'>
      <CustomRouter />
    </div>
  );
}

export default App;
