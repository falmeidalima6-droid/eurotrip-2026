// Upload de fotos para a Área Família via Cloudinary (unsigned upload).
// O Cloudinary gera thumbnail/versão de exibição na hora de mostrar a
// imagem (via parâmetros na própria URL), então só precisamos enviar UMA
// vez — nunca geramos nem armazenamos múltiplas cópias do mesmo arquivo.

const CLOUD_NAME = "tli9xst1";
const UPLOAD_PRESET = "inozswai";

/** Reduz a foto para no máximo 2200px no lado maior antes de enviar,
 * pra economizar tempo/dados no upload pelo 4G. Não mexe no arquivo
 * original do celular — só gera uma cópia temporária em memória. */
async function comprimirImagem(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const maiorLado = Math.max(bitmap.width, bitmap.height);
  const escala = maiorLado > 2200 ? 2200 / maiorLado : 1;
  const largura = Math.round(bitmap.width * escala);
  const altura = Math.round(bitmap.height * escala);

  const canvas = document.createElement("canvas");
  canvas.width = largura;
  canvas.height = altura;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, largura, altura);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob || file), "image/jpeg", 0.85);
  });
}

export async function enviarFotoCloudinary(file: File): Promise<string> {
  const blob = await comprimirImagem(file).catch(() => file);
  const form = new FormData();
  form.append("file", blob, file.name);
  form.append("upload_preset", UPLOAD_PRESET);

  const resposta = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: form,
  });
  if (!resposta.ok) throw new Error("Falha no upload da foto");
  const dados = await resposta.json();
  return dados.secure_url as string;
}

/** Gera a versão em miniatura de uma foto já enviada, alterando a URL
 * (o Cloudinary processa na hora de entregar — não precisa reenviar nada). */
export function urlMiniatura(url: string, largura = 400): string {
  return url.replace("/upload/", `/upload/c_fill,w_${largura},h_${largura},q_auto,f_auto/`);
}

/** Versão otimizada para exibição maior (ex: foto em destaque). */
export function urlExibicao(url: string, largura = 1200): string {
  return url.replace("/upload/", `/upload/c_limit,w_${largura},q_auto,f_auto/`);
}
