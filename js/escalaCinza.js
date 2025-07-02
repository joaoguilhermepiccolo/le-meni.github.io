document.addEventListener("DOMContentLoaded", function () {
  const botaoConverterEscalaCinza = document.getElementById(
    "converterEscalaCinza",
  );
  botaoConverterEscalaCinza.addEventListener("click", function () {
    const dadosImagem = obterImagem("input-imagem-1");

    if (dadosImagem) {
      const dadosProcessados = converterParaEscalaCinza(dadosImagem);
      exibirImagemNoCanvas(dadosProcessados, "canvas-output");
      console.log("Imagem convertida para escala de cinza e exibida no canvas");
    } else {
      alert(
        "Por favor, carregue uma imagem antes de aplicar a escala de cinza.",
      );
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
});
