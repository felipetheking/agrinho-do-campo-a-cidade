let caminhao;
let alimentos = [];
let obstaculos = [];
let pontuacao = 0;
let gameState = "instrucoes";
let timer = 0;
let fase = 1;

function setup() {
  createCanvas(800, 400);
  caminhao = new Caminhao();
  criarAlimento();
}

function draw() {
  if (gameState === "instrucoes") {
    telaInstrucoes();
  } else if (gameState === "jogando") {
    jogar();
  } else if (gameState === "gameover") {
    telaGameOver();
  }
}

function telaInstrucoes() {
  background(200, 230, 200);
  fill(0);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("DO CAMPO À CIDADE", width/2, 50);
  
  textSize(16);
  text("Use as setas para mover o caminhão", width/2, 100);
  text("Pressione ESPAÇO para coletar alimentos", width/2, 130);
  text("Leve os alimentos para a cidade (lado direito)", width/2, 160);
  text("Evite os obstáculos!", width/2, 190);
  
  fill(100, 200, 100);
  rect(width/2 - 100, 250, 200, 50, 10);
  fill(255);
  text("CLIQUE PARA COMEÇAR", width/2, 275);
}

function jogar() {
  // Fundo dividido
  background(144, 238, 144); // Campo
  fill(169); // Cidade
  rect(width/2, 0, width/2, height);
  
  // Caminhão
  caminhao.atualizar();
  caminhao.mostrar();
  
  // Alimentos
  for (let i = alimentos.length-1; i >= 0; i--) {
    alimentos[i].mostrar();
    
    if (alimentos[i].coletado) {
      alimentos[i].x = caminhao.x;
      alimentos[i].y = caminhao.y - 20;
      
      // Entrega na cidade
      if (alimentos[i].x > width/2) {
        pontuacao += 10;
        alimentos.splice(i, 1);
        criarAlimento();
      }
    }
  }
  
  // Obstáculos
  timer++;
  if (timer > 120) {
    obstaculos.push(new Obstaculo());
    timer = 0;
  }
  
  for (let i = obstaculos.length-1; i >= 0; i--) {
    obstaculos[i].atualizar();
    obstaculos[i].mostrar();
    
    // Remover obstáculos que saíram da tela
    if (obstaculos[i].x < -50) {
      obstaculos.splice(i, 1);
    }
    
    // Verificar colisão
    if (dist(caminhao.x, caminhao.y, obstaculos[i].x, obstaculos[i].y) < 30) {
      gameState = "gameover";
    }
  }
  
  // Interface
  fill(0);
  textSize(16);
  text("Pontos: " + pontuacao, 20, 30);
  text("Fase: " + fase, 20, 50);
  
  // Aumentar dificuldade
  if (pontuacao >= fase * 50) {
    fase++;
  }
}

function telaGameOver() {
  background(255, 200, 200);
  fill(255, 0, 0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("FIM DE JOGO", width/2, height/2 - 40);
  textSize(24);
  text("Pontuação: " + pontuacao, width/2, height/2 + 20);
  
  fill(200, 0, 0);
  rect(width/2 - 100, height/2 + 60, 200, 40, 10);
  fill(255);
  text("Jogar Novamente", width/2, height/2 + 85);
}

function mousePressed() {
  if (gameState === "instrucoes") {
    gameState = "jogando";
  } else if (gameState === "gameover") {
    resetarJogo();
  }
}

function keyPressed() {
  if (keyCode === 32) { // Barra de espaço
    for (let i = 0; i < alimentos.length; i++) {
      if (!alimentos[i].coletado && dist(caminhao.x, caminhao.y, alimentos[i].x, alimentos[i].y) < 30) {
        alimentos[i].coletado = true;
        break;
      }
    }
  }
}

function criarAlimento() {
  alimentos.push({
    x: random(width/2),
    y: height - 50,
    coletado: false,
    mostrar: function() {
      fill(0, 200, 0);
      ellipse(this.x, this.y, 20, 20);
    }
  });
}

function resetarJogo() {
  pontuacao = 0;
  fase = 1;
  gameState = "jogando";
  caminhao = new Caminhao();
  alimentos = [];
  obstaculos = [];
  criarAlimento();
}

class Caminhao {
  constructor() {
    this.x = 100;
    this.y = height - 100;
    this.velocidade = 5;
    this.largura = 80;
    this.altura = 50;
  }
  
  atualizar() {
    if (keyIsDown(LEFT_ARROW)) this.x -= this.velocidade;
    if (keyIsDown(RIGHT_ARROW)) this.x += this.velocidade;
    if (keyIsDown(UP_ARROW)) this.y -= this.velocidade;
    if (keyIsDown(DOWN_ARROW)) this.y += this.velocidade;
    
    // Limitar movimento na tela
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 50, height - 50);
  }
  
  mostrar() {
    fill(255, 165, 0); // Laranja
    rect(this.x - this.largura/2, this.y - this.altura/2, this.largura, this.altura, 5);
    fill(0); // Preto
    // Janelas
    rect(this.x - this.largura/3, this.y - this.altura/3, 15, 15, 3);
    rect(this.x + this.largura/6, this.y - this.altura/3, 15, 15, 3);
  }
}

class Obstaculo {
  constructor() {
    this.x = width;
    this.y = random(height - 100, height - 50);
    this.velocidade = 3 + random(2);
    this.tipo = floor(random(2));
  }
  
  atualizar() {
    this.x -= this.velocidade;
  }
  
  mostrar() {
    fill(139, 69, 19); // Marrom
    if (this.tipo === 0) {
      rect(this.x, this.y, 50, 30, 5); // Tora de madeira
    } else {
      ellipse(this.x, this.y, 40, 25); // Animal
      fill(0);
      ellipse(this.x - 10, this.y - 5, 5, 5); // Olho
    }
  }
}