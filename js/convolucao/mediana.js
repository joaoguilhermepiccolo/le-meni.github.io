document.addEventListener("DOMContentLoaded", function () {
  const botaoMediana = document.getElementById("filtro-mediana");

  botaoMediana.addEventListener("click", function () {
    const dadosImagem = obterImagem("input-imagem-1");

    if (dadosImagem) {
      const tamanhoFiltro =
        parseInt(document.getElementById("input-tamanho-filtragem").value) || 3;

      if (tamanhoFiltro < 3 || tamanhoFiltro % 2 === 0) {
        alert(
          "O tamanho do filtro deve ser um número ímpar maior ou igual a 3.",
        );
        return;
      }

      const dadosProcessados = aplicarFiltroMediana(dadosImagem, tamanhoFiltro);
      exibirImagemNoCanvas(dadosProcessados, "canvas-output");
      console.log("Filtro de mediana aplicado com tamanho " + tamanhoFiltro);
    } else {
      alert(
        "Por favor, carregue uma imagem antes de aplicar o filtro de mediana.",
      );
    }
  });

  function aplicarFiltroMediana(dadosImagem, tamanhoFiltro) {
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

    const raio = Math.floor(tamanhoFiltro / 2);

    for (let y = 0; y < altura; y++) {
      for (let x = 0; x < largura; x++) {
        for (let c = 0; c < 3; c++) {
          const vizinhanca = [];

          for (let dy = -raio; dy <= raio; dy++) {
            for (let dx = -raio; dx <= raio; dx++) {
              const nx = x + dx;
              const ny = y + dy;

              if (nx >= 0 && nx < largura && ny >= 0 && ny < altura) {
                const indice = (ny * largura + nx) * 4 + c;
                vizinhanca.push(dados[indice]);
              }
            }
          }

          vizinhanca.sort((a, b) => a - b);
          const posicaoMediana = Math.floor(vizinhanca.length / 2);
          const valorMediana = vizinhanca[posicaoMediana];

          const indiceResultado = (y * largura + x) * 4 + c;
          dadosResultado[indiceResultado] = valorMediana;
        }

        const indiceAlfa = (y * largura + x) * 4 + 3;
        dadosResultado[indiceAlfa] = dados[indiceAlfa];
      }
    }

    return dadosProcessados;
  }
});
