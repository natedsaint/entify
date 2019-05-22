self.onmessage = (event) => {
  if (!event) {
    return;
  }
  const entities = event.data.chunk;
  entities.forEach((entity) => {
    const position = entity.components.position;
    const velocity = entity.components.velocity;
    let targetX = position.x + Math.cos(velocity.angle) * velocity.magnitude;
    let targetY = position.y + Math.sin(velocity.angle) * velocity.magnitude;
    position.x = targetX;
    position.y = targetY;
  });
  self.postMessage(entities);
};  