import ECS from './ecs.js';
import Components from './components.js';
const Assemblages = {
  Dot: function(size, color, position, velocity) {
    let entity = new ECS.Entity();
    let red = color.r || 0;
    let blue = color.b || 0;
    let green = color.g || 0;
    let alpha = color.a || 0;
    let posY = position.y;
    let posX = position.x;
    let velAngle = velocity.angle;
    let velMagnitude = velocity.magnitude;
    entity.addComponent(new Components.Color(red, green, blue, alpha));
    entity.addComponent(new Components.Size(size));
    entity.addComponent(new Components.Position(posX,posY));
    entity.addComponent(new Components.Velocity(velAngle, velMagnitude));
    return entity;
  }
};

export default Assemblages;