document.addEventListener("DOMContentLoaded", function () {
  const botaoAbertura = document.getElementById("abertura");

  botaoAbertura.addEventListener("click", function () {
    const dadosImagem = obterImagem("input-imagem-1");

    if (!dadosImagem) {
      alert("Por favor, carregue uma imagem primeiro.");
      return;
    }

    console.log("Iniciando operação de abertura morfológica");
    const dadosProcessados = processarAbertura(dadosImagem);
    exibirImagemNoCanvas(dadosProcessados, "canvas-output");
    console.log("Operação de abertura concluída e exibida no canvas");
  });

  // Elemento estruturante padrão 3x3 (cruz)
  function obterElementoEstruturante() {
    return [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ];
  }

  // Função de erosão
  function processarErosao(dadosImagem) {
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

    const dados = dadosImagem.data;
    const dadosResultado = dadosProcessados.data;
    const largura = dadosImagem.width;
    const altura = dadosImagem.height;
    const elementoEstruturante = obterElementoEstruturante();
    const tamanho = elementoEstruturante.length;
    const centro = Math.floor(tamanho / 2);

    // Inicializar resultado como preto
    for (let i = 0; i < dadosResultado.length; i += 4) {
      dadosResultado[i] = 0; // R
      dadosResultado[i + 1] = 0; // G
      dadosResultado[i + 2] = 0; // B
      dadosResultado[i + 3] = dados[i + 3]; // A
    }

    // Aplicar erosão
    for (let y = centro; y < altura - centro; y++) {
      for (let x = centro; x < largura - centro; x++) {
        let todosNaoZero = true;

        // Verificar todos os pontos do elemento estruturante
        for (let ey = 0; ey < tamanho; ey++) {
          for (let ex = 0; ex < tamanho; ex++) {
            if (elementoEstruturante[ey][ex] === 1) {
              const py = y - centro + ey;
              const px = x - centro + ex;
              const indice = (py * largura + px) * 4;

              // Converter para escala de cinza para verificação
              const cinza =
                (dados[indice] + dados[indice + 1] + dados[indice + 2]) / 3;

              if (cinza === 0) {
                todosNaoZero = false;
                break;
              }
            }
          }
          if (!todosNaoZero) break;
        }

        // Se todos os pontos sob o elemento estruturante são não-zero, definir como branco
        if (todosNaoZero) {
          const indiceResultado = (y * largura + x) * 4;
          dadosResultado[indiceResultado] = 255; // R
          dadosResultado[indiceResultado + 1] = 255; // G
          dadosResultado[indiceResultado + 2] = 255; // B
        }
      }
    }

    return dadosProcessados;
  }

  // Função de dilatação
  function processarDilatacao(dadosImagem) {
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

    const dados = dadosImagem.data;
    const dadosResultado = dadosProcessados.data;
    const largura = dadosImagem.width;
    const altura = dadosImagem.height;
    const elementoEstruturante = obterElementoEstruturante();
    const tamanho = elementoEstruturante.length;
    const centro = Math.floor(tamanho / 2);

    // Inicializar resultado como preto
    for (let i = 0; i < dadosResultado.length; i += 4) {
      dadosResultado[i] = 0; // R
      dadosResultado[i + 1] = 0; // G
      dadosResultado[i + 2] = 0; // B
      dadosResultado[i + 3] = dados[i + 3]; // A
    }

    // Aplicar dilatação
    for (let y = centro; y < altura - centro; y++) {
      for (let x = centro; x < largura - centro; x++) {
        const indice = (y * largura + x) * 4;

        // Converter para escala de cinza para verificação
        const cinza =
          (dados[indice] + dados[indice + 1] + dados[indice + 2]) / 3;

        // Se o pixel central é diferente de zero, aplicar o elemento estruturante
        if (cinza > 0) {
          for (let ey = 0; ey < tamanho; ey++) {
            for (let ex = 0; ex < tamanho; ex++) {
              if (elementoEstruturante[ey][ex] === 1) {
                const py = y - centro + ey;
                const px = x - centro + ex;

                if (py >= 0 && py < altura && px >= 0 && px < largura) {
                  const indiceResultado = (py * largura + px) * 4;
                  dadosResultado[indiceResultado] = 255; // R
                  dadosResultado[indiceResultado + 1] = 255; // G
                  dadosResultado[indiceResultado + 2] = 255; // B
                }
              }
            }
          }
        }
      }
    }

    return dadosProcessados;
  }

  // Função principal de abertura: Erosão seguida de Dilatação
  function processarAbertura(dadosImagem) {
    console.log("Aplicando erosão...");
    const dadosErodidos = processarErosao(dadosImagem);

    console.log("Aplicando dilatação no resultado da erosão...");
    const dadosAbertos = processarDilatacao(dadosErodidos);

    return dadosAbertos;
  }
});
