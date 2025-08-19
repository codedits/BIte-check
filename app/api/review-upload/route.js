import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'node:fs';

// Ensure Node.js runtime (Cloudinary SDK is not compatible with Edge runtime)
export const runtime = 'nodejs';

// Configure Cloudinary using environment variables
// Prefer explicit keys when present; otherwise let the SDK pick up CLOUDINARY_URL automatically
const explicitCloudName = process.env.CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
const explicitApiKey = process.env.API_KEY || process.env.CLOUDINARY_API_KEY;
const explicitApiSecret = process.env.API_SECRET || process.env.CLOUDINARY_API_SECRET;

if (explicitCloudName && explicitApiKey && explicitApiSecret) {
  cloudinary.config({
    secure: true,
    cloud_name: explicitCloudName,
    api_key: explicitApiKey,
    api_secret: explicitApiSecret,
  });
} else {
  // This allows using CLOUDINARY_URL without duplicating vars
  cloudinary.config({ secure: true });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const file = body?.file; // expected to be a data URL or remote URL

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

  console.log('Review upload invoked; file length:', typeof file === 'string' ? file.length : 'non-string');
  // Log presence of credentials (do not log secrets)
  const cfg = cloudinary.config();
  console.log('Cloudinary config present - cloud_name:', !!cfg.cloud_name, 'api_key:', !!cfg.api_key, 'via URL:', !!process.env.CLOUDINARY_URL);

  if (!cfg.api_key || !cfg.api_secret || !cfg.cloud_name) {
    console.error('Cloudinary not configured: missing API credentials');
    return NextResponse.json({ error: 'Server misconfiguration: missing Cloudinary credentials' }, { status: 500 });
  }

    // Enforce maximum file size (700 KB)
    const MAX_BYTES = 700 * 1024; // 700 KB

    const isDataUrl = typeof file === 'string' && file.startsWith('data:');
    const isRemoteUrl = typeof file === 'string' && /^https?:\/\//i.test(file);

    if (isDataUrl) {
      // data:[<mediatype>][;base64],<data>
      const comma = file.indexOf(',');
      const header = file.substring(0, comma);
      const payload = file.substring(comma + 1);
      // assume base64
      const padding = (payload.endsWith('==') ? 2 : (payload.endsWith('=') ? 1 : 0));
      const estimatedBytes = Math.ceil((payload.length * 3) / 4) - padding;
      if (estimatedBytes > MAX_BYTES) {
        return NextResponse.json({ error: 'File too large. Maximum allowed size is 700 KB.' }, { status: 413 });
      }
    } else if (isRemoteUrl) {
      // Try HEAD first to get content-length
      try {
        const headResp = await fetch(file, { method: 'HEAD' });
        if (headResp.ok) {
          const len = headResp.headers.get('content-length');
          if (len && Number(len) > MAX_BYTES) {
            return NextResponse.json({ error: 'File too large. Maximum allowed size is 700 KB.' }, { status: 413 });
          }
        }
      } catch (e) {
        // HEAD failed; fall through to streaming check
      }

      // Stream the remote file and abort if it exceeds MAX_BYTES
      try {
        const controller = new AbortController();
        const resp = await fetch(file, { signal: controller.signal });
        if (!resp.ok) {
          return NextResponse.json({ error: 'Failed to fetch remote file' }, { status: resp.status });
        }

        const reader = resp.body?.getReader && resp.body.getReader();
        if (reader) {
          let received = 0;
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            received += value.byteLength || value.length || 0;
            if (received > MAX_BYTES) {
              // cancel fetch
              try { controller.abort(); } catch (_) {}
              return NextResponse.json({ error: 'File too large. Maximum allowed size is 700 KB.' }, { status: 413 });
            }
          }
        }
      } catch (streamErr) {
        // If the streaming check fails for any reason, return an error
        console.warn('Streaming size check failed:', streamErr && (streamErr.message || streamErr));
        return NextResponse.json({ error: 'Unable to validate remote file size' }, { status: 400 });
      }
    } else {
      // Unknown file format (not data URL or http URL)
      return NextResponse.json({ error: 'Unsupported file format. Send a data URL or remote http(s) URL.' }, { status: 400 });
    }

    // Upload to Cloudinary into folder bitecheck/reviews
    const result = await cloudinary.uploader.upload(file, {
      folder: 'bitecheck/reviews',
      resource_type: 'image',
      overwrite: false,
      use_filename: true,
      unique_filename: true,
    });

    return NextResponse.json({ secure_url: result.secure_url });
  } catch (error) {
  console.error('Cloudinary upload error:', error && (error.message || error));
  // Try to extract useful info
  const message = (error && (error.message || JSON.stringify(error))) || 'Upload failed';
  const status = (error && error.http_code) || 500;
  return NextResponse.json({ error: 'Upload failed', details: message }, { status });
  }
}

// GET - debug endpoint to check whether Cloudinary env vars are visible to the running process
export async function GET() {
  const cfg = cloudinary.config();
  // Inspect .env.local content without leaking secrets
  let envLocalInfo = { exists: false, size: 0, hasCLOUDINARY_URLKey: false, hasExplicitKeys: { name: false, key: false, secret: false }, probableEncoding: 'unknown' };
  try {
    if (fs.existsSync('.env.local')) {
      const buf = fs.readFileSync('.env.local');
      const containsNulls = buf.includes(0x00);
      const content = buf.toString('utf8');
      envLocalInfo = {
        exists: true,
        size: buf.length,
        hasCLOUDINARY_URLKey: content.includes('CLOUDINARY_URL='),
        hasExplicitKeys: {
          name: content.includes('CLOUDINARY_CLOUD_NAME='),
          key: content.includes('CLOUDINARY_API_KEY='),
          secret: content.includes('CLOUDINARY_API_SECRET=')
        },
        probableEncoding: containsNulls ? 'utf16-le-or-utf16-be' : 'utf8-or-ansi'
      };
    }
  } catch (_) {}
  return NextResponse.json({
    cloudinaryConfig: {
      cloud_name_present: !!cfg.cloud_name,
      api_key_present: !!cfg.api_key,
    },
    env: {
      CLOUDINARY_URL: !!process.env.CLOUDINARY_URL,
      CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
      CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
    },
    runtime: {
      cwd: process.cwd(),
      envFiles: {
        envLocalExists: fs.existsSync('.env.local'),
        envExists: fs.existsSync('.env'),
      },
      envLocalInfo
    }
  });
}
