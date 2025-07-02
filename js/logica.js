document.addEventListener("DOMContentLoaded", function () {
  const botaoAnd = document.getElementById("and");
  const botaoOr = document.getElementById("or");
  const botaoNot = document.getElementById("not");
  const botaoNegativo = document.getElementById("negativo");
  const botaoXor = document.getElementById("xor");

  botaoAnd.addEventListener("click", function () {
    processarOperacaoLogica("and");
  });
  botaoOr.addEventListener("click", function () {
    processarOperacaoLogica("or");
  });
  botaoNot.addEventListener("click", function () {
    processarOperacaoLogica("not");
  });
  botaoNegativo.addEventListener("click", function () {
    processarOperacaoLogica("not");
  });
  botaoXor.addEventListener("click", function () {
    processarOperacaoLogica("xor");
  });

  function processarOperacaoLogica(operacao) {
    if (operacao === "not") {
      const dadosImagem1 = obterImagem("input-imagem-1");
      if (dadosImagem1) {
        const dadosProcessados = processarNot(dadosImagem1);
        exibirImagemNoCanvas(dadosProcessados, "canvas-output");
        console.log("Operação NOT concluída e exibida no canvas");
      } else {
        alert("Por favor, carregue pelo menos uma imagem para a operação NOT.");
      }
      return;
    }

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

      switch (operacao) {
        case "and":
          dadosProcessados = processarAnd(dadosImagem1, dadosImagem2);
          console.log("Processando operação AND entre duas imagens");
          break;
        case "or":
          dadosProcessados = processarOr(dadosImagem1, dadosImagem2);
          console.log("Processando operação OR entre duas imagens");
          break;
        case "xor":
          dadosProcessados = processarXor(dadosImagem1, dadosImagem2);
          console.log("Processando operação XOR entre duas imagens");
          break;
      }

      exibirImagemNoCanvas(dadosProcessados, "canvas-output");
      console.log("Operação lógica concluída e exibida no canvas");
    } else {
      alert(
        "Por favor, carregue duas imagens para realizar operações lógicas entre elas.",
      );
    }
  }

  function processarNot(dadosImagem) {
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

    for (let i = 0; i < dados.length; i += 4) {
      for (let j = 0; j < 3; j++) {
        dadosResultado[i + j] = 255 - dados[i + j];
      }
      dadosResultado[i + 3] = dados[i + 3];
    }

    return dadosProcessados;
  }

  function processarAnd(dadosImagem1, dadosImagem2) {
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
        dadosResultado[i + j] = dados1[i + j] & dados2[i + j];
      }
      dadosResultado[i + 3] = dados1[i + 3];
    }

    return dadosProcessados;
  }

  function processarOr(dadosImagem1, dadosImagem2) {
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
        dadosResultado[i + j] = dados1[i + j] | dados2[i + j];
      }
      dadosResultado[i + 3] = dados1[i + 3];
    }

    return dadosProcessados;
  }

  function processarXor(dadosImagem1, dadosImagem2) {
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
        dadosResultado[i + j] = dados1[i + j] ^ dados2[i + j];
      }
      dadosResultado[i + 3] = dados1[i + 3];
    }

    return dadosProcessados;
  }
});
