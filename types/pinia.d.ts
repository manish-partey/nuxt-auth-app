import type { Pinia } from 'pinia'; // Use type-only import for Pinia type

// Extend the NuxtApp interface to include the $pinia property
declare module '#app' {
  interface NuxtApp {
    $pinia: Pinia;
  }
}
