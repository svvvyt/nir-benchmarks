import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import performanceLogger from './utils/performanceLogger';

const app = createApp(App);
app.use(router);

const stopLoading = performanceLogger.start('LoadingSpeed');

document.addEventListener('DOMContentLoaded', () => {
  stopLoading();
  const stopTTI = performanceLogger.start('Time To Interactive');
  setTimeout(() => stopTTI(), 100); // TTI после рендера
});

router.beforeEach((to, from, next) => {
  const stop = performanceLogger.start('RouteTransitionSpeed');
  next();
  return () => stop();
});

app.mount('#app');
