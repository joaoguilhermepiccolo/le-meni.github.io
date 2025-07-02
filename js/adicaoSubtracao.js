document.addEventListener("DOMContentLoaded", function () {
  const botaoAdicionarBrilho = document.getElementById("adicionarBrilho");
  const botaoSubtrairBrilho = document.getElementById("subtrairBrilho");

  botaoAdicionarBrilho.addEventListener("click", function () {
    const dadosImagem1 = obterImagem("input-imagem-1");
    if (dadosImagem1) {
      const valor =
        parseInt(document.getElementById("input-valor-calculo").value) || 0;
      const dadosProcessados = processarAdicaoSubtracao(dadosImagem1, valor, 0);
      exibirImagemNoCanvas(dadosProcessados, "canvas-output");
      console.log("Brilho adicionado e imagem exibida no canvas");
    } else {
      alert("Por favor, carregue pelo menos uma imagem.");
    }
  });

  botaoSubtrairBrilho.addEventListener("click", function () {
    const dadosImagem1 = obterImagem("input-imagem-1");
    if (dadosImagem1) {
      const valor =
        parseInt(document.getElementById("input-valor-calculo").value) || 0;
      const dadosProcessados = processarAdicaoSubtracao(dadosImagem1, 0, valor);
      exibirImagemNoCanvas(dadosProcessados, "canvas-output");
      console.log("Brilho subtraído e imagem exibida no canvas");
    } else {
      alert("Por favor, carregue pelo menos uma imagem.");
    }
  });

  function processarAdicaoSubtracao(dadosImagem, adicao, subtracao) {
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
        let pixel = dados[i + j];
        pixel = pixel + adicao - subtracao;
        dados[i + j] = Math.min(255, Math.max(0, pixel));
      }
    }
    return dadosProcessados;
  }
});
