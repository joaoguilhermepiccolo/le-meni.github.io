document.addEventListener("DOMContentLoaded", function () {
  const botaoInverterHorizontal = document.getElementById("inverterHorizontal");
  const botaoInverterVertical = document.getElementById("inverterVertical");
  const botaoMirror = document.getElementById("mirror");
  const botaoReset = document.getElementById("reset");

  botaoInverterHorizontal.addEventListener("click", function () {
    const dadosImagem = obterImagem("input-imagem-1");

    if (dadosImagem) {
      const dadosProcessados = inverterHorizontalmente(dadosImagem);
      exibirImagemNoCanvas(dadosProcessados, "canvas-output");
      console.log("Imagem invertida horizontalmente e exibida no canvas");
    } else {
      alert(
        "Por favor, carregue uma imagem antes de aplicar a inversão horizontal.",
      );
    }
  });

  botaoInverterVertical.addEventListener("click", function () {
    const dadosImagem = obterImagem("input-imagem-1");

    if (dadosImagem) {
      const dadosProcessados = inverterVerticalmente(dadosImagem);
      exibirImagemNoCanvas(dadosProcessados, "canvas-output");
      console.log("Imagem invertida verticalmente e exibida no canvas");
    } else {
      alert(
        "Por favor, carregue uma imagem antes de aplicar a inversão vertical.",
      );
    }
  });

  botaoMirror.addEventListener("click", function () {
    const dadosImagem = obterImagem("input-imagem-1");

    if (dadosImagem) {
      const dadosProcessados = aplicarMirror(dadosImagem);
      exibirImagemNoCanvas(dadosProcessados, "canvas-output");
      console.log(
        "Imagem espelhada (invertida horizontal e verticalmente) e exibida no canvas",
      );
    } else {
      alert("Por favor, carregue uma imagem antes de aplicar o espelhamento.");
    }
  });

  botaoReset.addEventListener("click", function () {
    const dadosImagem = obterImagem("input-imagem-1");

    if (dadosImagem) {
      exibirImagemNoCanvas(dadosImagem, "canvas-output");
      console.log("Imagem restaurada para orientação original");
    } else {
      alert(
        "Por favor, carregue uma imagem antes de aplicar o para a orientação original.",
      );
    }
  });

  function inverterHorizontalmente(dadosImagem) {
    const largura = dadosImagem.width;
    const altura = dadosImagem.height;
    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext("2d");

    const dadosProcessados = ctx.createImageData(largura, altura);
    const dadosOriginal = dadosImagem.data;
    const dadosResultado = dadosProcessados.data;

    for (let y = 0; y < altura; y++) {
      for (let x = 0; x < largura; x++) {
        const posOriginal = (y * largura + x) * 4;
        const posInvertida = (y * largura + (largura - 1 - x)) * 4;

        dadosResultado[posInvertida] = dadosOriginal[posOriginal]; // R
        dadosResultado[posInvertida + 1] = dadosOriginal[posOriginal + 1]; // G
        dadosResultado[posInvertida + 2] = dadosOriginal[posOriginal + 2]; // B
        dadosResultado[posInvertida + 3] = dadosOriginal[posOriginal + 3]; // A
      }
    }

    return dadosProcessados;
  }

  function inverterVerticalmente(dadosImagem) {
    const largura = dadosImagem.width;
    const altura = dadosImagem.height;
    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext("2d");

    const dadosProcessados = ctx.createImageData(largura, altura);
    const dadosOriginal = dadosImagem.data;
    const dadosResultado = dadosProcessados.data;

    for (let y = 0; y < altura; y++) {
      for (let x = 0; x < largura; x++) {
        const posOriginal = (y * largura + x) * 4;

        const posInvertida = ((altura - 1 - y) * largura + x) * 4;

        dadosResultado[posInvertida] = dadosOriginal[posOriginal]; // R
        dadosResultado[posInvertida + 1] = dadosOriginal[posOriginal + 1]; // G
        dadosResultado[posInvertida + 2] = dadosOriginal[posOriginal + 2]; // B
        dadosResultado[posInvertida + 3] = dadosOriginal[posOriginal + 3]; // A
      }
    }

    return dadosProcessados;
  }

  function aplicarMirror(dadosImagem) {
    const largura = dadosImagem.width;
    const altura = dadosImagem.height;
    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext("2d");

    const dadosProcessados = ctx.createImageData(largura, altura);
    const dadosOriginal = dadosImagem.data;
    const dadosResultado = dadosProcessados.data;

    for (let y = 0; y < altura; y++) {
      for (let x = 0; x < largura; x++) {
        const posOriginal = (y * largura + x) * 4;

        const novoX = largura - 1 - x;
        const novoY = altura - 1 - y;
        const posMirror = (novoY * largura + novoX) * 4;

        dadosResultado[posMirror] = dadosOriginal[posOriginal]; // R
        dadosResultado[posMirror + 1] = dadosOriginal[posOriginal + 1]; // G
        dadosResultado[posMirror + 2] = dadosOriginal[posOriginal + 2]; // B
        dadosResultado[posMirror + 3] = dadosOriginal[posOriginal + 3]; // A
      }
    }

    return dadosProcessados;
  }
});
