/* eslint-disable @typescript-eslint/no-require-imports */
// Roda depois do `next build` (export estático em /out).
// Lista todos os arquivos gerados e grava em out/precache-manifest.json,
// para o service worker (public/sw.js) pré-cachear tudo e o app funcionar
// 100% offline depois do primeiro carregamento.
//
// (O número de versão do Service Worker é gerado ANTES do build, por
// scripts/prebuild-sw.js — veja lá se quiser mexer nisso.)
const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "out");

function listarArquivos(dir, base = "") {
  let resultado = [];
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.posix.join(base, entrada.name);
    const abs = path.join(dir, entrada.name);
    if (entrada.isDirectory()) {
      resultado = resultado.concat(listarArquivos(abs, rel));
    } else {
      resultado.push("/" + rel);
    }
  }
  return resultado;
}

const arquivos = listarArquivos(OUT_DIR).filter(
  (f) => !f.endsWith("/sw.js") && !f.endsWith("/precache-manifest.json")
);

fs.writeFileSync(path.join(OUT_DIR, "precache-manifest.json"), JSON.stringify(arquivos));
console.log(`precache-manifest.json gerado com ${arquivos.length} arquivos.`);
