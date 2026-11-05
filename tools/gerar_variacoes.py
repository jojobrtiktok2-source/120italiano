"""Gera /1, /2, /3 e /4: cópias de index.html que mudam só os links de checkout.

Preencha os links em VARIACOES e rode:
    python tools/gerar_variacoes.py
"""
import os
import re

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Checkouts da página principal (/)
COMPLETO = "https://pay.wiapy.com/4elkccmPqraG"  # Super Oferta R$ 27,00
BASICO = "https://pay.wiapy.com/u00_xMT2QtAs"    # Oferta Básica R$ 16,00

VARIACOES = {
    "1": {"completo": "https://pay.cakto.com.br/bkxhrss_1283823?src=checkout1", "basico": "https://pay.cakto.com.br/3cogsm3?src=checkout1", "pixel": False},
    "2": {"completo": "https://pay.cakto.com.br/bkxhrss_1284071?src=checkout2", "basico": "https://pay.cakto.com.br/3cogsm3_1283903?src=checkout2", "pixel": False},
    "3": {"completo": "https://pay.cakto.com.br/bkxhrss_1284069?src=checkout3", "basico": "https://pay.cakto.com.br/3cogsm3_1283907?src=checkout3", "pixel": False},
    "4": {"completo": COMPLETO, "basico": BASICO, "pixel": False},
    "g": {"completo": "https://pay.cakto.com.br/bkxhrss_1284520", "basico": "https://pay.cakto.com.br/3cogsm3_1284507", "pixel": True},  # Google Ads
}

# Bloco do pixel da UTMify (window.pixelId + pixel.js)
PIXEL = re.compile(r'\n  <script>\s*window\.pixelId = .*?</script>\n', re.S)


def main():
    base = open(os.path.join(RAIZ, "index.html"), encoding="utf-8").read()
    assert base.count(f'href="{COMPLETO}"') == 1 and base.count(f'href="{BASICO}"') == 1

    # arquivos locais passam a apontar um nível acima
    html = re.sub(r'(src|href)="(?!https?:|data:|mailto:|#|/|\.\./)', r'\1="../', base)

    for pasta, links in VARIACOES.items():
        h = html.replace(f'href="{COMPLETO}"', f'href="{links["completo"]}"')
        h = h.replace(f'href="{BASICO}"', f'href="{links["basico"]}"')
        if not links["pixel"]:
            h, n = PIXEL.subn("\n", h)
            assert n == 1 and "pixel.js" not in h
        os.makedirs(os.path.join(RAIZ, pasta), exist_ok=True)
        with open(os.path.join(RAIZ, pasta, "index.html"), "w", encoding="utf-8") as f:
            f.write(h)
        print(f"/{pasta}: completo={links['completo']} basico={links['basico']}")


if __name__ == "__main__":
    main()
