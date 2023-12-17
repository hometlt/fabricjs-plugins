import {fabric} from "fabric";
import {IPoint} from "fabric/fabric-impl";


const connectionOwnProperties: string[] = []

const MIN_DISTANCE_ARROW = 2

/**
 * FabricJS Table Object
 */
class FabricConnection extends fabric.Line {
  type = 'connection'

  /**
   * customizable FabricJS properties
   */
  fill= 'rgb(88,47,190)'
  stroke= 'rgb(88,47,190)'
  cornerColor =  '#582fbe'
  cornerSize =  5
  strokeWidth= 2
  selectable= false
  evented= false
  orientation: string = "horizontal"

  _source: fabric.Object
  _target: fabric.Object

  getConnectionPoint(target: fabric.Object ,side: string): IPoint {

    let l = target.left,
        t = target.top,
        w = target.width * target.scaleX,
        h = target.height * target.scaleY

    switch (side) {
      case 'left':
        return {x: l, y: t + h / 2}
      case 'right':
        return {x: l + w, y: t + h / 2}
      case 'bottom':
        return {x: l + w / 2, y: t + h}
      case 'top':
        return {x: l + w / 2, y: t}
      case 'middle':
        return {x: l + w / 2, y: t + h / 2}
    }
  }

  updateLinePoints(){
    if(!this._source || ! this._target){
      return
    }
    let s = this._source
    let t = this._target
    //left , right, top, bottom

    let b1 = s.getBoundingRect()
    let b2 = t.getBoundingRect()

    let point1 : IPoint, point2 : IPoint, orientation: string
    if(b2.left - MIN_DISTANCE_ARROW > b1.left + b1.width){
      orientation = 'horizontal'
      point1 = this.getConnectionPoint(s,'right')
      point2 = this.getConnectionPoint(t,'left')
    }
    else if(b2.left + b2.width < b1.left - MIN_DISTANCE_ARROW) {
      orientation = 'horizontal'
      point1 = this.getConnectionPoint(s,'left')
      point2 = this.getConnectionPoint(t,'right')
    }
    else if(b2.top - MIN_DISTANCE_ARROW >  b1.top + b1.height){
      orientation = 'vertical'
      point1 = this.getConnectionPoint(s,'bottom')
      point2 = this.getConnectionPoint(t,'top')
    }
    else if(b2.top + b2.height < b1.top - MIN_DISTANCE_ARROW){
      orientation = 'vertical'
      point1 = this.getConnectionPoint(s,'top')
      point2 = this.getConnectionPoint(t,'bottom')
    }
    //inside
    else if(b2.left + b2.width/2 > b1.left + b1.width/2) {
      orientation = 'horizontal'
      point1 = this.getConnectionPoint(s,'right')
      point2 = this.getConnectionPoint(t,'left')
    }
    else {
      orientation = 'horizontal'
      point1 = this.getConnectionPoint(s,'left')
      point2 = this.getConnectionPoint(t,'right')
    }

    // @ts-ignore
    this.set({
      orientation,
      x1: point1.x,
      y1: point1.y ,
      x2: point2.x,
      y2: point2.y
    });
  }

  constructor(options: Partial<fabric.ConnectionOptions>) {
    super()
    this._update = this.updateLinePoints.bind(this);
    this._remove = () => this.canvas.remove(this)
    fabric.Line.prototype.initialize.call(this,[0,0,0,0],options)
    if(options.source){
      this.setSource(options.source)
    }
    if(options.target){
      this.setTarget(options.target)
    }
    this.on("removed",this.unsubscribe.bind(this))
  }
  unsubscribe(){
    this._setTarget(null)
    this._setSource(null)
  }

  _watchObject(object: fabric.Object){
    if(!object){
      return
    }
    object.on({
      "removed": this._remove,
      "moving": this._update,
      "scaling": this._update,
      "resizing": this._update
    })
  }

  _unwatchObject(object: fabric.Object){
    if(!object){
      return
    }
    object.off({
      "removed": this._remove,
      "moving": this._update,
      "scaling": this._update,
      "resizing": this._update
    })
  }
  _setSource(object: fabric.Object){
    if(this._source){
      this._unwatchObject(this._source)
      this._source._outputConections.splice(this._source._outputConections.indexOf(this),1)
      if(this._target){
        this._source.connections.splice(this._source.connections.indexOf(this._target.id),1)
      }
    }

    if(object){
      if(!object._outputConections){
        object._outputConections = []
      }
      object._outputConections.push(this)
      this._watchObject(object)
    }
    this._source = object
  }
  _setTarget(object: fabric.Object){
    if(this._target){
      this._unwatchObject(this._target)
      this._target._inputConections.splice(this._target._inputConections.indexOf(this),1)
      if(this._source){
        this._source.connections.splice(this._source.connections.indexOf(this._target.id),1)
      }
    }

    if(object) {
      if (!object._inputConections) {
        object._inputConections = []
      }
      object._inputConections.push(this)
      this._watchObject(object)
    }
    this._target = object
  }
  setSource(value: fabric.Object | string){
    if(value.constructor === String){
      let id = value as string
      if(this.canvas){
        let object = this.canvas._objects.find(o=> o.id === id)
        if(object){
          this._setSource(object)
        }
      }
    }
    else{
      let object = value as fabric.Object
      if(!object.id){
        object.id = object.type + Date.now()
      }
      this.source = object.id

      this._setSource(value as fabric.Object)
    }
    this.updateLinePoints()
  }
  setTarget(value: fabric.Object | string){
    if(value.constructor === String){
      let id = value as string
      if(this.canvas){
        let object = this.canvas._objects.find(o=> o.id === id)
        if(object){
          this._setTarget(object)
        }
      }
    }
    else{
      let object = value as fabric.Object
      if(!object.id){
        object.id = object.type + Date.now()
      }
      this.target = object.id
      this._setTarget(value as fabric.Object)
    }
    this.updateLinePoints()
  }

  // Convert object properties to be included
  toObject(propertiesToInclude: string[] = []): fabric.IObjectOptions {
    return fabric.Object.prototype.toObject.call(this,[ ...connectionOwnProperties, ...propertiesToInclude]);
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render (ctx: CanvasRenderingContext2D) {

    ctx.beginPath();

    let p = this.calcLinePoints();

    let isRounded = true;
    /* "magic number" for bezier approximations of arcs (http://itc.ktu.lt/itc354/Riskus354.pdf) */
    let k = 1 - 0.5522847498;

    let rx = isRounded ? 10 : 0, ry = isRounded ? 10 : 0
    let x = p.x1
    let y = p.y1
    let w = p.x2 - p.x1
    let w2 = w/2
    let h = p.y2 - p.y1
    let h2 = h/2
    let ymod = 1, xmod = 1

    let mindist = Math.min(Math.abs(w) - 6,Math.abs(h) - 6)
    if(mindist < 0){
      ry = rx = 0
    }
    else if (mindist < ry * 2){
      ry = rx = mindist/2
    }

    ctx.beginPath();

    ctx.moveTo(p.x1, p.y1);

    switch(this.orientation){
      case "horizontal": {

        if(h< 0){
          ry = -ry
        }
        if(w< 0){
          rx = -rx
          xmod = -1
        }

        let arrowSize = Math.max(0,Math.min(this.cornerSize,Math.abs(w)/2 - 4 ))

        ctx.lineTo(x + w2 - rx, y);
        isRounded && ctx.bezierCurveTo(x + w2 - k * rx , y, x + w2, y + k * ry , x + w2, y + ry );

        ctx.lineTo(x + w2, y + h - ry );
        isRounded && ctx.bezierCurveTo(x + w2, y + h - k * ry , x + w2 + k * rx, y + h, x + w2 + rx, y + h);

        ctx.lineTo(p.x2, p.y2);
        ctx.moveTo(p.x2, p.y2);
        ctx.lineTo(p.x2 - arrowSize * xmod, p.y2 - arrowSize);
        ctx.moveTo(p.x2, p.y2);
        ctx.lineTo(p.x2 - arrowSize  * xmod, p.y2 + arrowSize);
        break;
      }
      case "vertical": {

        if(w < 0){
          rx = -rx
        }
        if(h < 0){
          ry = -ry
          ymod = -1
        }
        let arrowSize = Math.max(0,Math.min(this.cornerSize,Math.abs(h)/2 - 4 ))

        ctx.lineTo(x, y + h2 - ry);
        isRounded && ctx.bezierCurveTo(x, y + h2 - k * ry, x + k * rx, y + h2, x + rx, y + h2);

        ctx.lineTo(x + w - rx, y + h2);
        isRounded && ctx.bezierCurveTo(x + w - k * rx, y + h2, x + w, y + h2 + k * ry, x + w, y + h2 + ry);

        ctx.lineTo(p.x2, p.y2);
        ctx.moveTo(p.x2, p.y2);
        ctx.lineTo(p.x2 - arrowSize, p.y2 - arrowSize * ymod);
        ctx.moveTo(p.x2, p.y2);
        ctx.lineTo(p.x2 + arrowSize, p.y2 - arrowSize * ymod);
      }
      case "straight": {
        ctx.lineTo(p.x2, p.y2);
      }
    }

    ctx.lineWidth = this.strokeWidth;

    let origStrokeStyle = ctx.strokeStyle;
    ctx.strokeStyle = this.stroke || ctx.fillStyle;
    this.stroke && this._renderStroke(ctx);
    ctx.strokeStyle = origStrokeStyle;
  }
}

fabric.Connection = FabricConnection



let fabricObjectConnectionMixin: any = {

  updateConnections(){
    for(let connection of this.connections){
      let line = new fabric.Connection({
        source: this,
        target: this.canvas._objects.find( (o: fabric.Object)  => o.id === connection),
        fill: 'red'
      })
      this.canvas?.add(line)
    }
  }
}

Object.assign(fabric.Object.prototype,fabricObjectConnectionMixin)



// Augment the fabric namespace to include Table
declare module "fabric" {
  export namespace fabric {

    /**
     * Additional Table Intilization properties
     */
    interface IObjectOptions {
      connections?: string[],
    }

    /**
     * Additional Table Intilization properties
     */
    export interface ConnectionOptions extends fabric.IObjectOptions {
      source: fabric.Object | string,
      target: fabric.Object | string,
    }

    class Connection extends FabricConnection {}
  }
}