/* eslint-disable @typescript-eslint/no-require-imports */
// Roda depois do `next build` (export estático em /out).
// Lista todos os arquivos gerados e grava em out/precache-manifest.json,
// para o service worker (public/sw.js) pré-cachear tudo e o app funcionar
// 100% offline depois do primeiro carregamento. Também injeta um número de
// versão único no service worker, para que o navegador sempre perceba
// quando existe uma atualização nova e busque tudo de novo sozinho.
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

// Escreve com fsync explícito — garante que o conteúdo realmente chegou no
// disco antes de seguir, em vez de confiar só no cache de escrita do SO.
function escreverComSync(caminho, conteudo) {
  const fd = fs.openSync(caminho, "w");
  try {
    fs.writeSync(fd, conteudo);
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
}

const arquivos = listarArquivos(OUT_DIR).filter(
  (f) => !f.endsWith("/sw.js") && !f.endsWith("/precache-manifest.json")
);

escreverComSync(path.join(OUT_DIR, "precache-manifest.json"), JSON.stringify(arquivos));
console.log(`precache-manifest.json gerado com ${arquivos.length} arquivos.`);

const versao = `eurotrip-${Date.now()}`;
const swPath = path.join(OUT_DIR, "sw.js");
const swConteudo = fs.readFileSync(swPath, "utf-8");

if (!swConteudo.includes("__BUILD_VERSION__")) {
  console.error("⚠️ Placeholder __BUILD_VERSION__ não encontrado em sw.js — versão não foi injetada.");
  process.exitCode = 1;
} else {
  escreverComSync(swPath, swConteudo.replace("__BUILD_VERSION__", versao));
  const confirmacao = fs.readFileSync(swPath, "utf-8");
  if (confirmacao.includes(versao)) {
    console.log(`sw.js atualizado com a versão: ${versao}`);
  } else {
    console.error("⚠️ Não foi possível confirmar a atualização de versão do sw.js.");
    process.exitCode = 1;
  }
}
