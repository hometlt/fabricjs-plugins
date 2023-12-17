/**
 * This code extends the fabric.Canvas class with additional methods and event handlers to enable drawing mode on the canvas.
 * It uses a mixin pattern to keep the drawing-related functionality separate and easily applicable to any fabric.Canvas instance.
 */
import {fabric} from "fabric"

// Define a mixin for adding drawing functionality to a fabric.Canvas instance
const CanvasDrawingMixin = {
    // Default drawing class is fabric.Rect, but it can be customized
    drawingClass: fabric.Rect,

    /**
     * Enable drawing mode on the canvas
     * @param klass - The object type which will be created on mousedown
     */
    enableDrawing (klass: (options: any) => fabric.Object){
        // If a custom drawing class is provided, use it
        if(klass){
            this.drawingClass = klass;
        }

        // Disable object selection, discard active object, and render the canvas
        this.disableSelection()
        this.disablePanning()
        this.discardActiveObject()
        this.renderAll()

        // Add event listeners for mouse events during drawing
        this.on('mouse:down', this._tableDrawingMouseDown);
        this.on('mouse:move', this._tableDrawingMouseMove);
        this.on('mouse:up',this._tableDrawingMouseUp );
    },

    disablePanning (){
        this.off('mouse:down', this._handModeMouseDown);
        this.off('mouse:move', this._handModeMouseMove);
        this.off('mouse:up',this._handModeMouseUp );
    },
    enablePanning (){
        this.disableSelection()
        this.disableDrawing()
        this.discardActiveObject()
        this.renderAll()
        this.on('mouse:down', this._handModeMouseDown);
        this.on('mouse:move', this._handModeMouseMove);
        this.on('mouse:up',this._handModeMouseUp );
    },

    /**
     * Disable drawing mode
     */
    disableDrawing(){
        // Enable object selection and remove drawing event listeners
        this.off('mouse:down', this._tableDrawingMouseDown);
        this.off('mouse:move', this._tableDrawingMouseMove);
        this.off('mouse:up',this._tableDrawingMouseUp );
    },
    disableSelection (){
        this.selection = false
    },
    enableSelection (){
        this.disablePanning()
        this.disableDrawing()
        this.selection = true
    },

    /**
     * Check if drawing mode is currently enabled
     */
    isDrawing(){
        return !!this._drawingX
    },

    // Event handler for mouse down during drawing
    _tableDrawingMouseDown(o: fabric.IEvent){
        // If there is an active object, do nothing
        if(this._activeObject){
            return;
        }
        let pointer = this.getPointer(o.e);
        this._drawingX = pointer.x;
        this._drawingY = pointer.y;
    },

    // Event handler for mouse move during drawing
    _tableDrawingMouseMove(o: fabric.IEvent<MouseEvent>){
        // If drawing mode is not enabled, do nothing
        if (!this.isDrawing()) return;

        let pointer = this.getPointer(o.e);
        let x = pointer.x, y = pointer.y

        // If drawing object doesn't exist, create and add it to the canvas
        if(!this._drawing){
            this._drawing = new this.drawingClass({
                left: this._drawingX,
                top: this._drawingY,
                width: x- this._drawingX,
                height: y- this._drawingY
            });
            this.add(this._drawing);
        }

        // Adjust the position and dimensions of the drawing object
        if(this._drawingX>x){
            this._drawing.set({ left: x });
        }
        if(this._drawingY>y){
            this._drawing.set({ top: y });
        }
        this._drawing.set({
            width: Math.abs(x - this._drawingX),
            height: Math.abs(y - this._drawingY)
        })

        this.renderAll();
    },

    // Event handler for mouse up during drawing
    _tableDrawingMouseUp(){
        // If no drawing object exists, do nothing
        if(!this._drawing){
            return
        }

        // Set coordinates for the drawing object, trigger events, and set it as active
        this._drawing.setCoords()
        this.fire('object:placed', { target: this._drawing });
        this._drawing.fire('placed');
        this.setActiveObject(this._drawing)

        // Clean up drawing-related properties
        delete this._drawing;
        delete this._drawingX;
        delete this._drawingY;
    },


    _handModeMouseMove (e: fabric.IEvent<MouseEvent>) {
        if(!this._handModeData){
            return
        }
        let event = e.e
        this._handModeData.state = "move";

        if (event.pageY === this._handModeData.dragCursorPosition.y && event.pageX === this._handModeData.dragCursorPosition.x) {
            return;
        }

        let scroll = {x: this.viewportTransform[4], y: this.viewportTransform[5]};

        let newScroll = {
            x: scroll.x - (this._handModeData.dragCursorPosition.x - event.pageX),
            y: scroll.y - (this._handModeData.dragCursorPosition.y - event.pageY)
        };

        /*  todo need to add some restrictions later
               //Math.max(Math.min(0,newScroll.x),-dims.width);
               //Math.max(Math.min(0,newScroll.y),-dims.height);
               */
        this.viewportTransform[4] = newScroll.x;
        this.viewportTransform[5] = newScroll.y;

        this.fire('viewport:translate',{x: this.viewportTransform[4], y : this.viewportTransform[5]});

        this.renderAll();
        for (let i = 0, len = this._objects.length; i < len; i++) {
            this._objects[i].setCoords();
        }

        this._handModeData.dragCursorPosition.y = event.pageY;
        this._handModeData.dragCursorPosition.x = event.pageX;
    },
    _handModeMouseUp () {
        delete this._handModeData;
    },
    _handModeMouseDown (e: fabric.IEvent<MouseEvent>) {

        let event = e.e
        this._handModeData = {
            state: "down",
            dragCursorPosition:  {
                y: event.pageY,
                x: event.pageX
            }
        }
    }
}

// Add the drawing mixin to the fabric.Canvas prototype
Object.assign(fabric.Canvas.prototype, CanvasDrawingMixin)

/**
 * Augment declarations to add custom methods to fabric.Canvas interface
 */
declare module "fabric" {
    namespace fabric {
        interface Canvas {
            drawingClass : (options: any) => fabric.Object
            disableDrawing(): void;
            isDrawing(): boolean;
            _tableDrawingMouseDown(o: fabric.IEvent): void;
            _tableDrawingMouseMove(o: fabric.IEvent): void;
            _tableDrawingMouseUp(): void;
            enableDrawing(klass:  (new (options: any) => fabric.Object)): void;
        }
    }
}