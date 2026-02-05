# PTSD Screener - Kwestionariusz Screeningowy

Aplikacja webowa do screening PTSD dla wojskowych i mundurowych służb. Osadzana jako widget na portalu defence24.pl.

## 🛡️ Opis

Szybki, 2-minutowy kwestionariusz oparty na walidowanym narzędziu **PC-PTSD-5** (Primary Care PTSD Screen for DSM-5) opracowanym przez National Center for PTSD (USA).

**Ważne:** To narzędzie ma wyłącznie charakter edukacyjny i informacyjny. Nie stanowi diagnozy medycznej ani nie zastępuje konsultacji z lekarzem.

## 📁 Struktura plików

```
ptsd-screener/
├── index.html      # Główna strona (standalone)
├── styles.css      # Style (light/dark mode)
├── app.js          # Logika aplikacji
├── embed.js        # Skrypt do embedowania
└── README.md       # Dokumentacja
```

## 🚀 Użycie

### Opcja 1: Standalone (bezpośredni link)

Otwórz `index.html` w przeglądarce lub hostuj na serwerze:

```html
<a href="https://twoja-domena.pl/ptsd-screener/">
  Przejdź do kwestionariusza PTSD
</a>
```

### Opcja 2: Embed jako widget (rekomendowane)

Dodaj do strony defence24.pl:

```html
<!-- W sekcji <head> lub przed zamknięciem </body> -->
<script src="https://twoja-domena.pl/ptsd-screener/embed.js" 
        data-theme="auto"
        async></script>

<!-- Opcjonalnie: kontener w konkretnym miejscu -->
<div id="ptsd-screener-container"></div>
```

#### Parametry `data-theme`:
- `"light"` - zawsze jasny motyw
- `"dark"` - zawsze ciemny motyw  
- `"auto"` - automatycznie na podstawie systemu (domyślne)

### Opcja 3: Iframe

```html
<iframe src="https://twoja-domena.pl/ptsd-screener/" 
        width="100%" 
        height="600" 
        frameborder="0">
</iframe>
```

## 🎨 Dostosowanie

### Kolory marki

Brand color (turkus defence24): `#46b7c6`

Aby zmienić, edytuj zmienne CSS w `styles.css`:

```css
:root {
  --brand-color: #46b7c6;
  --brand-color-dark: #3a9aa7;
  --brand-color-light: #5ec5d1;
}
```

### Link do umawiania wizyty

W pliku `app.js` zmień link w sekcji `renderResults()`:

```javascript
<a href="https://twoj-link.pl/umow-wizyte" target="_blank">
  📅 Umów wizytę
</a>
```

## ⚖️ Zgodność z MDR

Aplikacja została zaprojektowana jako **narzędzie edukacyjne**, nie urządzenie medyczne:

- ✅ Brak diagnozy - zawsze kieruje do specjalisty
- ✅ Wyraźny disclaimer na starcie i końcu
- ✅ Nie przechowuje danych medycznych
- ✅ Język: "screening", "kwestionariusz" - nigdy "diagnoza"

## 📱 Responsywność

Aplikacja jest w pełni responsywna:
- Mobile-first (320px+)
- Tablet i desktop
- Tryby jasny i ciemny

## 🔒 Prywatność

- Brak zapisu danych na serwerze
- Wyniki w `sessionStorage` (tylko sesja)
- Brak wysyłania danych do zewnętrznych serwisów
- Brak ciasteczek

## 📋 Pytania (PC-PTSD-5)

Kwestionariusz składa się z 5 pytań tak/nie:

1. Intruzje (powracające myśli/wspomnienia)
2. Koszmary senne
3. Flashbacki
4. Unikanie wyzwalaczy
5. Unikanie myśli/uczuć

**Źródło:** National Center for PTSD, U.S. Department of Veterans Affairs

## 📞 Wsparcie

W aplikacji dostępne są linki do:
- Telefon zaufania: 116 123
- Portal defence24.pl
- Formularz umawiania wizyty (do skonfigurowania)

## 📄 Licencja

Domena publiczna. PC-PTSD-5 jest narzędziem w domenie publicznej udostępnionym przez National Center for PTSD.

## 🔧 Technologie

- Vanilla JavaScript (ES6+)
- CSS3 (zmienne CSS, flexbox, grid)
- HTML5
- Bez zależności zewnętrznych

---

**Autor:** Zespół OpenClaw dla Defence24.pl
**Wersja:** 1.0.0
**Data:** 2026-02-05
