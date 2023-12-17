import {fabric} from "fabric";

export function getProportions (photo: any, container: any) {
  let w = photo.naturalWidth || photo.width
  let h = photo.naturalHeight || photo.height

  let scaleX = container.width && container.width / w || 999
  let scaleY = container.height && container.height / h || 999
  let scale = Math.min(scaleX, scaleY)
  let output = {
    scale: scale,
    width: w * scale,
    height: h * scale
  }
  return output;
}

const CanvasStretchableMixin: any = {
  onResize: function () {
    let _scale = Math.min(1, 800 / this.width);
    // this.setZoom(_scale);
    this.setDimensions({width: this.width, height: this.height});
  },
  getCenter: function () {
    return {
      top: (this.originalHeight || this.getHeight()) / 2,
      left: (this.originalWidth || this.getWidth()) / 2
    };
  },
  setOriginalSize: function (w: number | HTMLImageElement, h: number) {
    if(w.constructor === Number){
      this.originalWidth = w
      this.originalHeight = h
    }
    else{
      let image = w as HTMLImageElement
      this.originalWidth = image.naturalWidth
      this.originalHeight = image.naturalHeight
    }
    this.fire('resized')
    return this;
  },
  setOriginalWidth: function (value: number) {
    this.originalWidth = value;
    if (!this.stretchable) {
      this.setWidth(value);
    }
    this.fire('resized')
  },
  setOriginalHeight: function (value: number) {
    this.originalHeight = value;
    if (!this.stretchable) {
      this.setHeight(value);
    }
    this.fire('resized')
  },
  getOriginalSize() {
    return {
      width: this.originalWidth || this.width,
      height: this.originalHeight || this.height
    }
  },
  getOriginalWidth() {
    return this.originalWidth || this.width;
  },
  getOriginalHeight() {
    return this.originalHeight || this.height;
  },
  stretchingOptions: {
    action: "resize",
    maxWidth: null,
    maxHeight: null,
    maxWidthRate: null,
    maxHeightRate: null,
    margin: null,
    marginX: null,
    marginY: null
  },
  stretchable: false,
  updateCanvasSize() {
    let options = this.stretchingOptions;
    let _parent = this.getRelativeContainer();
    if (!_parent) return;

    let marginX = options.marginX || options.margin || 0
    let marginY = options.marginY || options.margin || 0
    let w = this.getOriginalWidth()
    let h = this.getOriginalHeight()

    let _w = _parent.offsetWidth - marginX * 2,
        _h = _parent.offsetHeight - marginY * 2;
    if (options.maxWidthRate) {
      _w *= options.maxWidthRate;
    }
    if (options.maxHeightRate) {
      _w *= options.maxHeightRate;
    }
    if (options.maxWidth) {
      _w = Math.min(options.maxWidth, _w);
    }
    if (options.maxHeight) {
      _h = Math.min(options.maxHeight, _h);
    }
    if (_w <= 0 || _h <= 0) return;

    this.setDimensions({
      width: _w /*- _offset.left*/,
      height: _h /*- _offset.top*/
    });
    this.renderAll()
  },
  _onResize: function () {
    if (this.stretchable) {
      this.updateCanvasSize()
    } else {
      this.calcOffset();
    }
  },
  getRelativeContainer() {
    // if (this._scrollContainer) return this._scrollContainer;
    if (!this.wrapperEl.parentNode) return;

    function getRelativeContainer(el: HTMLElement) {
      do {
        if (window.getComputedStyle(el).position !== "static") {
          return el;
        }
        el = el.parentElement;
      } while (el);
      return document.body;
    }

    this._scrollContainer = getRelativeContainer(this.wrapperEl.parentNode);
    return this._scrollContainer;
  },
  getScrollContainer() {
    // if (this._scrollContainer) return this._scrollContainer;
    if (!this.wrapperEl.parentNode) return;

    function getScrollContainer(el: HTMLElement) {
      do {
        if (window.getComputedStyle(el).overflow !== "visible") {
          return el;
        }
        el = el.parentElement;
      } while (el);
      return document.body;
    }

    this._scrollContainer = getScrollContainer(this.wrapperEl.parentNode);
    return this._scrollContainer;
  },
  setStretchingOptions(val: any)  {
    this.stretchingOptions = val;
    if (!this.stretchable) return
    if (this.lowerCanvasEl) {
      this._onResize();
    }
  },
  setStretchable(val: boolean) {
    this.stretchable = val;
    if (!this.stretchable) return

    this.wrapperEl.style.width = "100%"
    this.wrapperEl.style.height = "100%"

    this.resizeObserver = new ResizeObserver(() => this._onResize());
    this.resizeObserver.observe(this.wrapperEl);


    if (this.lowerCanvasEl) {
      this._onResize();
    }
  },
  zoomCtrlKey: true,
  mouseWheelZoom: false,
  changeDimensionOnZoom: false,
  zoomToPointEnabled: true,
  maxZoom: 10,
  autoCenterAndZoomOut: false,
  zoomStep: 0.1,
  scaleFactor: 1.1,
  minZoom: 0.9,
  _zoomToPointNative: fabric.Canvas.prototype.zoomToPoint,
  zoomIn() {
    let point = this.getOrignalCenter();
    let scaleValue = this.getZoom() * this.scaleFactor;

    let _max = this.getMaxZoom();
    let _min = this.getMinZoomOptions().scale;
    if (scaleValue > _max) scaleValue = _max;
    if (scaleValue < _min) scaleValue = _min;

    this.zoomToPoint(point, scaleValue);
  },
  zoomOut() {
    let point = this.getOrignalCenter();
    let scaleValue = this.getZoom() / this.scaleFactor;

    let _max = this.getMaxZoom();
    let _min = this.getMinZoomOptions().scale;
    if (scaleValue > _max) scaleValue = _max;
    if (scaleValue < _min) scaleValue = _min;
    this.zoomToPoint(point, scaleValue);
  },
  setMouseWheelZoom(val: number) {
    this.mouseWheelZoom = val;
    this.on("mouse:wheel", this.wheelZoom);
  },
  zoomToPoint(point: fabric.Point, newZoom: number) {
    if (this.changeDimensionOnZoom) {
      let size = this.getOriginalSize()
      this.setDimensions({
        width: Math.round(size.width * newZoom),
        height: Math.round(size.height * newZoom)
      }, {
        // cssOnly: true
      });
    }
    this._zoomToPointNative(point, newZoom);
    this.fire('viewport:translate', {x: this.viewportTransform[4], y: this.viewportTransform[5]});
    this.fire('viewport:scaled', {scale: newZoom});
    if (this.editor) {
      this.editor.fire("viewport:scaled", {scale: newZoom, target: this});
    }
  },
  resetViewport() {
    this.viewportTransform[0] = 1;
    this.viewportTransform[3] = 1;
    this.viewportTransform[4] = 0;
    this.viewportTransform[5] = 0;
    this.renderAll();
    for (let i in this._objects) {
      this._objects[i].setCoords();
    }
  },
  getMaxZoom() {
    return this.maxZoom;
  },
  getMinZoomOptions() {
    let container;
    if (this.changeDimensionOnZoom) {
      let scrollParent = this.getScrollContainer();
      container = scrollParent || this.wrapperEl;
    } else {
      container = this.wrapperEl;
    }
    let _containerSize = {
      width: container.clientWidth,
      height: container.clientHeight
    };
    let _bgSize = {
      width: this.originalWidth || this.width,
      height: this.originalHeight || this.height
    };
    let _maxSize = {
      width: _containerSize.width * this.minZoom,
      height: _containerSize.height * this.minZoom
    };
    let size = getProportions(_bgSize, _maxSize);

    if (size.scale > 1) {
      return {
        scale: 1,
        width: this.originalWidth,
        height: this.originalHeight,
      }
    }

    return size;
  },
  centerAndZoomOut() {
    if (!this.lowerCanvasEl) {
      return;
    }
    let options = this.getMinZoomOptions();
    if (this.changeDimensionOnZoom) {
      this.setZoom(options.scale);
      let scrollParent = this.getScrollContainer();
      if (scrollParent) {
        scrollParent.scrollTop = (scrollParent.scrollHeight - scrollParent.clientHeight) / 2;
        scrollParent.scrollLeft = (scrollParent.scrollWidth - scrollParent.clientWidth) / 2;
      }
    } else {
      let _containerSize = {
        width: this.wrapperEl.clientWidth,
        height: this.wrapperEl.clientHeight
      };
      let vpt = this.viewportTransform.slice(0);
      vpt[0] = options.scale;
      vpt[3] = options.scale;
      vpt[4] = (_containerSize.width - options.width) / 2;
      vpt[5] = (_containerSize.height - options.height) / 2;

      this.setViewportTransform(vpt);
    }
  },
  centerOnObject(tag: fabric.Object) {
    let br = tag.getBoundingRect();
    let ct = this.viewportTransform;
    br.width /= ct[0];
    br.height /= ct[3];
    let size = {
      width: br.width * 1.1,
      height: br.height * 1.1
    };
    let sizeOptions = getProportions(size, this);
    let _w = (this.width / sizeOptions.scale - size.width) / 2;
    let _h = (this.height / sizeOptions.scale - size.height) / 2;
    let _l = (br.left - ct[4]) / ct[0];
    let _t = (br.top - ct[5]) / ct[3];
    let x2 = [
      sizeOptions.scale,
      0, 0,
      sizeOptions.scale,
      -_l * sizeOptions.scale + (br.width * 0.05 + _w) * sizeOptions.scale,
      -_t * sizeOptions.scale + (br.height * 0.05 + _h) * sizeOptions.scale
    ];

    this.setViewportTransform(x2);
    this.fire("viewport:scaled", {scale: sizeOptions.scale});
    this.renderAll();
  },
  wheelZoom(e: fabric.IEvent<WheelEvent>) {
    let event = e.e;

    if (!this.mouseWheelZoom || this.zoomCtrlKey && !event.ctrlKey) {
      return;
    }
//Find nearest point, that is inside image END
    let zoomStep;// = 0.1 * event.deltaY;
    if (event.deltaY < 0) {
      zoomStep = 1 + this.zoomStep;
    } else {
      zoomStep = 1 - this.zoomStep;
    }

    let cZoom = this.getZoom();
    let newZoom = cZoom * zoomStep;
    let minZoom = this.getMinZoomOptions().scale;

    let maxZoom = this.getMaxZoom()
    if (newZoom > maxZoom) {
      newZoom = maxZoom;
    }

    if (this.zoomToPointEnabled) {
      let point = new fabric.Point(event.offsetX, event.offsetY);
      let _x = this.viewportTransform[4];
      let _y = this.viewportTransform[5];

      // Find nearest point, that is inside image
      // It is needed to prevent canvas to zoom outside image
      if (this.originalWidth) {
        let _w = this.originalWidth * cZoom + _x;

        if (point.x < _x) {
          point.x = _x;
        }
        if (point.x > _w) {
          point.x = _w;
        }
      }
      if (this.originalHeight) {
        let _h = this.originalHeight * cZoom + _y;
        if (point.y < _y) {
          point.y = _y;
        }
        if (point.y > _h) {
          point.y = _h;
        }
      }

      if (minZoom > newZoom) {
        if (this.autoCenterAndZoomOut) {
          this.centerAndZoomOut();
        } else if (event.deltaY < 0) {
          this.zoomToPoint(point, newZoom);
        }
      } else {
        this.zoomToPoint(point, newZoom);
      }
    } else {
      this.setZoom(newZoom);
    }
    for (let i in this._objects) {
      this._objects[i].setCoords();
    }
    this.renderAll();
    event.stopPropagation();
    event.preventDefault();
    return false; //preventing scroll page
  },
  getOrignalCenter() {
    return {
      x: (this.width / 2) * this.viewportTransform[0] + this.viewportTransform[4],
      y: (this.height / 2) * this.viewportTransform[3] + this.viewportTransform[5]
    };
  }
}

// Add the drawing mixin to the fabric.Canvas prototype
Object.assign(fabric.Canvas.prototype, CanvasStretchableMixin)


/**
 * Augment declarations to add custom methods to fabric.Canvas interface
 */
declare module "fabric" {
  namespace fabric {
    interface Canvas {
      originalHeight: number,
      originalWidth: number,
      setOriginalSize (w: number | HTMLImageElement, h?: number): void,
      centerAndZoomOut () : void,
      zoomIn () : void,
      zoomOut () : void,
      setStretchable (val: boolean) : void,
      setMouseWheelZoom (val: boolean) : void
    }
  }
}