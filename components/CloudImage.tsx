'use client';
import React, { memo } from 'react';

interface CloudImageProps {
  /** Cloudinary public ID (e.g. folder/image) OR full Cloudinary URL */
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  /** Optional override for cloud name when providing only a public ID */
  cloudName?: string;
  /** Set to true to use c_fill instead of c_fit when both width & height provided */
  fillCrop?: boolean;
  /** Override loading behavior (defaults to lazy) */
  loading?: 'lazy' | 'eager';
  /** Priority hint for LCP images */
  priority?: boolean;
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
      return rawSrc;
    }
    baseUrl = `https://res.cloudinary.com/${cn}/image/upload/${rawSrc.replace(/^\/+/, '')}`;
  }

  try {
    const url = new URL(baseUrl);
    const uploadIndex = url.pathname.indexOf('/upload/');
    if (uploadIndex === -1) return baseUrl;

    const before = url.pathname.substring(0, uploadIndex + '/upload/'.length);
    const after = url.pathname.substring(uploadIndex + '/upload/'.length);

    // Build transformation string with optimized quality
    const transforms: string[] = ['f_auto', 'q_auto:good']; // Better quality/size balance
    if (width) transforms.push(`w_${Math.round(width)}`);
    if (height) transforms.push(`h_${Math.round(height)}`);
    if (width || height) {
      transforms.push(fillCrop && width && height ? 'c_fill' : 'c_fit');
    }

    const newPath = `${before}${transforms.join(',')}/${after}`;
    url.pathname = newPath;
    return url.toString();
  } catch {
    return baseUrl;
  }
}

const CloudImage: React.FC<CloudImageProps> = memo(({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  cloudName, 
  fillCrop, 
  loading = 'lazy',
  priority = false 
}) => {
  const optimized = buildCloudinaryUrl({ rawSrc: src, width, height, cloudName, fillCrop });
  const style: React.CSSProperties = !width && !height ? { maxWidth: '100%', height: 'auto' } : {};
  
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={optimized}
      alt={alt}
      loading={priority ? 'eager' : loading}
      width={width || undefined}
      height={height || undefined}
      className={className}
      style={style}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
    />
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo optimization
  return (
    prevProps.src === nextProps.src &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.className === nextProps.className &&
    prevProps.loading === nextProps.loading
  );
});

CloudImage.displayName = 'CloudImage';

export default CloudImage;
