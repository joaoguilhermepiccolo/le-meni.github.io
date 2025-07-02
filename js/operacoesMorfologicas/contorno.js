// Expose the erosion function globally so it can be reused
window.processarErosaoMorfologica = function (dadosImagem) {
  // This will be populated by erosao.js
  console.error(
    "Erosão function not loaded yet. Make sure erosao.js is loaded before contorno.js",
  );
  return dadosImagem;
};

document.addEventListener("DOMContentLoaded", function () {
  const botaoContorno = document.getElementById("contorno");

  botaoContorno.addEventListener("click", function () {
    const dadosImagem = obterImagem("input-imagem-1");

    if (!dadosImagem) {
      alert("Por favor, carregue uma imagem primeiro.");
      return;
    }

    console.log("Iniciando operação de extração de contorno");
    const dadosProcessados = processarContorno(dadosImagem);
    exibirImagemNoCanvas(dadosProcessados, "canvas-output");
    console.log("Operação de contorno concluída e exibida no canvas");
  });

  // Função principal de contorno: Imagem Original - Erosão
  function processarContorno(dadosImagem) {
    console.log("Aplicando erosão usando função de erosao.js...");

    // Use the exact same erosion function from erosao.js
    const dadosErodidos = window.processarErosaoMorfologica(dadosImagem);

    console.log("Subtraindo imagem erodida da original...");

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

    const dadosOriginais = dadosImagem.data;
    const dadosErosao = dadosErodidos.data;
    const dadosResultado = dadosProcessados.data;

    // Contorno = Original - Erosão (morfológica)
    for (let i = 0; i < dadosOriginais.length; i += 4) {
      // Converter pixels para valores binários (0 ou 255)
      const originalBinario =
        (dadosOriginais[i] + dadosOriginais[i + 1] + dadosOriginais[i + 2]) /
          3 >
        127
          ? 255
          : 0;
      const erodidoBinario =
        (dadosErosao[i] + dadosErosao[i + 1] + dadosErosao[i + 2]) / 3 > 127
          ? 255
          : 0;

      // Subtração morfológica: Original AND NOT Erodido
      // Se pixel existe no original (255) mas não existe no erodido (0), então é contorno (255)
      let resultado = 0;
      if (originalBinario === 255 && erodidoBinario === 0) {
        resultado = 255;
      }

      dadosResultado[i] = resultado; // R
      dadosResultado[i + 1] = resultado; // G
      dadosResultado[i + 2] = resultado; // B
      dadosResultado[i + 3] = dadosOriginais[i + 3]; // A (manter transparência original)
    }

    return dadosProcessados;
  }
});
