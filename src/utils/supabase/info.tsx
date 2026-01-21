/* Read Supabase config from environment when available.
	 Frontend should provide `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
	 This file keeps backwards-compatibility by falling back to the embedded values
	 if env vars are not provided. Do NOT embed service_role keys here.
*/

// Access Vite environment variables directly from import.meta
interface ImportMetaEnv {
	VITE_SUPABASE_URL?: string;
	VITE_SUPABASE_ANON_KEY?: string;
}

declare global {
	interface ImportMeta {
		readonly env: ImportMetaEnv;
	}
}

const viteUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://iytnisowaqccipvrknbz.supabase.co';
const viteAnon = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5dG5pc293YXFjY2lwdnJrbmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNDA1MTgsImV4cCI6MjA3MzYxNjUxOH0.QKX3tctn4KYe-dSPFFATRtkzLuPayqZoJMo285I9lCk';

function extractProjectId(url: string): string | null {
	try {
		if (!url) return null;
		const u = new URL(url);
		const hostname = u.hostname; // e.g. iytnisowaqccipvrknbz.supabase.co
		const parts = hostname.split('.');
		if (parts.length > 0) return parts[0];
		return null;
	} catch (e) {
		return null;
	}
}

// Fallback hardcoded values (kept for compatibility if env not set)
const FALLBACK_PROJECT_ID = "iytnisowaqccipvrknbz";
const FALLBACK_PUBLIC_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5dG5pc293YXFjY2lwdnJrbmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNDA1MTgsImV4cCI6MjA3MzYxNjUxOH0.QKX3tctn4KYe-dSPFFATRtkzLuPayqZoJMo285I9lCk";

export const projectId = extractProjectId(viteUrl) || FALLBACK_PROJECT_ID;
export const publicAnonKey = viteAnon || FALLBACK_PUBLIC_ANON;
