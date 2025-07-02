document.addEventListener("DOMContentLoaded", function () {
  const botaoBlend = document.getElementById("blend");

  botaoBlend.addEventListener("click", function () {
    const imagem1 = obterImagem("input-imagem-1");
    const imagem2 = obterImagem("input-imagem-2");
    const c = parseFloat(document.getElementById("blending-valor").value);

    if (!imagem1 || !imagem2) {
      alert("Por favor, carregue duas imagens para aplicar o blending.");
      return;
    }

    if (isNaN(c) || c < 0 || c > 1) {
      alert("O valor de blending deve estar entre 0 e 1.");
      return;
    }

    const resultado = aplicarBlending(imagem1, imagem2, c);
    exibirImagemNoCanvas(resultado, "canvas-output");
    console.log("Blending aplicado com C =", c);
  });

  function aplicarBlending(img1, img2, c) {
    const width = img1.width;
    const height = img1.height;

    if (img2.width !== width || img2.height !== height) {
      verificarResolucoes();
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    const blended = ctx.createImageData(width, height);
    const data1 = img1.data;
    const data2 = img2.data;
    const result = blended.data;

    for (let i = 0; i < data1.length; i += 4) {
      for (let j = 0; j < 3; j++) {
        result[i + j] = Math.round(c * data1[i + j] + (1 - c) * data2[i + j]);
      }
      result[i + 3] = 255; // Alpha
    }

    return blended;
  }
});
