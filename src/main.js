import "./style.css";

document.addEventListener("DOMContentLoaded", function () {
  console.log("Script Loaded");
  // console.log("Current path:", window.location.pathname)

  // Highlight the active navigation link
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll("header ul li a");

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.parentElement.classList.add("active");
    }
  });

  // Box selection in designComposition and designFlower
  const compositions = document.querySelectorAll(".composition");
  const flowers = document.querySelectorAll(".flower");

  // Function to handle clicks on composition boxes
  const handleCompositionClick = (event) => {
    console.log("Composition box clicked:", event.target);

    // Clear 'active' from other composition boxes
    compositions.forEach((box) => box.classList.remove("active"));

    // Add 'active' to the clicked box within the composition group
    event.target.closest(".composition").classList.add("active");
  };

  // Function to handle clicks on flower boxes
  const handleFlowerClick = (event) => {
    console.log("Flower box clicked:", event.target);

    // Clear 'active' from other flower boxes
    flowers.forEach((box) => box.classList.remove("active"));

    // Add 'active' to the clicked box within the flower group
    event.target.closest(".flower").classList.add("active");
  };

  // Attach event listeners to compositions and flowers separately
  compositions.forEach((box) => {
    box.addEventListener("click", handleCompositionClick);
  });

  flowers.forEach((box) => {
    box.addEventListener("click", handleFlowerClick);
  });

  // Toggle visibility of catalogueMotifGroup elements
  const catalogueHeaders = document.querySelectorAll(
    ".catalogueMotifClassName"
  );

  catalogueHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      // Toggle the visibility of the next sibling element (catalogueMotifGroup)
      const group = header.nextElementSibling;
      if (group.classList.contains("active")) {
        group.classList.remove("active");
      } else {
        // Hide all groups first
        document
          .querySelectorAll(".catalogueMotifGroup")
          .forEach((grp) => grp.classList.remove("active"));
        group.classList.add("active");
      }
    });
  });

  //DRAWING CANVAS

  // Select the designBox element and the canvas
  var designBox = document.querySelector(".designBox"); // Use querySelector to select by class
  var canvas = document.getElementById("sig-canvas");
  var ctx = canvas.getContext("2d");

  // Set initial background color to white (default)
  var currentBackgroundColor = "#ffffff";

  // Function to set the canvas background to a specific color
  function setCanvasBackground(color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Function to resize the canvas to match designBox's size
  function resizeCanvas() {
    canvas.width = designBox.offsetWidth;
    canvas.height = designBox.offsetHeight;
    setCanvasBackground(currentBackgroundColor);
    console.log("Canvas resized to:", canvas.width, "x", canvas.height);
  }

  // Call resizeCanvas on load to set the initial size
  resizeCanvas();

  // Set default stroke style and width
  ctx.strokeStyle = document.getElementById("strokeColorPicker").value;
  ctx.lineWidth = parseInt(document.getElementById("strokeWidth").value, 10);
  ctx.lineCap = "round";

  // Variables to track the drawing state
  var drawing = false;
  var mousePos = { x: 0, y: 0 };
  var lastPos = mousePos;

  // Set up mouse events for drawing
  canvas.addEventListener(
    "mousedown",
    function (e) {
      drawing = true;
      lastPos = getMousePos(canvas, e);
      console.log("Mouse down", lastPos); // For debugging
    },
    false
  );

  canvas.addEventListener(
    "mouseup",
    function (e) {
      drawing = false;
      console.log("Mouse up"); // For debugging
    },
    false
  );

  canvas.addEventListener(
    "mousemove",
    function (e) {
      mousePos = getMousePos(canvas, e);
      console.log("Mouse move", mousePos); // For debugging
    },
    false
  );

  // Get the position of the mouse relative to the canvas
  function getMousePos(canvasDom, mouseEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - rect.top,
    };
  }

  // Draw to the canvas
  function renderCanvas() {
    if (drawing) {
      ctx.beginPath(); // Begin a new path each time
      ctx.moveTo(lastPos.x, lastPos.y); // Move to the last position
      ctx.lineTo(mousePos.x, mousePos.y); // Draw a line to the current position
      ctx.stroke(); // Render the stroke
      lastPos = mousePos; // Update the last position
      console.log("Drawing..."); // For debugging
    }
  }

  // Animation loop to update the canvas continuously
  (function drawLoop() {
    requestAnimationFrame(drawLoop);
    renderCanvas();
  })();

  // Optionally, you can resize the canvas if the designBox size changes
  window.addEventListener("resize", resizeCanvas);

  // Function to clear the canvas and reset background to default white
  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentBackgroundColor = "#ffffff"; // Reset background color to white
    setCanvasBackground(currentBackgroundColor); // Set background to white
    document.getElementById("bgColorPicker").value = "#ffffff";
  }

  // Save the canvas as an image
  function saveCanvas() {
    var dataUrl = canvas.toDataURL("image/png");
    var link = document.createElement("a");
    link.download = "canvas-image.png";
    link.href = dataUrl;
    link.click();
    console.log("Canvas saved");
  }

  // Set up the button event listeners
  var clearCanvasButton = document.getElementById("clearCanvasButton");
  var saveCanvasButton = document.getElementById("saveCanvasButton");

  clearCanvasButton.addEventListener("click", clearCanvas);
  saveCanvasButton.addEventListener("click", saveCanvas);

  // Handle background color change using the color picker
  var bgColorPicker = document.getElementById("bgColorPicker");
  bgColorPicker.addEventListener("input", function () {
    currentBackgroundColor = bgColorPicker.value; // Update the current background color
    setCanvasBackground(currentBackgroundColor); // Change the canvas background
  });

  // Event listener for stroke color picker
  document
    .getElementById("strokeColorPicker")
    .addEventListener("input", function () {
      ctx.strokeStyle = this.value; // Update stroke color
    });

  // Function to update stroke width and thumb size
  function updateStrokeWidth() {
    const strokeWidthInput = document.getElementById("strokeWidth");
    const value = parseInt(strokeWidthInput.value, 10);
    ctx.lineWidth = value; // Update stroke width

    // Adjust the thumb size based on the stroke width value
    const thumbSize = value; // Use the stroke width value for the thumb size
    strokeWidthInput.style.setProperty("--thumb-size", `${thumbSize}px`);
  }

  // Event listener for stroke width input
  document.getElementById("strokeWidth").addEventListener("input", function () {
    updateStrokeWidth();
  });

  // Initialize thumb size on load
  updateStrokeWidth();

  // Add an event listener for the stroke type picker
  document.getElementById("strokeType").addEventListener("change", function () {
    const strokeType = this.value;

    // Set different attributes for each brush type
    switch (strokeType) {
      case "round":
        ctx.lineCap = "round"; // Circular brush
        ctx.lineJoin = "round";
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset any transformations
        break;

      case "elliptical":
        ctx.lineCap = "round"; // Still round cap, but scale transformation
        ctx.lineJoin = "round";
        ctx.setTransform(1.5, 0, 0, 0.7, 0, 0); // Elliptical scaling (1.5 width, 0.7 height)
        break;

      case "square":
        ctx.lineCap = "butt"; // Square brush, no round edges
        ctx.lineJoin = "miter"; // Sharp corners
        ctx.setTransform(1, 0, 0, 1, 0, 0); // No scaling
        break;

      case "flat":
        ctx.lineCap = "butt"; // Flat brush with sharp ends
        ctx.lineJoin = "miter"; // Sharp corners
        ctx.setTransform(2, 0, 0, 0.5, 0, 0); // Flat scaling (wide and short)
        break;

      default:
        ctx.lineCap = "round"; // Default to round brush
        ctx.lineJoin = "round";
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformation
    }

    console.log("Brush type changed to:", strokeType);
  });
});
