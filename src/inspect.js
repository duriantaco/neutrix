// src/inspect.js
import * as neutrix from 'neutrix';

// Log all available exports
console.log('All exports from neutrix:', Object.keys(neutrix));

// Try importing specific things
try {
  const { createStore, useStore } = neutrix;
  console.log('\nIndividual exports:');
  console.log('createStore available:', !!createStore);
  console.log('useStore available:', !!useStore);
} catch (e) {
  console.log('\nError accessing specific exports:', e.message);
}