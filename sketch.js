let data;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  data = await loadTable("assets/ramen.csv", ",", "header"); //carico il dataset
  //console.log(data.getRowCount());
}

function draw() {
  drawTavola();
  drawTitolo();
  let paesePrecedente = "";
  let numeroCiotola = 0;

  //ciotola riempita
  let xCiotola = 0;
  let yCiotola = 0;
  let dCiotola = 0;

  //per mettere le uova in cerchi
  let cerchio = 0; //in che cerchio sono
  let posizione = 0; //a che posto sono nel cerchio
  let posti = 1; //quante uova nel cerchio

  let label = ""; //il paese su cui si trova il mouse("" = nessuno)
  let numeroRamen = 0; //quanti ramen ha il paese su cui c'è il mouse

  //getRowCount() restituisce il numero di righe;
  for (let rowNumber = 0; rowNumber < data.getRowCount(); rowNumber++) {
    let paese = data.getString(rowNumber, "paese"); //getString legge il paese di questa riga
    if (paese != paesePrecedente) {
      //colonna: da 0 a 4
      let colonna = numeroCiotola % 5;

      //fila: 0 per le prime 5 ciotole, 1 per le altre
      let fila = 0;
      if (numeroCiotola >= 5) {
        fila = 1;
      }

      //lo spazio di ogni ciotola dipende dalla finestra
      //tolgo 300 px a destra per il menù e 200 px in alto per il titolo
      let distanzaX = (width - 300) / 5; //5 ciotole per fila
      let distanzaY = (height - 200) / 2; //2 file

      //posizione: partenza + numero * distanza
      let x = distanzaX / 2 + colonna * distanzaX;
      let y = 200 + distanzaY / 2 + fila * distanzaY;

      //grandezza: l'80% dello spazio, così resta un margine tra le ciotole
      let d = distanzaX * 0.8;
      if (d > distanzaY * 0.8) {
        d = distanzaY * 0.8;
      }

      //disegno la ciotola
      drawCiotola(x, y, d);

      //queste condizioni indicano che il mouse è dentro il quadrato intorno alla ciotola
      if (
        mouseX >= x - d / 2 &&
        mouseX <= x + d / 2 &&
        mouseY >= y - d / 2 &&
        mouseY <= y + d / 2
      ) {
        label = paese;
      }

      //ricorda questa ciotola e riparte dal centro
      xCiotola = x;
      yCiotola = y;
      dCiotola = d;
      cerchio = 0;
      posizione = 0;
      posti = 1;

      //per spostare la ciotola
      numeroCiotola++;

      paesePrecedente = paese;
    }

    //se questa riga è del paese su cui c'è il mouse, la conto
    if (paese == label) {
      numeroRamen++;
    }

    //ogni riga è un uovo, che viene messo al suo posto nel cerchio,
    //per farle sembrare in disordine, ogni uovo si sposta un pochino avanti o indietro:
    //rowNumber % 3 vale 0, 1 o 2, quindi lo spostamento è -1, 0 o +1 (sempre uguale per lo stesso uovo)
    let sposta = (rowNumber % 3) - 1;

    push();
    translate(xCiotola, yCiotola); //vado al centro della ciotola
    rotate((posizione * 360) / posti + cerchio * 50); //giro verso il suo posto (ogni cerchio parte da un punto diverso)
    translate((cerchio * 0.066 + sposta * 0.008) * dCiotola, 0); //mi sposto in fuori
    rotate(rowNumber * 50); //giro l'uovo: ognuno in una direzione diversa
    drawUovo(0, 0, dCiotola * 0.05);
    pop();

    //va al posto dopo; se il cerchio è pieno, va al cerchio dopo
    posizione++;
    if (posizione == posti) {
      cerchio++;
      posizione = 0;
      posti = cerchio * 6;
    }
  }
  drawMenu();
  //mostra il paese vicino al puntatore solo quando questo si trova sopra una ciotola
  if (label != "") {
    //riquadro bianco, più alto per avere due righe
    fill("#FFFFFF");
    rect(mouseX + 12, mouseY + 12, 220, 62);

    //prima riga: il nome del paese, scuro e più grande
    fill("#2B2220");
    textSize(18);
    text(label, mouseX + 24, mouseY + 38);

    //seconda riga: quanti ramen, più chiaro e più piccolo
    fill("#7A6555");
    textSize(14);
    text(numeroRamen + " ramen in ciotola", mouseX + 24, mouseY + 60);
  }
}

function drawTavola() {
  //parete dove c'è il titolo
  background("#2E211B");

  //il tavolo parte da y = 150 e arriva in fondo
  noStroke();
  fill("#8A5A3B");
  rect(0, 150, width, height - 150);

  //bordo del tavolo, una striscia più scura
  fill("#6E4630");
  rect(0, 150, width, 12);

  //assi di legno: una linea scura ogni 70 px, partendo dal tavolo
  stroke("#6E4630");
  strokeWeight(3);
  for (let i = 0; i < height / 70; i++) {
    line(0, 162 + i * 70, width, 162 + i * 70);
  }

  //venature del legno
  stroke("#9A6845");
  strokeWeight(1);
  for (let i = 0; i < height / 70; i++) {
    line(0, 162 + i * 70 + 25, width, 162 + i * 70 + 25);
    line(0, 162 + i * 70 + 45, width, 162 + i * 70 + 45);
  }
}

//titolo e sottotitolo a sx
function drawTitolo() {
  noStroke();

  fill("#FFF6E6");
  textSize(42);
  text("Una tavola di ramen", 50, 75);

  fill("#F1DCC0");
  textSize(20);
  text("I 10 paesi con più recensioni di ramen istantanei in ciotola", 52, 104);
}

function drawCiotola(x, y, d) {
  //disegno le ciotole che rappresentano i paesi
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

function drawUovo(x, y, d) {
  //disegno le uova, che rappresentano tutti i ramen recensiti per quel paese
  push();
  translate(x, y);
  noStroke();
  fill("#FFFDF6");
  ellipse(0, 0, d, d * 0.78);
  fill("#F7C55A");
  ellipse(0, 0, d * 0.52, d * 0.46);
  fill("#E9862A");
  ellipse(0, 0, d * 0.32, d * 0.28);
  pop();
}

function drawMenu() {
  //disegno il quadrato per il menu legenda e poi aggiungo tutti i comandi per le scritte
  let x = width - 270;
  let y = 220;
  noStroke();
  fill("#F2E6D3");
  rect(x, y, 240, 300);

  fill("#2B2220");
  textSize(22);
  text("Menù", x + 20, y + 40);

  drawCiotola(x + 40, y + 93, 46);
  fill("#2B2220");
  textSize(15);
  text("Ogni ciotola", x + 80, y + 88);
  text("è un paese", x + 80, y + 106);

  drawUovo(x + 40, y + 155, 28);
  fill("#2B2220");
  textSize(15);
  text("Ogni uovo sodo", x + 80, y + 150);
  text("è un ramen in ciotola", x + 80, y + 168);
  textSize(16);
  text("Più uova ci sono,", x + 20, y + 220);
  text("più ramen ha quel paese.", x + 20, y + 238);

  fill("#7A6555");
  textSize(14);
  text("Passa il mouse su una ciotola", x + 20, y + 278);
}