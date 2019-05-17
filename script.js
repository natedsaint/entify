const ECS = {};
// E
ECS.allEntites = [];
ECS.Entity = function () {
  this.id = (+new Date()).toString(16) + 
  (Math.random() * 100000000 | 0).toString(16) +
  ECS.Entity.prototype.count;
  ECS.Entity.prototype.count++;
  this.components = {};
  ECS.allEntites.push(this);
  return this;
};
ECS.Entity.prototype.count = 0;

ECS.Entity.prototype.print = function () {
  console.log(JSON.stringify(this, null, 4));
  return this;
};

// C
ECS.Entity.prototype.addComponent = function ( component ){
  this.components[component.name] = component;
  return this;
};

ECS.Entity.prototype.removeComponent = function ( componentName ){
  var name = componentName; // assume a string was passed in

  if(typeof componentName === 'function'){ 
      name = componentName.prototype.name;
  }

  delete this.components[name];
  return this;
};

ECS.Components = {}; 
// S

ECS.AllSystems = [];
ECS.System = function(name) {
  this.setName(name);
  ECS.AllSystems.push(this);
  return this;
};

ECS.System.prototype.setName = function(name) {
  ECS.System.prototype.name = name;
  return this;
};

// Implementation

// Components
ECS.Components.Color = function(r = 0, g = 0, b = 0) {
  this.r = r;
  this.g = g;
  this.b = b;
  return this;
};

ECS.Components.Color.prototype.name = 'color';

// Assemblages

ECS.Assemblages = {
  Character: function() {
    let entity = new ECS.Entity();
    entity.addComponent(ECS.Components.Color);
    console.warn(entity.components);
  }
};

const baseSystem = new ECS.System('Base');

const bob = new ECS.Assemblages.Character();
console.warn(bob);