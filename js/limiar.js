document.addEventListener("DOMContentLoaded", function () {
  const botaoLimiar = document.getElementById("limiar");
  botaoLimiar.addEventListener("click", function () {
    const dadosImagem1 = obterImagem("input-imagem-1");
    if (dadosImagem1) {
      const valorLimiar =
        parseFloat(document.getElementById("input-limiar").value) || 1;
      const dadosEscalaCinza = converterParaEscalaCinza(dadosImagem1);
      const dadosProcessados = processarLimiar(dadosEscalaCinza, valorLimiar);

      exibirImagemNoCanvas(dadosProcessados, "canvas-output");
      console.log(
        "Imagem convertida para escala de cinza, limiarizada por " +
          valorLimiar +
          " e exibida no canvas",
      );
    } else {
      alert("Por favor, carregue pelo menos uma imagem.");
    }
  });

  function converterParaEscalaCinza(dadosImagem) {
    const canvas = document.createElement("canvas");
    canvas.width = dadosImagem.width;
    canvas.height = dadosImagem.height;
    const ctx = canvas.getContext("2d");
    ctx.putImageData(dadosImagem, 0, 0);
    const dadosProcessados = ctx.getImageData(
      0,
      0,
      dadosImagem.width,
      dadosImagem.height,
    );
    const dados = dadosProcessados.data;
    for (let i = 0; i < dados.length; i += 4) {
      const r = dados[i];
      const g = dados[i + 1];
      const b = dados[i + 2];
      const cinza = Math.round((r + g + b) / 3);
      dados[i] = cinza;
      dados[i + 1] = cinza;
      dados[i + 2] = cinza;
    }
    return dadosProcessados;
  }

  function processarLimiar(dadosImagem, fatorLimiar) {
    const canvas = document.createElement("canvas");
    canvas.width = dadosImagem.width;
    canvas.height = dadosImagem.height;
    const ctx = canvas.getContext("2d");
    ctx.putImageData(dadosImagem, 0, 0);
    const dadosProcessados = ctx.getImageData(
      0,
      0,
      dadosImagem.width,
      dadosImagem.height,
    );
    const dados = dadosProcessados.data;
    for (let i = 0; i < dados.length; i += 4) {
      let pixel = dados[i];

      if (pixel < fatorLimiar) {
        dados[i] = 0;
        dados[i + 1] = 0;
        dados[i + 2] = 0;
      } else {
        dados[i] = 255;
        dados[i + 1] = 255;
        dados[i + 2] = 255;
      }
    }
    return dadosProcessados;
  }
});
