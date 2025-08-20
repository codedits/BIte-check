'use client';
import React from 'react';

interface CloudImageProps {
  /** Cloudinary public ID (e.g. folder/image) OR full Cloudinary URL */
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  /** Optional override for cloud name when providing only a public ID */
  cloudName?: string; // falls back to env NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  /** Set to true to use c_fill instead of c_fit when both width & height provided */
  fillCrop?: boolean;
  /** Override loading behavior (defaults to lazy) */
  loading?: 'lazy' | 'eager';
}

// Normalizes a Cloudinary URL to ensure required transformations (f_auto,q_auto + sizing)
function buildCloudinaryUrl({
  rawSrc,
  width,
  height,
  cloudName,
  fillCrop,
}: { rawSrc: string; width?: number; height?: number; cloudName?: string; fillCrop?: boolean }): string {
  if (!rawSrc) return '';
  const isFull = /^https?:\/\//i.test(rawSrc);

  // If only public ID, build base URL
  let baseUrl = rawSrc;
  if (!isFull) {
    const cn = cloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cn) {
      // Without a cloud name we can't build; return raw as-is
      return rawSrc;
    }
    baseUrl = `https://res.cloudinary.com/${cn}/image/upload/${rawSrc.replace(/^\/+/, '')}`;
  }

  try {
    const url = new URL(baseUrl);
    // Only manipulate if it's a Cloudinary resource with /upload/
    const uploadIndex = url.pathname.indexOf('/upload/');
    if (uploadIndex === -1) return baseUrl; // not a standard upload URL

    const before = url.pathname.substring(0, uploadIndex + '/upload/'.length); // includes trailing slash
    const after = url.pathname.substring(uploadIndex + '/upload/'.length); // remainder after upload/

    // Build transformation string
    const transforms: string[] = ['f_auto', 'q_auto'];
    if (width) transforms.push(`w_${Math.round(width)}`);
    if (height) transforms.push(`h_${Math.round(height)}`);
    if (width || height) {
      // c_fit keeps aspect; optionally allow fill crop
      transforms.push(fillCrop && width && height ? 'c_fill' : 'c_fit');
    }

    // If there are already transformations present, detect (Cloudinary transformations are comma-separated and go right after upload/ BEFORE the asset path)
    // We do a simple heuristic: if 'upload/' is followed by something without a '/' within first segment containing '.'? We'll just prepend ours.
    // Simpler: Always prepend ours unless after already starts with 'v' version segment AND a number; still safe to prepend.
    const newPath = `${before}${transforms.join(',')}/${after}`;
    url.pathname = newPath;
    return url.toString();
  } catch {
    return baseUrl; // fallback unchanged on URL parse failure
  }
}

const CloudImage: React.FC<CloudImageProps> = ({ src, alt, width, height, className = '', cloudName, fillCrop, loading = 'lazy' }) => {
  const optimized = buildCloudinaryUrl({ rawSrc: src, width, height, cloudName, fillCrop });
  const style: React.CSSProperties = !width && !height ? { maxWidth: '100%', height: 'auto' } : {};
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={optimized}
      alt={alt}
  loading={loading}
      width={width || undefined}
      height={height || undefined}
      className={className}
      style={style}
      decoding="async"
    />
  );
};

export default CloudImage;
