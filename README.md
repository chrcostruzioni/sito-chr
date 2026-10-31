# Sito CHR Costruzioni

Sito di chrcostruzioni.it, in italiano e inglese, costruito con [Eleventy](https://www.11ty.dev/).

- `content/lavori/`: un file per ogni lavoro (foto, video, testi IT/EN). Si modificano dal pannello.
- `src/_data/impresa.json`: telefono, orari, email, social, chiave del modulo.
- `src/_data/recensioni.json`: recensioni mostrate in home (la sezione appare solo se ce n'è almeno una).
- `src/it/` e `src/en/`: le pagine nelle due lingue.
- `src/media/`: immagini, video, font, foglio di stile.

## Pannello di modifica

Il pannello è [Pages CMS](https://app.pagescms.org): si entra con l'account GitHub e si sceglie il repository `sito-chr`. La configurazione è in `.pages.yml`.

## Pubblicazione

Hosting su Cloudflare Pages: comando di build `npm run build`, cartella di uscita `_site`. Ogni modifica salvata dal pannello ripubblica il sito in un paio di minuti.

## Modulo preventivi

Il modulo usa [Web3Forms](https://web3forms.com): la chiave va in `src/_data/impresa.json` (`web3forms_key`). Le richieste arrivano a chirilaion.chr@gmail.com.
