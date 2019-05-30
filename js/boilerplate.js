/**
 * Boilerplate & utils
 */

export const TAU = Math.PI * 2;

export const noop = function() {};

export const extend = function(a, b) {
  for (var prop in b) {
    a[prop] = b[prop];
  }
  return a;
};

export const lerp = function(a, b, t) {
  return (b - a) * t + a;
};

export const modulo = function(num, div) {
  return ((num % div) + div) % div;
};

const powerMultipliers = {
  2: function(a) {
    return a * a;
  },
  3: function(a) {
    return a * a * a;
  },
  4: function(a) {
    return a * a * a * a;
  },
  5: function(a) {
    return a * a * a * a * a;
  }
};

export const easeInOut = function(alpha, power) {
  if (power == 1) {
    return alpha;
  }
  alpha = Math.max(0, Math.min(1, alpha));
  var isFirstHalf = alpha < 0.5;
  var slope = isFirstHalf ? alpha : 1 - alpha;
  slope = slope / 0.5;
  // make easing steeper with more multiples
  var powerMultiplier = powerMultipliers[power] || powerMultipliers[2];
  var curve = powerMultiplier(slope);
  curve = curve / 2;
  return isFirstHalf ? curve : 1 - curve;
};
