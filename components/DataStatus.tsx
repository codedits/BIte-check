'use client';

// Lightweight dev-only DataStatus; noop in production to reduce bundle size.
export default function DataStatus(){
  if(process.env.NODE_ENV!=='development') return null;
  return null;
}

