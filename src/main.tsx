import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { StandaloneCaseStudy } from './components/StandaloneCaseStudy.tsx';
import './index.css';

const view = new URLSearchParams(window.location.search).get('view');
const isCaseStudy = view === 'case-study' || view === 'process';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isCaseStudy ? <StandaloneCaseStudy /> : <App />}
  </StrictMode>,
);
