import React from 'react';
import { createRoot } from 'react-dom/client';
import MonumentMap from './MonumentMap';
import './styles.css';

const initializeApp = () => {
  const container = document.getElementById('react-target');
  if (container) {
    const root = createRoot(container);
    root.render(<MonumentMap />);
  } else {
    console.error('React target container not found');
    // Optionally retry after a delay
    setTimeout(initializeApp, 100);
  }
};

// Run on DOMContentLoaded to ensure DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
