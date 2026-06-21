# Atalho Psicológico — Landing Page

Landing page de alta conversão (nicho reconquista) para a oferta **O Arsenal de 5 Mensagens Curtas** + bônus **O Protocolo da Conversa Infinita**.

Site estático, sem build e sem dependências — `index.html` + `styles.css` + `app.js` + `assets/`. Carrega rápido e é amigável a tracking (Pixel/GA4).

## Estrutura

```
index.html    # página completa
styles.css    # reset, keyframes, regras mobile e estados :hover
app.js        # countdown · barra de escassez · scroll reveal · grid overlay (tecla G)
assets/       # imagens
```

## Rodar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Comportamentos interativos (`app.js`)

- **Countdown** — contagem regressiva mm:ss (15 min por padrão), reinicia ao zerar.
- **Barra de escassez** — começa em 37 vagas e cai até 10 conforme o usuário rola até a oferta.
- **Scroll reveal** — entrada escalonada das seções Dor e Arsenal.
- **Grid overlay** — pressione `G` para sobrepor a grade de 12 colunas (auxílio de layout).
- Respeita `prefers-reduced-motion`.

## Origem

Recriada pixel-a-pixel a partir de um protótipo do [Claude Design](https://claude.ai/design) (`Atalho Psicologico.dc.html`). O framework proprietário do protótipo (`DCLogic`/`x-dc`, templating `{{ }}`, `style-hover`, `dc-import`) foi convertido para HTML/CSS/JS padrão.

---

© Thiago Lins 2026 — Todos os direitos reservados.
