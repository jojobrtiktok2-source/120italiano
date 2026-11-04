(function () {
  var reduzir = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Botões de CTA e cards de bônus rolam até a oferta completa
  function irParaOferta() {
    var el = document.getElementById("popular-card");
    if (el) el.scrollIntoView({ behavior: reduzir ? "auto" : "smooth", block: "start" });
  }
  document.querySelectorAll("button.animate-pulse-cta, #root section button.group").forEach(function (b) {
    b.addEventListener("click", irParaOferta);
  });

  // Checkout recebe os parâmetros da URL (utm, fbclid...)
  var busca = window.location.search.replace(/^\?/, "");
  if (busca) {
    document.querySelectorAll('a[href*="pay.wiapy.com"]').forEach(function (a) {
      a.href = a.href + (a.href.indexOf("?") >= 0 ? "&" : "?") + busca;
    });
  }

  // Carrossel de amostras do livro + página ampliada
  var amostras = document.querySelector('[aria-label="Amostras do livro digital"]');
  var dialogo = document.querySelector("dialog.book-dialog");
  if (amostras) {
    var passo = function (dir) {
      var b = amostras.querySelector("button");
      amostras.scrollBy({ left: dir * ((b ? b.offsetWidth : 300) + 12), behavior: "smooth" });
    };
    var ant = document.querySelector('[aria-label="Receita anterior"]');
    var prox = document.querySelector('[aria-label="Próxima receita"]');
    if (ant) ant.addEventListener("click", function () { passo(-1); });
    if (prox) prox.addEventListener("click", function () { passo(1); });

    if (dialogo) {
      var overflowAntes = "";
      var fechar = dialogo.querySelector("button");
      amostras.querySelectorAll("button").forEach(function (b) {
        b.addEventListener("click", function () {
          var mini = b.querySelector("img");
          var nome = (b.getAttribute("aria-label") || "").replace(/^Ampliar receita:\s*/, "");
          var img = dialogo.querySelector("img");
          if (!img) { img = document.createElement("img"); dialogo.appendChild(img); }
          img.src = mini.getAttribute("src");
          img.alt = "Receita completa de " + nome;
          dialogo.setAttribute("aria-label", "Página ampliada: " + nome);
          overflowAntes = document.body.style.overflow;
          document.body.style.overflow = "hidden";
          if (dialogo.showModal) dialogo.showModal(); else dialogo.setAttribute("open", "");
          if (fechar) fechar.focus();
        });
      });
      var fecharDialogo = function () { if (dialogo.close) dialogo.close(); else dialogo.removeAttribute("open"); };
      if (fechar) fechar.addEventListener("click", fecharDialogo);
      dialogo.addEventListener("click", function (e) { if (e.target === dialogo) fecharDialogo(); });
      dialogo.addEventListener("close", function () {
        document.body.style.overflow = overflowAntes;
        var img = dialogo.querySelector("img");
        if (img) img.remove();
      });
    }
  }

  // Carrossel de depoimentos: setas e arrastar com o mouse
  var antDep = document.querySelector('[aria-label="Ver depoimento anterior"]');
  var trilho = antDep && antDep.parentElement.querySelector(".no-scrollbar");
  if (trilho) {
    var passoDep = function (dir) {
      var img = trilho.querySelector("img");
      trilho.scrollBy({ left: dir * ((img ? img.clientWidth : 300) + 16), behavior: "smooth" });
    };
    antDep.addEventListener("click", function () { passoDep(-1); });
    var proxDep = document.querySelector('[aria-label="Ver próximo depoimento"]');
    if (proxDep) proxDep.addEventListener("click", function () { passoDep(1); });

    var arraste = { ativo: false, x: 0, scroll: 0 };
    trilho.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse") return;
      arraste = { ativo: true, x: e.clientX, scroll: trilho.scrollLeft };
      trilho.setPointerCapture(e.pointerId);
    });
    trilho.addEventListener("pointermove", function (e) {
      if (!arraste.ativo) return;
      e.preventDefault();
      trilho.scrollLeft = arraste.scroll - (e.clientX - arraste.x);
    });
    var soltar = function (e) {
      if (!arraste.ativo) return;
      arraste.ativo = false;
      if (trilho.hasPointerCapture(e.pointerId)) trilho.releasePointerCapture(e.pointerId);
    };
    trilho.addEventListener("pointerup", soltar);
    trilho.addEventListener("pointercancel", soltar);
  }
})();
