const locations = {
  PsitTower: { x: 400, y: 100 },
  TownHall: { x: 400, y: 180 },
  GBlock: { x: 180, y: 180 },
  EBlock: { x: 180, y: 300 },
  FBlock: { x: 250, y: 350 },
  DBlock: { x: 250, y: 480 },
  ABlock: { x: 180, y: 555 },
  CBlock: { x: 180, y: 430 },
  BBlock: { x: 250, y: 610 },
  SBlock: { x: 180, y: 660 },
  RBlock: { x: 615, y: 660 },
  QBlock: { x: 550, y: 610 },
  PBlock: { x: 620, y: 560 },
  NBlock: { x: 550, y: 480 },
  MBlock: { x: 620, y: 430 },
  LBlock: { x: 550, y: 350 },
  KBlock: { x: 620, y: 300 },
  JBlock: { x: 620, y: 180 },
  RangManch: { x: 397, y: 660 },
};
const graph = {
  GBlock: { EBlock: 60, TownHall: 60 },
  EBlock: { GBlock: 60, FBlock: 70, CBlock: 50 },
  FBlock: { EBlock: 70, CBlock: 65 },
  CBlock: { EBlock: 50, FBlock: 65, DBlock: 60, ABlock: 60 },
  DBlock: { CBlock: 60, ABlock: 65 },
  ABlock: { CBlock: 60, DBlock: 65, BBlock: 60, SBlock: 60 },
  BBlock: { ABlock: 60, SBlock: 50 },
  SBlock: { ABlock: 60, BBlock: 50, RangManch: 300 },
  RangManch: { SBlock: 300, RBlock: 100 },
  RBlock: { RangManch: 100, QBlock: 60, PBlock: 120 },
  QBlock: { RBlock: 60, PBlock: 60 },
  PBlock: { RBlock: 120, QBlock: 60, NBlock: 150, MBlock: 40 },
  NBlock: { PBlock: 150, MBlock: 90 },
  MBlock: { NBlock: 90, LBlock: 125, PBlock: 40, KBlock: 30 },
  LBlock: { MBlock: 125, KBlock: 100 },
  KBlock: { LBlock: 100, JBlock: 70, MBlock: 30 },
  JBlock: { KBlock: 70, TownHall: 120 },
  TownHall: { JBlock: 120, PsitTower: 220, GBlock: 60 },
  PsitTower: { TownHall: 220 },
};

const draw = SVG().addTo("#map").size(800, 800);

// Dijkstra's algorithm
function dijkstra(graph, start, end) {
  const distances = {};
  const previous = {};
  const queue = new Set(Object.keys(graph));

  for (const node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[start] = 0;

  while (queue.size > 0) {
    let currentNode = null;
    for (const node of queue) {
      if (currentNode === null || distances[node] < distances[currentNode]) {
        currentNode = node;
      }
    }

    queue.delete(currentNode);

    if (currentNode === end) {
      break;
    }

    for (const neighbor in graph[currentNode]) {
      const distance = graph[currentNode][neighbor];
      const alt = distances[currentNode] + distance;
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = currentNode;
      }
    }
  }

  const path = [];
  let current = end;
  while (current) {
    path.unshift(current);
    current = previous[current];
  }
  return path;
}

function findPath() {
  const initial = document.getElementById("initial-location").value;
  const destination = document.getElementById("destination-location").value;

  if (!initial || !destination) {
    alert("Please select both initial and destination locations.");
    return;
  }

  const path = dijkstra(graph, initial, destination);
  if (path.length === 0) {
    alert("No path found!");
    return;
  }

  drawPath(path);
}

function drawPath(path) {
  draw.clear();
  for (let i = 0; i < path.length - 1; i++) {
    const start = locations[path[i]];
    const end = locations[path[i + 1]];

    // Draw line
    draw
      .line(start.x, start.y, end.x, end.y)
      .stroke({ color: "grey", width: 7 });
  }

  // Draw markers for each point in the path
  for (const location of path) {
    const { x, y } = locations[location];
    draw.circle(10).attr({
      cx: x,
      cy: y,
      fill: "black",
    });
  }
}
