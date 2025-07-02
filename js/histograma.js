function loadGoogleCharts() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.charts) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/charts/loader.js";
    script.async = true;

    script.onload = () => {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(() => {
        resolve(true);
      });
    };

    script.onerror = (error) => {
      console.error("Falha ao carregar Google Charts:", error);
      resolve(false);
    };

    setTimeout(() => {
      if (!window.google || !window.google.charts) {
        console.error("Timeout ao carregar Google Charts");
        resolve(false);
      }
    }, 5000);

    document.head.appendChild(script);
  });
}

function calculateRGBHistogram(imageData) {
  const histogramR = new Array(256).fill(0);
  const histogramG = new Array(256).fill(0);
  const histogramB = new Array(256).fill(0);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    histogramR[data[i]]++;
    histogramG[data[i + 1]]++;
    histogramB[data[i + 2]]++;
  }

  return { r: histogramR, g: histogramG, b: histogramB };
}

function displayRGBHistogram(histograms, elementId, title, chartsAvailable) {
  const element = document.getElementById(elementId);

  if (!element) {
    console.error(`Element with ID '${elementId}' not found!`);
    return;
  }

  element.style.width = "100%";
  element.style.height = "220px";
  element.style.display = "block";

  if (!chartsAvailable) {
    element.innerHTML =
      "<p style='text-align: center; padding-top: 100px;'>Não foi possível carregar os módulos do Google Charts para exibir os gráficos.</p>";
    return;
  }

  const textColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--texto-primario")
    .trim();

  const dataTable = new google.visualization.DataTable();
  dataTable.addColumn("string", "Intensidade");
  dataTable.addColumn("number", "Vermelho");
  dataTable.addColumn("number", "Verde");
  dataTable.addColumn("number", "Azul");

  for (let i = 0; i < 256; i++) {
    dataTable.addRow([
      i.toString(),
      histograms.r[i],
      histograms.g[i],
      histograms.b[i],
    ]);
  }

  const options = {
    title: title,
    height: 220,
    width: "100%",
    series: {
      0: { color: "red" },
      1: { color: "green" },
      2: { color: "blue" },
    },
    legend: { position: "top" },
    chartArea: { width: "85%", height: "70%" },
    backgroundColor: "transparent",
    titleTextStyle: { color: textColor },
    legendTextStyle: { color: textColor },
    hAxis: {
      title: "Valor de Intensidade",
      textStyle: { color: textColor },
      titleTextStyle: { color: textColor },
    },
    vAxis: {
      title: "Frequência",
      textStyle: { color: textColor },
      titleTextStyle: { color: textColor },
    },
  };

  const chart = new google.visualization.LineChart(element);
  chart.draw(dataTable, options);
}

function calculateCDF(histogram) {
  const cdf = new Array(histogram.length).fill(0);
  cdf[0] = histogram[0];

  for (let i = 1; i < histogram.length; i++) {
    cdf[i] = cdf[i - 1] + histogram[i];
  }

  return cdf;
}

function equalizeRGBHistogram(imageData) {
  const histograms = calculateRGBHistogram(imageData);

  const cdfR = calculateCDF(histograms.r);
  const cdfG = calculateCDF(histograms.g);
  const cdfB = calculateCDF(histograms.b);

  let cdfMinR = 0,
    cdfMinG = 0,
    cdfMinB = 0;
  for (let i = 0; i < 256; i++) {
    if (cdfR[i] > 0 && cdfMinR === 0) cdfMinR = cdfR[i];
    if (cdfG[i] > 0 && cdfMinG === 0) cdfMinG = cdfG[i];
    if (cdfB[i] > 0 && cdfMinB === 0) cdfMinB = cdfB[i];
  }

  cdfMinR = cdfMinR || 1;
  cdfMinG = cdfMinG || 1;
  cdfMinB = cdfMinB || 1;

  const totalPixels = imageData.width * imageData.height;
  const L = 256;

  const newImageData = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height,
  );

  const mappingR = new Array(256);
  const mappingG = new Array(256);
  const mappingB = new Array(256);

  for (let i = 0; i < 256; i++) {
    mappingR[i] = Math.floor(
      ((cdfR[i] - cdfMinR) / (totalPixels - cdfMinR)) * (L - 1),
    );
    mappingG[i] = Math.floor(
      ((cdfG[i] - cdfMinG) / (totalPixels - cdfMinG)) * (L - 1),
    );
    mappingB[i] = Math.floor(
      ((cdfB[i] - cdfMinB) / (totalPixels - cdfMinB)) * (L - 1),
    );
  }

  const data = newImageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = mappingR[data[i]];
    data[i + 1] = mappingG[data[i + 1]];
    data[i + 2] = mappingB[data[i + 2]];
  }

  return {
    newImageData: newImageData,
    originalHistogram: histograms,
    equalizedHistogram: calculateRGBHistogram(newImageData),
  };
}

document.addEventListener("DOMContentLoaded", function () {
  const histogramaOriginal = document.getElementById("histogramaOriginal");
  const histogramaEqualizado = document.getElementById("histogramaEqualizado");

  if (histogramaOriginal) {
    histogramaOriginal.style.width = "100%";
    histogramaOriginal.style.height = "220px";
    histogramaOriginal.style.display = "block";
    histogramaOriginal.style.marginBottom = "20px";
    histogramaOriginal.style.transition = "opacity 0.3s ease";
  }

  if (histogramaEqualizado) {
    histogramaEqualizado.style.width = "100%";
    histogramaEqualizado.style.height = "220px";
    histogramaEqualizado.style.display = "block";
    histogramaEqualizado.style.marginBottom = "20px";
    histogramaEqualizado.style.transition = "opacity 0.3s ease";
  }

  let googleChartsAvailable = false;
  const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
  const themeChangeHandler = () => {
    const originalChart = document.getElementById("histogramaOriginal");
    const equalizedChart = document.getElementById("histogramaEqualizado");

    if (originalChart && originalChart.children.length > 0) {
      originalChart.style.transition = "opacity 0.3s ease";
      originalChart.style.opacity = "0";

      setTimeout(() => {
        const histograms =
          window.originalHistograms ||
          calculateRGBHistogram(obterImagem("input-imagem-1"));
        if (histograms) {
          displayRGBHistogram(
            histograms,
            "histogramaOriginal",
            "Histograma da Imagem Original",
            googleChartsAvailable,
          );

          setTimeout(() => {
            originalChart.style.opacity = "1";
          }, 50);
        }
      }, 300);
    }

    if (equalizedChart && equalizedChart.children.length > 0) {
      equalizedChart.style.transition = "opacity 0.3s ease";
      equalizedChart.style.opacity = "0";

      setTimeout(() => {
        const histograms =
          window.equalizedHistograms ||
          calculateRGBHistogram(obterImagem("input-imagem-1"));
        if (histograms) {
          displayRGBHistogram(
            histograms,
            "histogramaEqualizado",
            "Histograma da Imagem Equalizada",
            googleChartsAvailable,
          );

          setTimeout(() => {
            equalizedChart.style.opacity = "1";
          }, 50);
        }
      }, 300);
    }
  };

  mediaQueryList.addEventListener("change", themeChangeHandler);

  loadGoogleCharts()
    .then((chartsLoaded) => {
      googleChartsAvailable = chartsLoaded;

      if (chartsLoaded) {
        console.log("Google Charts carregado com sucesso");
      } else {
        console.warn(
          "Google Charts não pôde ser carregado, usando modo de fallback",
        );
      }

      // Enhanced upload handler that works with current HTML structure
      function enhancedUploadHandler(inputId, previewId) {
        const inputElement = document.getElementById(inputId);
        const previewElement = document.getElementById(previewId);

        if (!inputElement || !previewElement) {
          console.error(`Elementos não encontrados para ${inputId}`);
          return;
        }

        inputElement.addEventListener("change", function (e) {
          const file = e.target.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = function (event) {
            previewElement.src = event.target.result;
            previewElement.style.display = "block";

            const img = new Image();
            img.onload = function () {
              const canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0);
              const imageData = ctx.getImageData(0, 0, img.width, img.height);

              guardarImagem(inputId, imageData);

              // Display the uploaded image on the main canvas
              exibirImagemNoCanvas(imageData, "canvas-output");
              console.log(`Imagem ${inputId} exibida no canvas principal`);

              if (inputId === "input-imagem-1") {
                const histograms = calculateRGBHistogram(imageData);
                window.originalHistograms = histograms;
                displayRGBHistogram(
                  histograms,
                  "histogramaOriginal",
                  "Histograma da Imagem Original",
                  googleChartsAvailable,
                );
              }
            };
            img.src = event.target.result;
          };
          reader.readAsDataURL(file);
        });
      }

      // Override the global upload handler with our enhanced version
      window.tratarUploadImagem = enhancedUploadHandler;

      // Apply the enhanced handler to both image inputs
      enhancedUploadHandler("input-imagem-1", "preview-imagem-1");
      enhancedUploadHandler("input-imagem-2", "preview-imagem-2");

      const equalizationButton = document.getElementById("equlizar-histograma");
      if (equalizationButton) {
        equalizationButton.addEventListener("click", function () {
          const imageData = obterImagem("input-imagem-1");

          if (!imageData) {
            alert("Por favor, carregue uma imagem primeiro.");
            return;
          }

          const result = equalizeRGBHistogram(imageData);

          exibirImagemNoCanvas(result.newImageData, "canvas-output");

          window.originalHistograms = result.originalHistogram;
          window.equalizedHistograms = result.equalizedHistogram;

          displayRGBHistogram(
            result.originalHistogram,
            "histogramaOriginal",
            "Histograma da Imagem Original",
            googleChartsAvailable,
          );
          displayRGBHistogram(
            result.equalizedHistogram,
            "histogramaEqualizado",
            "Histograma da Imagem Equalizada",
            googleChartsAvailable,
          );

          document.getElementById("histogramaOriginal").style.display = "block";
          document.getElementById("histogramaEqualizado").style.display =
            "block";
        });
      } else {
        console.error("Equalization button not found!");
      }
    })
    .catch((error) => {
      console.error("Falha ao carregar Google Charts:", error);
      googleChartsAvailable = false;

      // Enhanced upload handler for fallback mode
      function enhancedUploadHandlerFallback(inputId, previewId) {
        const inputElement = document.getElementById(inputId);
        const previewElement = document.getElementById(previewId);

        if (!inputElement || !previewElement) {
          console.error(`Elementos não encontrados para ${inputId}`);
          return;
        }

        inputElement.addEventListener("change", function (e) {
          const file = e.target.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = function (event) {
            previewElement.src = event.target.result;
            previewElement.style.display = "block";

            const img = new Image();
            img.onload = function () {
              const canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0);
              const imageData = ctx.getImageData(0, 0, img.width, img.height);

              guardarImagem(inputId, imageData);

              // Display the uploaded image on the main canvas
              exibirImagemNoCanvas(imageData, "canvas-output");
              console.log(`Imagem ${inputId} exibida no canvas principal`);

              if (inputId === "input-imagem-1") {
                const histograms = calculateRGBHistogram(imageData);
                window.originalHistograms = histograms;
                displayRGBHistogram(
                  histograms,
                  "histogramaOriginal",
                  "Histograma da Imagem Original",
                  googleChartsAvailable,
                );
              }
            };
            img.src = event.target.result;
          };
          reader.readAsDataURL(file);
        });
      }

      // Override the global upload handler with our enhanced fallback version
      window.tratarUploadImagem = enhancedUploadHandlerFallback;

      enhancedUploadHandlerFallback("input-imagem-1", "preview-imagem-1");
      enhancedUploadHandlerFallback("input-imagem-2", "preview-imagem-2");

      const equalizationButton = document.getElementById("equlizar-histograma");
      if (equalizationButton) {
        equalizationButton.addEventListener("click", function () {
          const imageData = obterImagem("input-imagem-1");

          if (!imageData) {
            alert("Por favor, carregue uma imagem primeiro.");
            return;
          }

          const result = equalizeRGBHistogram(imageData);

          exibirImagemNoCanvas(result.newImageData, "canvas-output");

          window.originalHistograms = result.originalHistogram;
          window.equalizedHistograms = result.equalizedHistogram;

          displayRGBHistogram(
            result.originalHistogram,
            "histogramaOriginal",
            "Histograma da Imagem Original",
            googleChartsAvailable,
          );
          displayRGBHistogram(
            result.equalizedHistogram,
            "histogramaEqualizado",
            "Histograma da Imagem Equalizada",
            googleChartsAvailable,
          );

          document.getElementById("histogramaOriginal").style.display = "block";
          document.getElementById("histogramaEqualizado").style.display =
            "block";
        });
      }
    });
});

window.calculateRGBHistogram = calculateRGBHistogram;
window.displayRGBHistogram = displayRGBHistogram;
window.equalizeRGBHistogram = equalizeRGBHistogram;
