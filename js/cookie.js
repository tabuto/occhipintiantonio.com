/**
 * cookie.js — Cookie consent management with conditional GA4 loading.
 *
 * Consent is stored in localStorage as JSON: { value: 'accepted'|'rejected', date: <timestamp> }
 * Consent expires after 6 months and is re-requested on next visit.
 *
 * Replace GA_ID with the real GA4 Measurement ID before going to production.
 */
;(function () {
  const CONSENT_KEY   = 'cookie_consent'
  const GA_ID         = 'G-XXXXXXXXXX' // TODO: replace with real GA4 Measurement ID
  const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000

  function readConsent() {
    try {
      const raw = localStorage.getItem(CONSENT_KEY)
      if (!raw) return null
      const { value, date } = JSON.parse(raw)
      if (Date.now() - date > SIX_MONTHS_MS) {
        localStorage.removeItem(CONSENT_KEY)
        return null
      }
      return value
    } catch {
      return null
    }
  }

  function saveConsent(value) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ value, date: Date.now() }))
  }

  function loadGA4() {
    if (document.getElementById('ga4-script')) return
    const s    = document.createElement('script')
    s.id       = 'ga4-script'
    s.async    = true
    s.src      = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    document.head.appendChild(s)
    window.dataLayer = window.dataLayer || []
    function gtag() { dataLayer.push(arguments) }
    window.gtag = gtag
    gtag('js', new Date())
    gtag('config', GA_ID)
  }

  document.addEventListener('alpine:init', () => {
    const consent = readConsent()

    Alpine.store('cookies', {
      showBanner: consent === null,

      accept() {
        saveConsent('accepted')
        this.showBanner = false
        loadGA4()
      },

      reject() {
        saveConsent('rejected')
        this.showBanner = false
      },
    })

    if (consent === 'accepted') loadGA4()
  })
})()
