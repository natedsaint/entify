self.onmessage = (event) => {
  if (!event) {
    return false;
  }
  const entities = event.data.chunk;
  const allEntities = event.data.allData;
  entities.forEach((entity) => {
    const position = entity.components.position;
    const radius = entity.components.size.radius;
    const velocity = entity.components.velocity;
    // horizontal wall
    if (position.y + radius > 1024 || position.y - radius < 0) {
      velocity.y *= -1;
    // vertical wall
    } else if (position.x + radius > 1024 || position.x - radius < 0) {
      velocity.x *= -1;
    } else {
      allEntities.forEach((otherEntity) => {
        if (otherEntity.id === entity.id) { // don't compare to self, other collision will happen on iteration
          return;
        }
        const otherPosition = otherEntity.components.position;
        const otherRadius = otherEntity.components.size.radius;
        const otherVelocity = otherEntity.components.velocity;
        const intersects = Math.hypot(position.x-otherPosition.x, position.y - otherPosition.y) <= (radius + otherRadius);
        if (intersects) {
          // approximate spherical mass
          const molecules1 = 4 * Math.PI * (radius ** 2);
          const mass1 = molecules1 * 0.1;
          const molecules2 = 4 * Math.PI * (otherRadius ** 2);
          const mass2 = molecules2 * 0.1;
          // const mass1 = 2 ** radius;
          // const mass2 = 2 ** otherRadius;
          const newVelX1 = (velocity.x * (mass1 - mass2) + (2 * mass2 * otherVelocity.x)) / (mass1 + mass2);
          const newVelY1 = (velocity.y * (mass1 - mass2) + (2 * mass2 * otherVelocity.y)) / (mass1 + mass2);
          velocity.x = newVelX1;
          velocity.y = newVelY1;
        }
      });
    }
  });
  self.postMessage(entities);
};