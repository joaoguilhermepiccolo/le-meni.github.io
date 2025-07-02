document.addEventListener("DOMContentLoaded", function () {
  const botaoAplicarOrdem = document.getElementById("aplicar-ordem");

  botaoAplicarOrdem.addEventListener("click", function () {
    const dadosImagem = obterImagem("input-imagem-1");

    if (dadosImagem) {
      const ordem = parseInt(document.getElementById("input-ordem").value) || 1;
      const tamanhoJanela = 3;

      const dadosProcessados = aplicarFiltroOrdem(
        dadosImagem,
        ordem,
        tamanhoJanela,
      );
      exibirImagemNoCanvas(dadosProcessados, "canvas-output");
      console.log("Filtro de ordem aplicado com ordem " + ordem);
    } else {
      alert(
        "Por favor, carregue uma imagem antes de aplicar o filtro de ordem.",
      );
    }
  });

  function aplicarFiltroOrdem(dadosImagem, ordem, tamanhoJanela) {
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

    const raio = Math.floor(tamanhoJanela / 2);

    const totalPixelsJanela = tamanhoJanela * tamanhoJanela;

    if (ordem < 1 || ordem > totalPixelsJanela) {
      alert("A ordem deve estar entre 1 e " + totalPixelsJanela);
      return dadosImagem;
    }

    for (let y = 0; y < altura; y++) {
      for (let x = 0; x < largura; x++) {
        for (let c = 0; c < 3; c++) {
          const valores = [];
          for (let dy = -raio; dy <= raio; dy++) {
            for (let dx = -raio; dx <= raio; dx++) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < largura && ny >= 0 && ny < altura) {
                const indice = (ny * largura + nx) * 4 + c;
                valores.push(dados[indice]);
              }
            }
          }
          valores.sort((a, b) => a - b);
          const indiceResultado = (y * largura + x) * 4 + c;
          dadosResultado[indiceResultado] = valores[ordem - 1];
        }
        const indiceAlfa = (y * largura + x) * 4 + 3;
        dadosResultado[indiceAlfa] = dados[indiceAlfa];
      }
    }

    return dadosProcessados;
  }
});
