//o main tem a funcao de tratar as entradas, expo-las aos codigos e renderizar na pagina

let imagensArmazenadas = {};

function guardarImagem(id, dadosImagem) {
  imagensArmazenadas[id] = dadosImagem;
  console.log(
    `Imagem armazenada para ${id}: ${dadosImagem.width}x${dadosImagem.height}`,
  );
  verificarResolucoes();
}

function obterImagem(id) {
  return imagensArmazenadas[id];
}

function removerImagemArmazenada(id) {
  if (imagensArmazenadas[id]) {
    delete imagensArmazenadas[id];
    verificarResolucoes();
    return true;
  }
  return false;
}

//operacoes entre imagens precisam ter o mesmo tamanho, esta funcao confere e avisa quando elas sao de dimensoes diferentes
function verificarResolucoes() {
  const imagem1 = imagensArmazenadas["input-imagem-1"];
  const imagem2 = imagensArmazenadas["input-imagem-2"];

  if (imagem1 && imagem2) {
    if (imagem1.width !== imagem2.width || imagem1.height !== imagem2.height) {
      alert(
        "As imagens têm resoluções diferentes! Por favor, use imagens com as mesmas dimensões.",
      );
      console.log("amogus");
    }
  }
}

function tratarUploadImagem(idInput, idPreview) {
  const elementoInput = document.getElementById(idInput);
  const elementoPreview = document.getElementById(idPreview);

  if (!elementoInput || !elementoPreview) {
    console.error(`Elementos não encontrados para ${idInput}`);
    return;
  }

  elementoInput.addEventListener("change", function (e) {
    const arquivo = e.target.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();

    //exibicao automatica da imagem ao ser feito o upload
    leitor.onload = function (evento) {
      elementoPreview.src = evento.target.result;
      elementoPreview.style.display = "block";

      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const dadosImagem = ctx.getImageData(0, 0, img.width, img.height);

        guardarImagem(idInput, dadosImagem);

        exibirImagemNoCanvas(dadosImagem, "canvas-output");
        console.log(
          `Imagem ${idInput} carregada e exibida no canvas principal`,
        );
      };

      img.src = evento.target.result;
    };

    leitor.readAsDataURL(arquivo);
  });
}

//funcao generica utilizada para exibir a imagem na tela
function exibirImagemNoCanvas(dadosImagem, idCanvas) {
  const canvas = document.getElementById(idCanvas);
  const ctx = canvas.getContext("2d");

  canvas.width = dadosImagem.width;
  canvas.height = dadosImagem.height;

  ctx.putImageData(dadosImagem, 0, 0);
}

document.addEventListener("DOMContentLoaded", function () {
  tratarUploadImagem("input-imagem-1", "preview-imagem-1");
  tratarUploadImagem("input-imagem-2", "preview-imagem-2");
});

//exposicao das funcoes ao escopo global
window.obterImagem = obterImagem;
window.exibirImagemNoCanvas = exibirImagemNoCanvas;
window.tratarUploadImagem = tratarUploadImagem;
