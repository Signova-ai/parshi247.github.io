// Aggressive Cache Busting for Signova
(function() {
    'use strict';
    
    // Force cache refresh on page load
    if (performance.navigation.type !== performance.navigation.TYPE_RELOAD) {
        // Add timestamp to all resource URLs to prevent caching
        const timestamp = Date.now();
        
        // Update all CSS links
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            if (!link.href.includes('?v=')) {
                link.href += '?v=' + timestamp;
            }
        });
        
        // Update all script sources
        document.querySelectorAll('script[src]').forEach(script => {
            if (!script.src.includes('?v=') && !script.src.includes('stripe.com')) {
                script.src += '?v=' + timestamp;
            }
        });
    }
    
    // Set cache-control headers via meta tags
    const metaCache = document.createElement('meta');
    metaCache.httpEquiv = 'Cache-Control';
    metaCache.content = 'no-cache, no-store, must-revalidate';
    document.head.appendChild(metaCache);
    
    const metaPragma = document.createElement('meta');
    metaPragma.httpEquiv = 'Pragma';
    metaPragma.content = 'no-cache';
    document.head.appendChild(metaPragma);
    
    const metaExpires = document.createElement('meta');
    metaExpires.httpEquiv = 'Expires';
    metaExpires.content = '0';
    document.head.appendChild(metaExpires);
    
    // Force reload if cached version detected
    const lastUpdate = localStorage.getItem('signova-last-update');
    const currentUpdate = '1724001234567'; // Update this timestamp when deploying
    
    if (lastUpdate && lastUpdate !== currentUpdate) {
        localStorage.setItem('signova-last-update', currentUpdate);
        if (!window.location.search.includes('cache-bust')) {
            window.location.href = window.location.href + '?cache-bust=' + Date.now();
        }
    } else if (!lastUpdate) {
        localStorage.setItem('signova-last-update', currentUpdate);
    }
})();

