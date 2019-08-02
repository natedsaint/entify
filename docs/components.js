// Components
const Components = {};

Components.Color = function(h = 0, s = 0, l = 0) {
  this.h = h;
  this.s = s;
  this.l = l;
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
};

Components.Size.prototype.name = 'size';

Components.Velocity = function(x = 1, y = 1) {
  this.x = x;
  this.y = y;
  return this;
}; 

Components.Velocity.prototype.name = 'velocity';

export default Components;