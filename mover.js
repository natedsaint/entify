self.onmessage = (event) => {
  if (!event) {
    return;
  }
  const entities = event.data.chunk;
  entities.forEach((entity) => {
    const position = entity.components.position;
    const velocity = entity.components.velocity;
    let targetX = position.x + velocity.x;
    let targetY = position.y + velocity.y;
    position.x = targetX;
    position.y = targetY;
  });
  self.postMessage(entities);
};  