// ── i18n store ──────────────────────────────────────────────────
document.addEventListener('alpine:init', () => {
  Alpine.store('i18n', {
    lang: localStorage.getItem('lang') || 'it',
    setLang(l) {
      this.lang = l
      localStorage.setItem('lang', l)
      window.dispatchEvent(new CustomEvent('lang-changed', { detail: l }))
    },
    // Category name translations (canonical IT key → EN label)
    _catMap: {
      'Marine':     'Seascapes',
      'Paesaggi':   'Landscapes',
      'Ritratti':   'Portraits',
      'Figure':     'Figures',
      'Arte Sacra': 'Sacred Art',
      'Nudi':       'Nudes',
    },
    cat(name) {
      return this.lang === 'en' ? (this._catMap[name] ?? name) : name
    },
  })
})

// ── Lightbox store ──────────────────────────────────────────────
document.addEventListener('alpine:init', () => {
  Alpine.store('lb', {
    open: false,
    art:  null,
    show(art) { this.art = art; this.open = true; },
    close()   { this.open = false; this.art = null; },
  })
})

// ── Markdown section component ──────────────────────────────────
function markdownSection(file) {
  return {
    content: '',
    loading: true,
    error:   null,
    _file:   file,

    async load() {
      this.loading = true
      this.error   = null
      const lang = Alpine.store('i18n').lang
      try {
        const res = await fetch(`content/${lang}/${this._file}.md`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const md = await res.text()
        this.content = marked.parse(md)
      } catch {
        // Fallback to Italian if the requested language file is missing
        if (lang !== 'it') {
          try {
            const res = await fetch(`content/it/${this._file}.md`)
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const md = await res.text()
            this.content = marked.parse(md)
            return
          } catch { /* fall through */ }
        }
        this.error = Alpine.store('i18n').lang === 'it'
          ? 'Contenuto non disponibile.'
          : 'Content not available.'
      } finally {
        this.loading = false
      }
    },

    init() {
      window.addEventListener('lang-changed', () => this.load())
    },
  }
}

// ── Gallery component ───────────────────────────────────────────
function gallery(dataUrl = 'data/gallery.json') {
  return {
    artworks:       [],
    categories:     [],
    activeCategory: 'Tutte',
    loading:        true,
    error:          null,
    _dataUrl:       dataUrl,

    // Returns the display label for a category in the current language
    translateCat(cat) {
      return this.$store.i18n.cat(cat)
    },

    async load() {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(this._dataUrl)
        if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`)
        const raw = await res.json()
        // Support both a flat array and a categorised object { categories: [{ items: [] }] }
        const data = Array.isArray(raw)
          ? raw
          : (raw.categories ?? []).flatMap(c => c.items ?? [])
        this.artworks   = data
        this.categories = [...new Set(data.map(a => a.category))]
      } catch (err) {
        // 404 = file non presente: stato vuoto silenzioso, nessun messaggio
        if (!err.message.includes('404')) {
          this.error = this.$store.i18n.lang === 'it'
            ? `Impossibile caricare le opere: ${err.message}`
            : `Unable to load artworks: ${err.message}`
        }
      } finally {
        this.loading = false
      }
    },

    get filtered() {
      if (this.activeCategory === 'Tutte') return this.artworks
      return this.artworks.filter(a => a.category === this.activeCategory)
    },

    openLightbox(art) {
      this.$store.lb.show(art)
    },
  }
}
