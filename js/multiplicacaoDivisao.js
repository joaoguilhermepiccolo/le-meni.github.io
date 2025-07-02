document.addEventListener("DOMContentLoaded", function () {
  const botaoMultiplicar = document.getElementById("multiplicar");
  const botaoDividir = document.getElementById("dividir");

  botaoMultiplicar.addEventListener("click", function () {
    const dadosImagem1 = obterImagem("input-imagem-1");
    if (dadosImagem1) {
      const valor =
        parseFloat(document.getElementById("input-valor-calculo").value) || 1;

      const dadosProcessados = processarMultiplicacao(dadosImagem1, valor);
      exibirImagemNoCanvas(dadosProcessados, "canvas-output");
      console.log("Imagem multiplicada por " + valor + " e exibida no canvas");
    } else {
      alert("Por favor, carregue pelo menos uma imagem.");
    }
  });

  botaoDividir.addEventListener("click", function () {
    const dadosImagem1 = obterImagem("input-imagem-1");
    if (dadosImagem1) {
      const valor =
        parseFloat(document.getElementById("input-valor-calculo").value) || 1;

      if (valor < 0.01) {
        alert("Por favor, use um valor de divisão maior que 0.01.");
        return;
      }

      const dadosProcessados = processarDivisao(dadosImagem1, valor);
      exibirImagemNoCanvas(dadosProcessados, "canvas-output");
      console.log("Imagem dividida por " + valor + " e exibida no canvas");
    } else {
      alert("Por favor, carregue pelo menos uma imagem.");
    }
  });

  function processarMultiplicacao(dadosImagem, fatorMultiplicacao) {
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
      for (let j = 0; j < 3; j++) {
        let pixel = Math.round(dados[i + j] * fatorMultiplicacao);
        dados[i + j] = Math.min(255, Math.max(0, pixel));
      }
    }

    return dadosProcessados;
  }

  function processarDivisao(dadosImagem, fatorDivisao) {
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
      for (let j = 0; j < 3; j++) {
        let pixel = Math.round(dados[i + j] / fatorDivisao);
        dados[i + j] = Math.min(255, Math.max(0, pixel));
      }
    }

    return dadosProcessados;
  }
});
