// Components
const Components = {};

Components.Color = function(r = 0, g = 0, b = 0, a = 0) {
  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;
  return this;
};

Components.Color.prototype.name = 'color';

Components.Position = function(x=0, y=0) {
  this.x = x;
  this.y = y;
  return this;
};

Components.Position.prototype.name = 'position';

Components.Size = function(radius=0.1) {
  this.radius = radius;
  return this;
}

Components.Size.prototype.name = 'size';

Components.Velocity = function(angle=0, magnitude=1) {
  this.angle = angle;
  this.magnitude = magnitude;
  return this;
} 

Components.Velocity.prototype.name = 'velocity';

export default Components;