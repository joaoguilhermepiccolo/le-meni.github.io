document.addEventListener("DOMContentLoaded", function () {
  const botaoExportarImg = document.getElementById("exportarImg");
  botaoExportarImg.addEventListener("click", function () {
    const canvas = document.getElementById("canvas-output");

    if (
      canvas.width === 400 &&
      canvas.height === 300 &&
      !temConteudoNoCanvas(canvas)
    ) {
      alert(
        "Não há imagem processada para exportar. Por favor, processe uma imagem primeiro.",
      );
      return;
    } //muito provavelmente a pior forma possível de checar se existe uma imagem mas blz - FUNCIONA

    const dataURL = canvas.toDataURL("image/png");
    const linkDownload = document.createElement("a");
    linkDownload.href = dataURL;
    const dataAtual = new Date();
    const nomeArquivo = `imagem_processada_${dataAtual.getFullYear()}${(dataAtual.getMonth() + 1).toString().padStart(2, "0")}${dataAtual.getDate().toString().padStart(2, "0")}_${dataAtual.getHours().toString().padStart(2, "0")}${dataAtual.getMinutes().toString().padStart(2, "0")}${dataAtual.getSeconds().toString().padStart(2, "0")}.png`;
    linkDownload.download = nomeArquivo;

    document.body.appendChild(linkDownload);
    linkDownload.click();
    document.body.removeChild(linkDownload);
  });

  function temConteudoNoCanvas(canvas) {
    const ctx = canvas.getContext("2d");
    const dadosImagem = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const dados = dadosImagem.data;

    for (let i = 3; i < dados.length; i += 4) {
      if (dados[i] > 0) {
        return true;
      }
    }

    return false;
  }
});
