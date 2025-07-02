document.addEventListener("DOMContentLoaded", function () {
  const canvasKernel = document.getElementById("canvas-kernel");
  const botaoExportarKernel = document.getElementById("exportar-kernel");
  const ctxKernel = canvasKernel.getContext("2d");

  const tamanhoCanvas = 100;
  canvasKernel.width = tamanhoCanvas;
  canvasKernel.height = tamanhoCanvas;

  let kernelAtual = null;
  let tamanhoAtual = 0;
  let sigmaAtual = 0;

  const inputTamanho = document.getElementById("input-filtragem-gaussiana");
  const inputSigma = document.getElementById("input-sigma");

  function criarKernelGaussiano(tamanho, sigma) {
    const kernel = [];
    const raio = Math.floor(tamanho / 2);
    let soma = 0;

    for (let y = -raio; y <= raio; y++) {
      const linha = [];
      for (let x = -raio; x <= raio; x++) {
        const expoente = -(x * x + y * y) / (2 * sigma * sigma);
        const valor = Math.exp(expoente) / (2 * Math.PI * sigma * sigma);
        linha.push(valor);
        soma += valor;
      }
      kernel.push(linha);
    }

    for (let y = 0; y < tamanho; y++) {
      for (let x = 0; x < tamanho; x++) {
        kernel[y][x] /= soma;
      }
    }

    return kernel;
  }

  function atualizarVisualizacao() {
    const tamanhoFiltro = parseInt(inputTamanho.value) || 3;
    const sigmaDivisor = parseFloat(inputSigma.value) || 5;

    if (tamanhoFiltro < 3 || tamanhoFiltro % 2 === 0 || sigmaDivisor <= 0) {
      return;
    }

    const sigma = tamanhoFiltro / sigmaDivisor;
    const kernel = criarKernelGaussiano(tamanhoFiltro, sigma);

    if (window.visualizarKernel) {
      window.visualizarKernel(kernel, tamanhoFiltro, sigma);
    }
  }

  inputTamanho.addEventListener("input", atualizarVisualizacao);
  inputSigma.addEventListener("input", atualizarVisualizacao);

  window.visualizarKernel = function (kernel, tamanho, sigma) {
    kernelAtual = kernel;
    tamanhoAtual = tamanho;
    sigmaAtual = sigma;

    const tamanhoKernel = kernel.length;

    ctxKernel.imageSmoothingEnabled = false;
    ctxKernel.mozImageSmoothingEnabled = false;
    ctxKernel.webkitImageSmoothingEnabled = false;
    ctxKernel.msImageSmoothingEnabled = false;

    ctxKernel.fillStyle = "black";
    ctxKernel.fillRect(0, 0, tamanhoCanvas, tamanhoCanvas);

    const tamanhoCelula = tamanhoCanvas / tamanhoKernel;

    let valorMax = 0;
    let valorMin = Infinity;
    for (let i = 0; i < tamanhoKernel; i++) {
      for (let j = 0; j < tamanhoKernel; j++) {
        valorMax = Math.max(valorMax, kernel[i][j]);
        valorMin = Math.min(valorMin, kernel[i][j]);
      }
    }

    const amplitude = valorMax - valorMin || 1;

    for (let i = 0; i < tamanhoKernel; i++) {
      for (let j = 0; j < tamanhoKernel; j++) {
        const valorNormalizado = (kernel[i][j] - valorMin) / amplitude;
        const intensidade = Math.floor(valorNormalizado * 255);

        ctxKernel.fillStyle = `rgb(${intensidade}, ${intensidade}, ${intensidade})`;
        ctxKernel.fillRect(
          j * tamanhoCelula,
          i * tamanhoCelula,
          tamanhoCelula,
          tamanhoCelula,
        );
      }
    }
  };

  botaoExportarKernel.addEventListener("click", function () {
    if (!kernelAtual) {
      alert(
        "Nenhum kernel para exportar. Ajuste os parâmetros do filtro gaussiano.",
      );
      return;
    }

    const tamanhoKernel = kernelAtual.length;
    const canvasExport = document.createElement("canvas");
    canvasExport.width = tamanhoKernel;
    canvasExport.height = tamanhoKernel;
    const ctxExport = canvasExport.getContext("2d");

    let valorMax = 0;
    let valorMin = Infinity;
    for (let i = 0; i < tamanhoKernel; i++) {
      for (let j = 0; j < tamanhoKernel; j++) {
        valorMax = Math.max(valorMax, kernelAtual[i][j]);
        valorMin = Math.min(valorMin, kernelAtual[i][j]);
      }
    }

    const amplitude = valorMax - valorMin || 1;

    for (let i = 0; i < tamanhoKernel; i++) {
      for (let j = 0; j < tamanhoKernel; j++) {
        const valorNormalizado = (kernelAtual[i][j] - valorMin) / amplitude;
        const intensidade = Math.floor(valorNormalizado * 255);

        ctxExport.fillStyle = `rgb(${intensidade}, ${intensidade}, ${intensidade})`;
        ctxExport.fillRect(j, i, 1, 1);
      }
    }

    canvasExport.toBlob(function (blob) {
      const linkDownload = document.createElement("a");
      linkDownload.href = URL.createObjectURL(blob);
      linkDownload.download = `kernel-tamanho${tamanhoAtual}-sigmaCalculado${sigmaAtual.toFixed(2)}.bmp`;

      document.body.appendChild(linkDownload);
      linkDownload.click();
      document.body.removeChild(linkDownload);
      URL.revokeObjectURL(linkDownload.href);
    }, "image/bmp");
  });

  atualizarVisualizacao();
});
