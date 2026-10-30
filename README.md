# Actua — guia d’actuació pas a pas

PWA estàtica (HTML + CSS + JS, sense dependències) amb actuacions policials en forma de llista de passos, cronòmetre de detenció (72 h), calculadora d’alcohol i lectura de drets. Funciona sense connexió.

## Publicar a GitHub Pages
1. Crea un repositori nou i puja-hi tots aquests fitxers.
2. *Settings → Pages → Build and deployment → Deploy from a branch* → branca `main`, carpeta `/ (root)`.
3. Obre `https://<usuari>.github.io/<repositori>/` al mòbil i instal·la-la («Afegeix a la pantalla d’inici»).

## Afegir o editar actuacions
Edita la constant `ACT` a `index.html`: cada actuació té `t` (títol), `s` (subtítol), `refs`, `steps` (parelles `[títol, detall]`) i `avis`.

> Contingut orientatiu. Verifica sempre la normativa vigent i els protocols del teu cos.
