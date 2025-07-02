document.addEventListener("DOMContentLoaded", function () {
  const botaoAdicionarImagens = document.getElementById("adicionarImagens");
  const botaoSubtrairImagens = document.getElementById("subtrairImagens");

  botaoAdicionarImagens.addEventListener("click", function () {
    processarDuasImagens("adicao");
  });
  botaoSubtrairImagens.addEventListener("click", function () {
    processarDuasImagens("diferenca");
  });

  function processarDuasImagens(operacao) {
    const dadosImagem1 = obterImagem("input-imagem-1");
    const dadosImagem2 = obterImagem("input-imagem-2");

    if (dadosImagem1 && dadosImagem2) {
      if (
        dadosImagem1.width !== dadosImagem2.width ||
        dadosImagem1.height !== dadosImagem2.height
      ) {
        verificarResolucoes();
        return;
      }

      let dadosProcessados;
      if (operacao === "adicao") {
        dadosProcessados = processarAdicaoImagens(dadosImagem1, dadosImagem2);
        console.log("Processando adição de duas imagens");
      } else if (operacao === "diferenca") {
        dadosProcessados = processarDiferencaImagens(
          dadosImagem1,
          dadosImagem2,
        );
        console.log("Processando diferença entre duas imagens");
      }

      exibirImagemNoCanvas(dadosProcessados, "canvas-output");
      console.log("Operação entre imagens concluída e exibida no canvas");
    } else {
      alert(
        "Por favor, carregue duas imagens para realizar operações entre elas.",
      );
    }
  }

  function processarAdicaoImagens(dadosImagem1, dadosImagem2) {
    const canvas = document.createElement("canvas");
    canvas.width = dadosImagem1.width;
    canvas.height = dadosImagem1.height;
    const ctx = canvas.getContext("2d");
    ctx.putImageData(dadosImagem1, 0, 0);
    const dadosProcessados = ctx.getImageData(
      0,
      0,
      dadosImagem1.width,
      dadosImagem1.height,
    );
    const dados1 = dadosImagem1.data;
    const dados2 = dadosImagem2.data;
    const dadosResultado = dadosProcessados.data;
    for (let i = 0; i < dados1.length; i += 4) {
      for (let j = 0; j < 3; j++) {
        let novoValor = dados1[i + j] + dados2[i + j];
        dadosResultado[i + j] = Math.min(255, Math.max(0, novoValor));
      }
      dadosResultado[i + 3] = dados1[i + 3]; //preservacao do canal alpha
    }
    return dadosProcessados;
  }

  function processarDiferencaImagens(dadosImagem1, dadosImagem2) {
    const canvas = document.createElement("canvas");
    canvas.width = dadosImagem1.width;
    canvas.height = dadosImagem1.height;
    const ctx = canvas.getContext("2d");
    ctx.putImageData(dadosImagem1, 0, 0);
    const dadosProcessados = ctx.getImageData(
      0,
      0,
      dadosImagem1.width,
      dadosImagem1.height,
    );
    const dados1 = dadosImagem1.data;
    const dados2 = dadosImagem2.data;
    const dadosResultado = dadosProcessados.data;
    for (let i = 0; i < dados1.length; i += 4) {
      for (let j = 0; j < 3; j++) {
        // Calculate absolute difference between pixels
        let novoValor = Math.abs(dados1[i + j] - dados2[i + j]);
        dadosResultado[i + j] = Math.min(255, Math.max(0, novoValor));
      }
      dadosResultado[i + 3] = dados1[i + 3]; //preservacao do canal alpha
    }
    return dadosProcessados;
  }
});
