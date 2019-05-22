const PADDING = 2;
self.onmessage = (event) => {
  if (!event) {
    return false;
  }
  const entities = event.data.chunk;
  const allEntities = event.data.allData;
  entities.forEach((entity) => {
    // TODO: if the circle ended up outside the wall, move it so it doesn't get stuck
    const position = entity.components.position;
    const radius = entity.components.size.radius + PADDING;
    const velocity = entity.components.velocity;
    // outside wall
    if (position.x + radius > 1024 || position.x - radius < 0 ||
        position.y + radius > 1024 || position.y - radius < 0) {
      // TODO: make this more mathematically correct, probably reflecting the vector
      velocity.angle += 90;
    } else {
      allEntities.forEach((otherEntity) => {
        // TODO: if the circle ended up inside another, move it so it doesn't get stuck
        if (otherEntity.id === entity.id) {
          return;
        }
        const otherPosition = otherEntity.components.position;
        const otherSize = otherEntity.components.size.radius;
        // first get distance between centers
        const distance = Math.sqrt( (position.x - otherPosition.x) ** 2 + (position.y - otherPosition.y) ** 2); 
        // then add the radius of each
        const combinedRadii = radius + otherSize;
        if (distance - combinedRadii <= 0.1 ) {
          // velocity.angle = Math.round((velocity.angle - otherEntity.components.velocity.angle) / 360) * 360;
          velocity.angle += 90.;
        }
      });
    }
  });
  self.postMessage(entities);
}