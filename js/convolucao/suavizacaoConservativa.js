document.addEventListener("DOMContentLoaded", function () {
  const botaoSuavizacaoConservativa = document.getElementById(
    "suavizacao-conservativa",
  );

  botaoSuavizacaoConservativa.addEventListener("click", function () {
    const dadosImagem = obterImagem("input-imagem-1");

    if (dadosImagem) {
      const tamanhoVizinhanca =
        parseInt(
          document.getElementById("input-suavizacao-conservativa").value,
        ) || 1;

      if (tamanhoVizinhanca < 1 || tamanhoVizinhanca > 8) {
        alert("O tamanho da vizinhança deve estar entre 1 e 8.");
        return;
      }

      const dadosProcessados = aplicarSuavizacaoConservativa(
        dadosImagem,
        tamanhoVizinhanca,
      );
      exibirImagemNoCanvas(dadosProcessados, "canvas-output");
      console.log(
        "Suavização conservativa aplicada com tamanho de vizinhança " +
          tamanhoVizinhanca,
      );
    } else {
      alert(
        "Por favor, carregue uma imagem antes de aplicar a suavização conservativa.",
      );
    }
  });

  function aplicarSuavizacaoConservativa(dadosImagem, tamanhoVizinhanca) {
    const largura = dadosImagem.width;
    const altura = dadosImagem.height;
    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext("2d");

    ctx.putImageData(dadosImagem, 0, 0);
    const dadosProcessados = ctx.getImageData(0, 0, largura, altura);

    const dados = dadosImagem.data;
    const dadosResultado = dadosProcessados.data;

    const raio = Math.floor(tamanhoVizinhanca / 2);

    for (let y = 0; y < altura; y++) {
      for (let x = 0; x < largura; x++) {
        for (let c = 0; c < 3; c++) {
          const indicePixelCentral = (y * largura + x) * 4 + c;
          const valorPixelCentral = dados[indicePixelCentral];

          let valorMinimo = 255;
          let valorMaximo = 0;

          for (let dy = -raio; dy <= raio; dy++) {
            for (let dx = -raio; dx <= raio; dx++) {
              if (dx === 0 && dy === 0) continue;

              const nx = x + dx;
              const ny = y + dy;

              if (nx >= 0 && nx < largura && ny >= 0 && ny < altura) {
                const indiceVizinho = (ny * largura + nx) * 4 + c;
                const valorVizinho = dados[indiceVizinho];

                valorMinimo = Math.min(valorMinimo, valorVizinho);
                valorMaximo = Math.max(valorMaximo, valorVizinho);
              }
            }
          }

          let novoValor = valorPixelCentral;

          if (valorPixelCentral > valorMaximo) {
            novoValor = valorMaximo;
          } else if (valorPixelCentral < valorMinimo) {
            novoValor = valorMinimo;
          }
          dadosResultado[indicePixelCentral] = novoValor;
        }
        const indiceAlfa = (y * largura + x) * 4 + 3;
        dadosResultado[indiceAlfa] = dados[indiceAlfa];
      }
    }

    return dadosProcessados;
  }
});
