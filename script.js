const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fill-color"),
  sizeSlider = document.querySelector("#size-slider"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color-picker"),
  clearCanvas = document.querySelector(".clear-canvas"),
  saveImg = document.querySelector(".save-img"),
  savePdfBtn = document.querySelector(".save-pdf"),
  shapeSelect = document.querySelector("#shape-select"),
  ctx = canvas.getContext("2d");

let prevMouseX, prevMouseY, snapshot,
  isDrawing = false,
  selectedTool = "brush",
  brushWidth = 5,
  selectedColor = "#000";

const setCanvasBackground = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
}

window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

window.addEventListener("resize", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

const drawRect = (e) => {
  if (!fillColor.checked) {
    return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
  }
  ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
  ctx.beginPath();
  let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawArrow = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  const angle = Math.atan2(e.offsetY - prevMouseY, e.offsetX - prevMouseX);
  const arrowLength = 20;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(
    e.offsetX - arrowLength * Math.cos(angle - Math.PI / 6),
    e.offsetY - arrowLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(e.offsetX, e.offsetY);
  ctx.lineTo(
    e.offsetX - arrowLength * Math.cos(angle + Math.PI / 6),
    e.offsetY - arrowLength * Math.sin(angle + Math.PI / 6)
  );
  fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawHexagon = (e) => {
  ctx.beginPath();
  const sideLength = Math.abs(prevMouseX - e.offsetX);
  ctx.moveTo(prevMouseX + sideLength * Math.cos(0), prevMouseY + sideLength * Math.sin(0));
  for (let i = 1; i <= 6; i++) {
    ctx.lineTo(
      prevMouseX + sideLength * Math.cos(i * 2 * Math.PI / 6),
      prevMouseY + sideLength * Math.sin(i * 2 * Math.PI / 6)
    );
  }
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawParallelogram = (e) => {
  ctx.beginPath();
  const width = Math.abs(prevMouseX - e.offsetX);
  const height = Math.abs(prevMouseY - e.offsetY);
  const tilt = prevMouseY > e.offsetY ? -1 : 1;
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(prevMouseX + width, prevMouseY);
  ctx.lineTo(prevMouseX + width - tilt * height, prevMouseY + height);
  ctx.lineTo(prevMouseX - tilt * height, prevMouseY + height);
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawDiamond = (e) => {
  ctx.beginPath();
  ctx.moveTo((prevMouseX + e.offsetX) / 2, prevMouseY);
  ctx.lineTo(e.offsetX, (prevMouseY + e.offsetY) / 2);
  ctx.lineTo((prevMouseX + e.offsetX) / 2, e.offsetY);
  ctx.lineTo(prevMouseX, (prevMouseY + e.offsetY) / 2);
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawLine = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
}

const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0);

  if (selectedTool === "brush" || selectedTool === "eraser") {
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (selectedTool === "rectangle") {
    drawRect(e);
  } else if (selectedTool === "circle") {
    drawCircle(e);
  } else if (selectedTool === "triangle") {
    drawTriangle(e);
  } else if (selectedTool === "arrow") {
    drawArrow(e);
  } else if (selectedTool === "hexagon") {
    drawHexagon(e);
  } else if (selectedTool === "parallelogram") {
    drawParallelogram(e);
  } else if (selectedTool === "diamond") {
    drawDiamond(e);
  } else if (selectedTool === "line") {
    drawLine(e);
  }
}

shapeSelect.addEventListener("change", () => {
  selectedTool = shapeSelect.value;
  if (selectedTool === "diamond") {
    document.getElementById('fill-color').checked = true;
  }
});

toolBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
  });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);

colorBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
  });
});

colorPicker.addEventListener("change", () => {
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
});

saveImg.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});

savePdfBtn.addEventListener("click", () => {
  html2canvas(canvas).then((canvasImg) => {
    let imgData = canvasImg.toDataURL('image/png');
    let pdf = {
      content: [{
        image: imgData,
        width: 500
      }]
    };
    pdfMake.createPdf(pdf).download("canvas.pdf");
  });
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);
