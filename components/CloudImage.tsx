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
  // Build responsive srcsets (use a sensible set of widths)
  const candidateWidths = [320, 480, 640, 768, 1024, 1280, 1600, 1920];
  // If a target width is provided, prefer sizes around it
  const widths = width
    ? Array.from(new Set([Math.max(320, Math.round(width / 2)), width, Math.round(width * 1.5), Math.round(width * 2)]))
        .filter(Boolean)
        .map(w => Math.min(w, 1920))
    : candidateWidths;

  const buildSrcSet = () =>
    widths
      .map((w) => {
        // Request width-specific transformation
        const url = buildCloudinaryUrl({ rawSrc: src, width: w, height: undefined, cloudName, fillCrop });
        // Cloudinary f_auto will already prefer modern formats
        return `${url} ${w}w`;
      })
      .join(', ');

  const srcSet = buildSrcSet();
  const webpSrcSet = buildSrcSet();

  const sizes = width ? `${width}px` : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  const fallbackImg = buildCloudinaryUrl({ rawSrc: src, width: width || 800, height, cloudName, fillCrop });

  const style: React.CSSProperties = !width && !height ? { maxWidth: '100%', height: 'auto' } : {};

  return (
    <picture>
      {/* Prefer WebP/AVIF via Cloudinary's f_auto/q_auto but provide explicit srcset for browsers */}
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      {/* Fallback source (browser will pick the best available) */}
      <img
        src={fallbackImg}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : loading}
        width={width || undefined}
        height={height || undefined}
        className={className}
        style={style}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
      />
    </picture>
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
