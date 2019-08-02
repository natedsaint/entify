const Utils = {
  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  },
  clamp(min, max, num) {
    return Math.min(Math.max(num, min), max);
  },
};

export default Utils;