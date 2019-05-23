import ECS from './ecs.js';
import Components from './components.js';
const Assemblages = {
  Dot: function(size, color, position, velocity) {
    let entity = new ECS.Entity();
    let hue = color.h || 0;
    let saturation = color.s || 0;
    let luminance = color.l || 0;
    let posY = position.y;
    let posX = position.x;
    let velX = velocity.x;
    let velY = velocity.y;
    entity.addComponent(new Components.Color(hue, saturation, luminance));
    entity.addComponent(new Components.Size(size));
    entity.addComponent(new Components.Position(posX,posY));
    entity.addComponent(new Components.Velocity(velX, velY));
    return entity;
  }
};

export default Assemblages;