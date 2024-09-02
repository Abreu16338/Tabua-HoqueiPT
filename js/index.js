window.onload = function() {
    drawField();
    window.addEventListener('resize', drawField);
};

// Inicializa contadores para os jogadores e lista de jogadores
let redPlayerCount = 0;
let greenPlayerCount = 0;
const players = [];
let selectedPlayer = null;
let offsetX, offsetY;

// Função para desenhar o campo
function drawField() {
    const canvas = document.getElementById('campoHockey');
    const ctx = canvas.getContext('2d');

    // Definindo o tamanho do canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Configurando estilos de desenho
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    // Margens do campo
    const margin = 10;
    const fieldWidth = canvas.width - 2 * margin;
    const fieldHeight = canvas.height - 2 * margin;

    // Desenho do retângulo principal do campo com bordas arredondadas
    ctx.beginPath();
    ctx.moveTo(margin + 5, margin);
    ctx.lineTo(canvas.width - margin - 5, margin);
    ctx.quadraticCurveTo(canvas.width - margin, margin, canvas.width - margin, margin + 5);
    ctx.lineTo(canvas.width - margin, canvas.height - margin - 5);
    ctx.quadraticCurveTo(canvas.width - margin, canvas.height - margin, canvas.width - margin - 5, canvas.height - margin);
    ctx.lineTo(margin + 5, canvas.height - margin);
    ctx.quadraticCurveTo(margin, canvas.height - margin, margin, canvas.height - margin - 5);
    ctx.lineTo(margin, margin + 5);
    ctx.quadraticCurveTo(margin, margin, margin + 5, margin);
    ctx.stroke();

    // Linha central
    ctx.beginPath();
    ctx.moveTo(margin, canvas.height / 2);
    ctx.lineTo(canvas.width - margin, canvas.height / 2);
    ctx.stroke();

    // Círculo central
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const centerRadius = fieldWidth * 0.05; // 5% da largura do campo

    ctx.beginPath();
    ctx.arc(centerX, centerY, centerRadius, 0, 2 * Math.PI);
    ctx.stroke();

    // Áreas de gol comprimidas horizontalmente
    const goalAreaHeight = fieldHeight * 0.15; // 15% da altura do campo
    const goalAreaWidth = fieldWidth * 0.3; // 30% da largura do campo

    // Ajustar a distância das áreas de gol do topo e do fundo do campo
    const goalOffset = 40; // Aumenta a distância das áreas de gol do topo e do fundo

    // Área de gol superior com bordas arredondadas
    ctx.beginPath();
    ctx.moveTo(centerX - goalAreaWidth / 2 + 5, margin + goalOffset);
    ctx.lineTo(centerX + goalAreaWidth / 2 - 5, margin + goalOffset);
    ctx.quadraticCurveTo(centerX + goalAreaWidth / 2, margin + goalOffset, centerX + goalAreaWidth / 2, margin + goalOffset + 5);
    ctx.lineTo(centerX + goalAreaWidth / 2, margin + goalOffset + goalAreaHeight - 5);
    ctx.quadraticCurveTo(centerX + goalAreaWidth / 2, margin + goalOffset + goalAreaHeight, centerX + goalAreaWidth / 2 - 5, margin + goalOffset + goalAreaHeight);
    ctx.lineTo(centerX - goalAreaWidth / 2 + 5, margin + goalOffset + goalAreaHeight);
    ctx.quadraticCurveTo(centerX - goalAreaWidth / 2, margin + goalOffset + goalAreaHeight, centerX - goalAreaWidth / 2, margin + goalOffset + goalAreaHeight - 5);
    ctx.lineTo(centerX - goalAreaWidth / 2, margin + goalOffset + 5);
    ctx.quadraticCurveTo(centerX - goalAreaWidth / 2, margin + goalOffset, centerX - goalAreaWidth / 2 + 5, margin + goalOffset);
    ctx.stroke();

    // Área de gol inferior com bordas arredondadas
    ctx.beginPath();
    ctx.moveTo(centerX - goalAreaWidth / 2 + 5, canvas.height - margin - goalOffset);
    ctx.lineTo(centerX + goalAreaWidth / 2 - 5, canvas.height - margin - goalOffset);
    ctx.quadraticCurveTo(centerX + goalAreaWidth / 2, canvas.height - margin - goalOffset, centerX + goalAreaWidth / 2, canvas.height - margin - goalOffset - 5);
    ctx.lineTo(centerX + goalAreaWidth / 2, canvas.height - margin - goalOffset - goalAreaHeight + 5);
    ctx.quadraticCurveTo(centerX + goalAreaWidth / 2, canvas.height - margin - goalOffset - goalAreaHeight, centerX + goalAreaWidth / 2 - 5, canvas.height - margin - goalOffset - goalAreaHeight);
    ctx.lineTo(centerX - goalAreaWidth / 2 + 5, canvas.height - margin - goalOffset - goalAreaHeight);
    ctx.quadraticCurveTo(centerX - goalAreaWidth / 2, canvas.height - margin - goalOffset - goalAreaHeight, centerX - goalAreaWidth / 2, canvas.height - margin - goalOffset - goalAreaHeight + 5);
    ctx.lineTo(centerX - goalAreaWidth / 2, canvas.height - margin - goalOffset - 5);
    ctx.quadraticCurveTo(centerX - goalAreaWidth / 2, canvas.height - margin - goalOffset, centerX - goalAreaWidth / 2 + 5, canvas.height - margin - goalOffset);
    ctx.stroke();
}

// Função para adicionar um jogador
function add_red() {
    if (redPlayerCount < 5) {
        addPlayer('red', 'top');
        redPlayerCount++;
    } else {
        alert('Só é possível ter 5 jogadores por equipe.');
    }
}

function add_green() {
    if (greenPlayerCount < 5) {
        addPlayer('green', 'bottom');
        greenPlayerCount++;
    } else {
        alert('Só é possível ter 5 jogadores por equipe.');
    }
}

// Função para adicionar um jogador ao canvas
function addPlayer(color, area) {
    const canvas = document.getElementById('campoHockey');
    const ctx = canvas.getContext('2d');
    
    // Margens do campo
    const margin = 10;
    const fieldWidth = canvas.width - 2 * margin;
    const fieldHeight = canvas.height - 2 * margin;

    // Determine o limite Y baseado na área
    let yBoundary;
    if (area === 'top') {
        yBoundary = margin + (fieldHeight * 0.15); // Top area height
    } else {
        yBoundary = canvas.height - margin - (fieldHeight * 0.15); // Bottom area height
    }
    
    // Gerar posição aleatória dentro da área correta
    const x = Math.random() * (fieldWidth - 20) + margin;
    const y = area === 'top'
        ? Math.random() * yBoundary // Dentro da área superior
        : Math.random() * (canvas.height - yBoundary) + yBoundary; // Dentro da área inferior

    // Adicionar o jogador ao array de jogadores
    players.push({ color, x, y, radius: 15 });
    
    // Redesenhar todos os jogadores
    redrawPlayers();
}

// Função para redesenhar todos os jogadores
function redrawPlayers() {
    const canvas = document.getElementById('campoHockey');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
    drawField(); // Redesenha o campo

    players.forEach(player => {
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
        ctx.fillStyle = player.color;
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

// Adiciona eventos de arrastar
const canvas = document.getElementById('campoHockey');

canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    players.forEach(player => {
        const dx = x - player.x;
        const dy = y - player.y;
        if (Math.sqrt(dx * dx + dy * dy) < player.radius) {
            selectedPlayer = player;
            offsetX = x - player.x;
            offsetY = y - player.y;
        }
    });
});

canvas.addEventListener('mousemove', function(e) {
    if (selectedPlayer) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        selectedPlayer.x = Math.max(15, Math.min(canvas.width - 15, x - offsetX));
        selectedPlayer.y = Math.max(15, Math.min(canvas.height - 15, y - offsetY));

        redrawPlayers();
    }
});

canvas.addEventListener('mouseup', function() {
    selectedPlayer = null;
});
