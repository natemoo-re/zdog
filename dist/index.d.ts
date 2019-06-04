export as namespace Zdog;

export class Vector implements VectorObject {
  constructor(position?: VectorLike);
  x: number;
  y: number;
  z: number;
  /** Sets x, y, z coordinates. */
  set(position: VectorLike): this;
  /** Returns a new Vector with copied x, y, and z coordinates. */
  copy(): Vector;
  /** Adds x, y, z coordinate values. */
  add(position: VectorLike): this;
  /** Subtracts x, y, z coordinate values. */
  subtract(position: VectorLike): this;
  /** Multiplies x, y, z coordinate values. */
  multiply(position: VectorLike): this;
  /** Rotates a position vector given a rotation vector Object. */
  rotate(rotation: VectorLike): this;
  /** Returns the total length of the vector. */
  magnitude(): number;
  /** Linear interporlate the vector towards point, given alpha a percent between the vector and point. */
  lerp(point: VectorLike, alpha: number): Vector;
}

interface VectorObject {
  x?: number,
  y?: number,
  z?: number,
}

export type VectorLike = number | VectorObject | Vector;

interface AnchorOptions {
  /** Adds item to parent item. */
  addTo?: Item,
  /** Positions the item. Set to a Vector. */
  translate?: VectorLike,
  /** Rotates the item. Set to a Vector to rotate the item around the corresponding axis. */
  rotate?: VectorLike,
  /** 
   * Enlarges or shrinks item geometry. scale does not scale stroke.
   * 
   * Set scale with a number to set x, y, & z scales to the same value. 
   * 
   * Set scale to a Vector to set coordinate-specific scale.
   */
  scale?: VectorLike
}

export class Anchor implements AnchorOptions {
  constructor(options?: AnchorOptions);
  addTo: Item;
  translate: Vector;
  rotate: Vector;
  scale: Vector;
  /** Copy an item. copy() only copies the item, not the item’s graph of descendant items. Use copyGraph() to copy the item and its graph. */
  copy(options?: any): Item;
  /** Copies item and its descendent items. */
  copyGraph(options?: any): this;
  /** Adds child item. addChild() is useful for moving a child item to a new parent, or creating an item without addTo. */
  addChild(shape: Item): void;
  /** Removes child item */
  removeChild(shape: Item): void;
  /** Removes item from parent. */
  remove(): void;
  /** Updates the items and all its graph of descendant items so they are ready for rendering. Useful for rendering without Illustration. */
  updateGraph(): void;
  /** Renders the item and all its descendant items to a <canvas> element. Useful for rendering without Illustration. */
  renderGraphCanvas(context: CanvasRenderingContext2D): void;
  /** Renders the item and all its descendant items to an SVG element. Useful for rendering without Illustration. */
  renderGraphSvg(element: HTMLElement): void;
  /** Wraps-around rotate x, y, & z values between 0 and TAU. */
  normalizeRotate(): void;
}

type Item = Anchor;

interface ShapeOptions extends AnchorOptions {
  /** Sets shape stroke and fill color */
  color?: string;
  /** 
   * Renders the shape line and sets line width.
   * 
   * Set stroke to 0 or false to disable.
   */
  stroke?: number | boolean;
  /** Renders the inner shape area. Disabled by default. */
  fill?: boolean;
  /** Closes the path from the last point back to the first. Enabled by default. */
  closed?: boolean;
  /** Shows or hides shape. Does not affect child items. */
  visible?: boolean;
  /** 
   * Shows or hides the shape when its backface is visible. Enabled by default.
   * 
   * Set backface to a color to change the shape’s color when its backface is showing.
   */
  backface?: boolean;
  /** A Vector used to determine where the front of the shape is. */
  front?: VectorLike;
}

export class Shape extends Anchor implements ShapeOptions {
  constructor(options?: ShapeOptions);
  color: string;
  stroke: number | boolean;
  fill: boolean;
  closed: boolean;
  visible: boolean;
  backface: boolean;
  front: Vector;
  /** Updates the shape path. Trigger updatePath() after you change a point on a Shape’s path. */
  updatePath(): void;
}

interface GroupOptions extends AnchorOptions {
  /** Shows or hides group, including all child items in the group. */
  visible?: boolean;
  /** Updates the rendering order of the group’s child items. */
  updateSort?: boolean;
}

export class Group extends Anchor {
  constructor(options?: GroupOptions);
  /** Shows or hides group, including all child items in the group. */
  visible: boolean;
  /** Updates the rendering order of the group’s child items. */
  updateSort(): void;
}

type DraggerEvent = (Event | Touch) & { pageX: number, pageY: number };

interface DraggerMethods {
  /** Callback function triggered when dragging starts with the initial mousedown, pointerdown, or touchstart event. */
  onDragStart?(pointer: DraggerEvent): void;
  /** Callback function triggered when dragging moves with mousemove, pointermove, or touchmove event. */
  onDragMove?(pointer: DraggerEvent, moveX: number, moveY: number): void;
  /** Callback function triggered when dragging ends on the mousedown, pointerdown, or touchstart event. */
  onDragEnd?(pointer: DraggerEvent): void;
}

interface DraggerOptions extends DraggerMethods {
  /** The element to start dragging on the initial mousedown, pointerdown, or touchstart event. */
  startElement?: HTMLElement | string;
}

export class Dragger implements DraggerOptions {
  constructor(options?: DraggerOptions);
}

interface IllustrationOptions extends AnchorOptions, DraggerMethods {
  /** The HTML element to render on, either a <canvas> or an  <svg>. */
  element: string | Element;
  /** Enlarges or shrinks the displayed size of the rendering. */
  zoom?: number;
  /** Centers the scene in the element. Enabled by default */
  centered?: boolean;
  /** Enables dragging to rotate on an item. */
  dragRotate?: boolean;
  /** Enables fluid resizing of element. */
  resize?: boolean;
  /** A function triggered when the element is resized. Required resize to be enabled. */
  onResize?(width: number, height: number): void;
  /**
   * Function triggered before rendering.
   * @param context the rendering context. 
   * 
   * For <canvas>, the CanvasRenderingContext2D. For <svg>, the <svg> element.
   */
  onPrerender?(context: CanvasRenderingContext2D | SVGSVGElement): void;
}

export class Illustration extends Anchor implements IllustrationOptions {
  constructor(options?: IllustrationOptions);
  element: HTMLCanvasElement|SVGSVGElement;
  zoom: number;
  centered: boolean;
  dragRotate: boolean;
  resize: boolean;
  onResize(width: number, height: number): void;
  onPrerender(context: CanvasRenderingContext2D | Element): void;
  onDragStart(pointer: DraggerEvent): void;
  onDragMove(pointer: DraggerEvent, moveX: number, moveY: number): void;
  onDragEnd(pointer: DraggerEvent): void;
  /** Renders an item and its graph to the Illustration’s element. */
  renderGraph(scene?: Item): void;
  /**
   * Combines updateGraph() and renderGraph() methods — to save you a line of code. 
   * 
   * Updates and renders an item and its graph to the Illustration’s element. 
   */
  updateRenderGraph(scene?: Item): void;
  /** Sets element size. */
  setSize(width: number, height: number): void;
}

// export interface CanvasRenderer {}
// export interface SvgRenderer {}
// export interface PathCommand {}
// export interface Rect {}
// export interface RoundedRect {}
// export interface Ellipse {}
// export interface Polygon {}
// export interface Hemisphere {}
// export interface Cylinder {}
// export interface Cone {}
// export interface Box {}