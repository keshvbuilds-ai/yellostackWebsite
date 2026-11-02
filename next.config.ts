import type { NextConfig } from "next";
const nextConfig: NextConfig = {
 poweredByHeader:false,
 async headers(){return [{source:'/:path*',headers:[
 {key:'X-Content-Type-Options',value:'nosniff'},
 {key:'X-Frame-Options',value:'SAMEORIGIN'},
 {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
 {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},
 // Same-origin embedding is needed by the CMS visual editor. Inline Next.js bootstrap
 // scripts remain allowed; a nonce CSP requires separate rendering integration.
 {key:'Content-Security-Policy',value:"object-src 'none'; base-uri 'self'; frame-ancestors 'self'; form-action 'self'"},
 ...(process.env.NODE_ENV==='production'?[{key:'Strict-Transport-Security',value:'max-age=31536000'}]:[])
 ]}];}
};
export default nextConfig;
