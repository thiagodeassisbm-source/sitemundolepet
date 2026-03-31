export function publicAsset(path) {
    if (!path || typeof path !== 'string') return '';
    if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:')) return path;

    const normalized = path.startsWith('/') ? path : `/${path}`;
    if (normalized.startsWith('/site/')) return normalized;

    // Detect if site is served from a subfolder like /site (standard in some of our shared hosting setups)
    const hasSitePath = typeof window !== 'undefined' && 
                       (window.location.pathname.startsWith('/site/') || window.location.pathname === '/site');

    if (hasSitePath) {
        return `/site${normalized}`;
    }

    return normalized;
}

export function withFallbackAsset(path) {
    const primary = publicAsset(path);
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return { primary, fallback: normalized };
}
