// src/inspect.js
import * as spyn from 'spyn';

// Log all available exports
console.log('All exports from spyn:', Object.keys(spyn));

// Try importing specific things
try {
  const { createStore, useStore } = spyn;
  console.log('\nIndividual exports:');
  console.log('createStore available:', !!createStore);
  console.log('useStore available:', !!useStore);
} catch (e) {
  console.log('\nError accessing specific exports:', e.message);
}