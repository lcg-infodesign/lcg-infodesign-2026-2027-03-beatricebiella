let data;

async function setup() {
  createCanvas(windowWidth, windowHeight);

  data = await loadTable("assets/ramen.csv", ",", "header"); //carico il dataset
  //console.log(data.getRowCount());
}

function draw() {
  drawTavola();
  drawTitolo();
  let paesePrecedente = "";
  let numeroCiotola = 0;
  // getRowCount() restituisce il numero di righe;
  for (let rowNumber = 0; rowNumber < data.getRowCount(); rowNumber++) {
    let paese = data.getString(rowNumber, "paese"); // getString legge il paese di questa riga
    if (paese != paesePrecedente) {
      //console.log(paese);
      //colonna: da 0 a 4
      let colonna = numeroCiotola % 5;

      //fila: 0 per le prime 5 ciotole, 1 per le altre
      let fila = 0;
      if (numeroCiotola >= 5) {
        fila = 1;
      }
      // posizione: partenza + numero * distanza
      let x = 140 + colonna * 255;
      let y = 330 + fila * 300;

      //disegno la ciotola
      drawCiotola(x, y, 230);

      //per spostare la ciotola
      numeroCiotola++;

      paesePrecedente = paese;
    }
  }
}

function drawTavola() {
  //tavola di legno vista dall'alto
  background("#8A5A3B");

  stroke("#7A4E33"); //per disegnare le assi faccio 12 linee orizzontali, una ogni 70px
  strokeWeight(2);
  for (let i = 0; i < 12; i++) {
    line(0, i * 70, width, i * 70);
  }
}

//titolo e sottotitolo a sx
function drawTitolo() {
  noStroke();

  fill("#FFF6E6");
  textSize(36);
  text("Una tavola di ramen", 50, 75);

  fill("#F1DCC0");
  textSize(15);
  text("I 10 paesi con più recensioni di ramen istantanei in ciotola", 52, 101);
}

function drawCiotola(x, y, d) {
  //disegno le ciotole
  push();
  translate(x, y);
  noStroke();
  fill("#FFFFFF");
  circle(0, 0, d);
  fill("#2F5D8A");
  circle(0, 0, d - 8);
  fill("#FFFFFF");
  circle(0, 0, d - 16);
  fill("#E8C48C");
  circle(0, 0, d - 24);

  pop();
}
