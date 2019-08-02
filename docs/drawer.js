let canvas;
let ctx;
let perfCounter = 0;
let perfText = '';
self.onmessage = (event) => {
  if (!event) {
    return false;
  }
  if (event.data.init) {
    canvas = event.data.transferrables;
    ctx = canvas.getContext('2d', { alpha: true });
    self.postMessage({success: true});
  } else if (ctx) {
    ctx.clearRect(0,0,canvas.width, canvas.height);
  
    const entities = event.data.chunk;
  
    entities.forEach((entity) => {
      const color = entity.components.color;
      const size = entity.components.size;
      const position = entity.components.position;
      ctx.beginPath();
      ctx.fillStyle = `hsl(${color.h}, ${color.s}, ${color.l})`;
      ctx.strokeStyle = `hsl(${color.h + 180}, ${color.s}, ${color.l})`;
      ctx.arc(position.x, position.y, size.radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
    });

    perfCounter++;
    if (perfCounter % 30 === 0 || (!perfText && event.data.fps)) {
      perfCounter = 0;
      perfText = event.data.fps + ' fps';
    }
    ctx.font = '32px helvetica';
    ctx.fillStyle = '#fff';
    ctx.fillText(perfText, 10, 50);
  }
  self.postMessage(event.data.chunk);
};
