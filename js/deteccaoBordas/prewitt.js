document.addEventListener("DOMContentLoaded", function () {
  const botaoPrewitt = document.getElementById("prewitt");

  botaoPrewitt.addEventListener("click", function () {
    const dadosImagem = obterImagem("input-imagem-1");

    if (dadosImagem) {
      const dadosEscalaCinza = converterParaEscalaCinza(dadosImagem);
      const dadosProcessados = aplicarPrewitt(dadosEscalaCinza);
      exibirImagemNoCanvas(dadosProcessados, "canvas-output");
      console.log("Detecção de bordas Prewitt aplicada");
    } else {
      alert(
        "Por favor, carregue uma imagem antes de aplicar a detecção de bordas.",
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

  function aplicarPrewitt(dadosImagem) {
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

    const kernelX = [
      [-1, 0, 1],
      [-1, 0, 1],
      [-1, 0, 1],
    ];

    const kernelY = [
      [-1, -1, -1],
      [0, 0, 0],
      [1, 1, 1],
    ];

    for (let y = 1; y < altura - 1; y++) {
      for (let x = 1; x < largura - 1; x++) {
        let gx = 0;
        let gy = 0;

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const indice = ((y + ky) * largura + (x + kx)) * 4;
            const valorPixel = dados[indice];

            gx += valorPixel * kernelX[ky + 1][kx + 1];
            gy += valorPixel * kernelY[ky + 1][kx + 1];
          }
        }

        const magnitude = Math.min(255, Math.abs(gx) + Math.abs(gy));

        const indiceResultado = (y * largura + x) * 4;
        dadosResultado[indiceResultado] = magnitude;
        dadosResultado[indiceResultado + 1] = magnitude;
        dadosResultado[indiceResultado + 2] = magnitude;
        dadosResultado[indiceResultado + 3] = 255;
      }
    }

    for (let x = 0; x < largura; x++) {
      const indiceTop = x * 4;
      const indiceBottom = ((altura - 1) * largura + x) * 4;
      for (let i = 0; i < 3; i++) {
        dadosResultado[indiceTop + i] = 0;
        dadosResultado[indiceBottom + i] = 0;
      }
    }

    for (let y = 0; y < altura; y++) {
      const indiceLeft = y * largura * 4;
      const indiceRight = (y * largura + (largura - 1)) * 4;
      for (let i = 0; i < 3; i++) {
        dadosResultado[indiceLeft + i] = 0;
        dadosResultado[indiceRight + i] = 0;
      }
    }

    return dadosProcessados;
  }
});
