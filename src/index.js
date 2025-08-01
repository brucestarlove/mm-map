import React from 'react';
import { createRoot } from 'react-dom/client';
import MonumentMap from './MonumentMap';
import './styles.css';

const initializeApp = () => {
  console.log('Monument Map: Initializing app...');
  console.log('React version:', React.version);
  
  const container = document.getElementById('react-target');
  console.log('Container found:', !!container);
  
  if (container) {
    try {
      console.log('Creating React root...');
      const root = createRoot(container);
      console.log('Root created:', root);
      console.log('Root render method exists:', typeof root.render === 'function');
      
      if (typeof root.render === 'function') {
        console.log('Rendering MonumentMap component...');
        root.render(<MonumentMap />);
        console.log('Component rendered successfully');
      } else {
        console.error('Root object does not have render method. Falling back to legacy render.');
        // Fallback to legacy ReactDOM.render for older React versions
        if (window.ReactDOM && window.ReactDOM.render) {
          console.log('Using global ReactDOM.render');
          window.ReactDOM.render(<MonumentMap />, container);
        } else {
          console.error('Neither createRoot nor ReactDOM.render is available');
        }
      }
    } catch (error) {
      console.error('Error during app initialization:', error);
      console.error('Error stack:', error.stack);
    }
  } else {
    console.error('React target container not found');
    // Optionally retry after a delay
    setTimeout(initializeApp, 100);
  }
};

// Run on DOMContentLoaded to ensure DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
