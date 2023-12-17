import {fabric} from "fabric";


let fabricRectMixin: any = {

  /**
   * customizable FabricJS properties
   */
  fill:'rgb(88,47,190)',
  stroke: 'rgb(88,47,190)',
  cornerColor:  '#582fbe',
  strokeWidth: 2,
  strokeUniform:  true,
  noScaleCache: false,
  connections: null,
  _connections: null,

  initialize (options: fabric.IRectOptions) {
    this.callSuper("initialize",options)
    this.controls = this._getControls();
  },

  // Retrieves the controls for the table
  _getControls() {
    //@ts-ignore
    let cursorStyleHandler = fabric.controlsUtils.scaleCursorStyleHandler
    let changeSize = fabric.controlsUtils.changeSize;
    //@ts-ignore
    let dragHandler = fabric.controlsUtils.dragHandler

    return {
      tl: new fabric.Control({x: -0.5, y: -0.5, cursorStyleHandler, actionHandler: changeSize}),
      tr: new fabric.Control({x: 0.5, y: -0.5, cursorStyleHandler, actionHandler: changeSize}),
      bl: new fabric.Control({x: -0.5, y: 0.5, cursorStyleHandler, actionHandler: changeSize}),
      br: new fabric.Control({x: 0.5, y: 0.5, cursorStyleHandler, actionHandler: changeSize})
    }
  },
  toObject (propertiesToInclude: string[]) {
    return this.callSuper('toObject', ['id','connections'].concat(propertiesToInclude));
  }
}
Object.assign(fabric.Rect.prototype,fabricRectMixin)