document.getElementById('acceptCookies').addEventListener('click', function() {
    document.cookie = "analytics_consent=true; path=/";
    hideConsentBanner();
    loadGoogleAnalytics();
});

document.getElementById('declineCookies').addEventListener('click', function() {
    document.cookie = "analytics_consent=false; path=/";
    hideConsentBanner();
});

function hideConsentBanner() {
    document.getElementById('cookieConsent').style.display = 'none';
}
