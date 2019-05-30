import { TAU, extend } from "./boilerplate";
import Anchor from "./anchor";
import Shape from "./shape";
import Rect from "./rect";

/**
 * Box composite shape
 */

// ----- BoxRect ----- //

var BoxRect = Rect.subclass();
// prevent double-creation in parent.copyGraph()
// only create in Box.create()
BoxRect.prototype.copyGraph = function() {};

// ----- Box ----- //

var boxDefaults = extend(
  {
    width: 1,
    height: 1,
    depth: 1,
    frontFace: true,
    rearFace: true,
    leftFace: true,
    rightFace: true,
    topFace: true,
    bottomFace: true
  },
  Shape.defaults
);
// default fill
boxDefaults.fill = true;
delete boxDefaults.path;

var Box = Anchor.subclass(boxDefaults);

Box.prototype.create = function(options) {
  Anchor.prototype.create.call(this, options);
  this.updatePath();
};

Box.prototype.updatePath = function() {
  this.setFace("frontFace", {
    width: this.width,
    height: this.height,
    translate: { z: this.depth / 2 }
  });
  this.setFace("rearFace", {
    width: this.width,
    height: this.height,
    translate: { z: -this.depth / 2 },
    rotate: { y: TAU / 2 }
  });
  this.setFace("leftFace", {
    width: this.depth,
    height: this.height,
    translate: { x: -this.width / 2 },
    rotate: { y: -TAU / 4 }
  });
  this.setFace("rightFace", {
    width: this.depth,
    height: this.height,
    translate: { x: this.width / 2 },
    rotate: { y: TAU / 4 }
  });
  this.setFace("topFace", {
    width: this.width,
    height: this.depth,
    translate: { y: -this.height / 2 },
    rotate: { x: -TAU / 4 }
  });
  this.setFace("bottomFace", {
    width: this.width,
    height: this.depth,
    translate: { y: this.height / 2 },
    rotate: { x: -TAU / 4 }
  });
};

Box.prototype.setFace = function(faceName, options) {
  var property = this[faceName];
  var rectProperty = faceName + "Rect";
  var rect = this[rectProperty];
  // remove if false
  if (!property) {
    this.removeChild(rect);
    return;
  }
  // update & add face
  extend(options, {
    // set color from option, i.e. `front: '#19F'`
    color: typeof property == "string" ? property : this.color,
    stroke: this.stroke,
    fill: this.fill,
    backface: this.backface,
    front: this.front,
    visible: this.visible
  });
  if (rect) {
    // update previous
    rect.setOptions(options);
  } else {
    // create new
    rect = this[rectProperty] = new BoxRect(options);
  }
  rect.updatePath();
  this.addChild(rect);
};

export default Box;
