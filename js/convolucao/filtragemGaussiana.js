document.addEventListener("DOMContentLoaded", function () {
  const botaoGaussiana = document.getElementById("filtragem-gaussiana");

  botaoGaussiana.addEventListener("click", function () {
    const dadosImagem = obterImagem("input-imagem-1");

    if (dadosImagem) {
      const tamanhoFiltro =
        parseInt(document.getElementById("input-filtragem-gaussiana").value) ||
        3;

      if (tamanhoFiltro < 3 || tamanhoFiltro % 2 === 0) {
        alert(
          "O tamanho do filtro deve ser um número ímpar maior ou igual a 3.",
        );
        return;
      }

      const sigmaDivisor =
        parseFloat(document.getElementById("input-sigma").value) || 5;

      if (sigmaDivisor <= 0) {
        alert("O valor do divisor sigma deve ser maior que 0.");
        return;
      }

      const sigma = tamanhoFiltro / sigmaDivisor;

      const dadosProcessados = aplicarFiltroGaussiano(
        dadosImagem,
        tamanhoFiltro,
        sigma,
      );
      exibirImagemNoCanvas(dadosProcessados, "canvas-output");
      console.log(
        `Filtro gaussiano aplicado com tamanho ${tamanhoFiltro} e sigma ${sigma.toFixed(2)}`,
      );

      const kernel = criarKernelGaussiano(tamanhoFiltro, sigma);
      if (window.visualizarKernel) {
        window.visualizarKernel(kernel, tamanhoFiltro, sigma);
      }
    } else {
      alert(
        "Por favor, carregue uma imagem antes de aplicar o filtro gaussiano.",
      );
    }
  });

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

  function aplicarFiltroGaussiano(dadosImagem, tamanhoFiltro, sigma) {
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

    const kernel = criarKernelGaussiano(tamanhoFiltro, sigma);
    const raio = Math.floor(tamanhoFiltro / 2);

    for (let y = 0; y < altura; y++) {
      for (let x = 0; x < largura; x++) {
        for (let c = 0; c < 3; c++) {
          let soma = 0;

          for (let ky = 0; ky < tamanhoFiltro; ky++) {
            for (let kx = 0; kx < tamanhoFiltro; kx++) {
              const nx = x + (kx - raio);
              const ny = y + (ky - raio);

              if (nx >= 0 && nx < largura && ny >= 0 && ny < altura) {
                const indice = (ny * largura + nx) * 4 + c;
                soma += dados[indice] * kernel[ky][kx];
              }
            }
          }

          const indiceResultado = (y * largura + x) * 4 + c;
          dadosResultado[indiceResultado] = Math.round(soma);
        }

        const indiceAlfa = (y * largura + x) * 4 + 3;
        dadosResultado[indiceAlfa] = dados[indiceAlfa];
      }
    }

    return dadosProcessados;
  }
});
