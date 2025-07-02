// We'll use the global functions from erosao.js and expose dilation globally too
window.processarDilatacaoMorfologica = function (dadosImagem) {
  // This will be populated by dilatacao.js
  console.error(
    "Dilatação function not loaded yet. Make sure dilatacao.js is loaded before fechamento.js",
  );
  return dadosImagem;
};

document.addEventListener("DOMContentLoaded", function () {
  const botaoFechamento = document.getElementById("fechamento");

  botaoFechamento.addEventListener("click", function () {
    const dadosImagem = obterImagem("input-imagem-1");

    if (!dadosImagem) {
      alert("Por favor, carregue uma imagem primeiro.");
      return;
    }

    console.log("Iniciando operação de fechamento morfológico");
    const dadosProcessados = processarFechamento(dadosImagem);
    exibirImagemNoCanvas(dadosProcessados, "canvas-output");
    console.log("Operação de fechamento concluída e exibida no canvas");
  });

  // Função principal de fechamento: Dilatação seguida de Erosão
  function processarFechamento(dadosImagem) {
    console.log("Aplicando dilatação usando função de dilatacao.js...");
    const dadosDilatados = window.processarDilatacaoMorfologica(dadosImagem);

    console.log(
      "Aplicando erosão no resultado da dilatação usando função de erosao.js...",
    );
    const dadosFechados = window.processarErosaoMorfologica(dadosDilatados);

    return dadosFechados;
  }
});
