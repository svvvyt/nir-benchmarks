import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App';
import './index.css';
import performanceLogger from './utils/performanceLogger';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Замер скорости загрузки
const stopLoading = performanceLogger.start('LoadingSpeed');

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Замер TTI
document.addEventListener('DOMContentLoaded', () => {
  stopLoading();
  const stopTTI = performanceLogger.start('Time To Interactive');
  setTimeout(() => stopTTI(), 100); // TTI после рендера
});
