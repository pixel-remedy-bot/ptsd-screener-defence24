# Instrukcja wdrożenia PTSD Screener na Vercel

## 🚀 Szybki deployment (1 minuta)

### Opcja 1: Deploy przez Vercel UI (najszybsza)

1. Wejdź na: **https://vercel.com/new**

2. Kliknij **"Continue with GitHub"** i zaloguj się

3. Znajdź repozytorium: **ptsd-screener-defence24**

4. Kliknij **"Import"**

5. W ustawieniach projektu:
   - **Project Name**: `ptsd-screener-defence24` (lub własny)
   - **Framework Preset**: `Other` (lub `Create React App`)
   - **Build Command**: zostaw puste (statyczne HTML/CSS/JS)
   - **Output Directory**: `./`

6. Kliknij **"Deploy"**

7. Gotowe! 🎉
   - URL będzie wyglądał: `https://ptsd-screener-defence24.vercel.app`

---

### Opcja 2: Deploy przez Vercel CLI

```bash
# Instalacja Vercel CLI
npm i -g vercel

# Logowanie (otworzy przeglądarkę)
vercel login

# Deployment
cd /Users/ct/.openclaw/workspace-frontend/ptsd-screener
vercel --prod
```

---

### Opcja 3: GitHub Pages (darmowe, bez reklam)

1. Wejdź na: https://github.com/pixel-remedy-bot/ptsd-screener-defence24/settings/pages

2. W sekcji "Source" wybierz:
   - **Branch**: `main`
   - **Folder**: `/ (root)`

3. Kliknij **"Save"**

4. Po 2-3 minutach aplikacja będzie dostępna pod:
   - `https://pixel-remedy-bot.github.io/ptsd-screener-defence24/`

---

## 📋 Po wdrożeniu

### 1. Zmień link do umawiania wizyt

Edytuj plik `app.js` w repozytorium (linia ~350):

```javascript
<a href="https://TWOJ-LINK.pl/umow-wizyte" target="_blank">
  📅 Umów wizytę
</a>
```

### 2. Test embedowania na defence24.pl

Dodaj ten kod pod artykułem:

```html
<script src="https://TWOJA-DOMENA.vercel.app/embed.js" 
        data-theme="auto" 
        async></script>
```

Lub użyj iframe:

```html
<iframe src="https://TWOJA-DOMENA.vercel.app/" 
        width="100%" 
        height="600" 
        frameborder="0"
        title="PTSD Screener">
</iframe>
```

---

## 🔗 Linki

- **GitHub Repo**: https://github.com/pixel-remedy-bot/ptsd-screener-defence24
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Pages Settings**: https://github.com/pixel-remedy-bot/ptsd-screener-defence24/settings/pages

---

## ⚡ Vercel vs GitHub Pages

| Cecha | Vercel | GitHub Pages |
|-------|--------|--------------|
| SSL/HTTPS | ✅ Automatycznie | ✅ Automatycznie |
| CI/CD | ✅ Auto-deploy | ✅ Auto-deploy |
| Custom domain | ✅ | ✅ |
| Analytics | ✅ | ❌ |
| Reklamy | ❌ | ❌ |
| Cena | Darmowy | Darmowy |

**Rekomendacja**: Vercel - lepszy dla widgetów (faster CDN, lepsza obsługa JS)

---

## 🆘 Problem?

Jeśli masz problem z deploymentem:
1. Sprawdź czy repo jest publiczne
2. Wyczyść cache przeglądarki (Ctrl+Shift+R)
3. Sprawdź logi builda w Vercel Dashboard
4. Skontaktuj się ze mną - pomogę!
