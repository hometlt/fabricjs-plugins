import {fabric} from "fabric";

function setOptions (options: any) {
    let properties = Object.keys(options)
    for (let prop in options) {
        if(!this.propertyApplyOrder?.includes(prop)) {
            this._set(prop, options[prop]);
        }
    }
    if(this.propertyApplyOrder){
        for(let prop of this.propertyApplyOrder){
            if(properties.includes(prop)){
                this._set(prop, options[prop]);
            }
        }
    }
}

/**
 * Extends FabricJS Objects functionality. Helps to work with custom Properties
 */
const ObjectOptionsMixin = {

    processing: true,
    set: function(key: any, value: any) {
        if (typeof key === 'object') {
            this._setObject(key);
            if(this.onSet && !this.onSetRunning) {
                this.onSetRunning = true
                this.onSet(key)
                delete this.onSetRunning
            }
        }
        else {
            this._set(key, value);
            if(this.onSet && !this.onSetRunning) {
                this.onSetRunning = true
                this.onSet({[key]: value})
                delete this.onSetRunning
            }
        }
        return this;
    },
    setOptions: function(options: any) {
        this._setOptions(options);
        if(this.onSet && !this.onSetRunning) {
            this.onSetRunning = true
            this.onSet(options)
            delete this.onSetRunning
        }
        this._initGradient(options.fill, 'fill');
        this._initGradient(options.stroke, 'stroke');
        this._initPattern(options.fill, 'fill');
        this._initPattern(options.stroke, 'stroke');
    },

    _setOptions: setOptions ,

    _setObject: setOptions,

    _set(key: string, value: any) {
        let shouldConstrainValue = (key === 'scaleX' || key === 'scaleY'),
            isChanged = this[key] !== value, groupNeedsUpdate = false;

        if (shouldConstrainValue) {
            value = this._constrainScale(value);
        }
        if (key === 'scaleX' && value < 0) {
            this.flipX = !this.flipX;
            value *= -1;
        }
        else if (key === 'scaleY' && value < 0) {
            this.flipY = !this.flipY;
            value *= -1;
        }
        else if (key === 'shadow' && value && !(value instanceof fabric.Shadow)) {
            value = new fabric.Shadow(value);
        }
        else if (key === 'dirty' && this.group) {
            this.group.set('dirty', value);
        }

        let setter = '__set' + key
        if(this[setter]){
            this[setter](value)
        }
        else{
            this[key] = value;
        }

        if (isChanged) {
            groupNeedsUpdate = this.group && this.group.isOnACache();
            if (this.cacheProperties.indexOf(key) > -1) {
                this.dirty = true;
                groupNeedsUpdate && this.group.set('dirty', true);
            }
            else if (groupNeedsUpdate && this.stateProperties.indexOf(key) > -1) {
                this.group.set('dirty', true);
            }
        }
        return this;
    },

    toDatalessObject (propertiesToInclude: string[]) {
        let object = this.toObject(propertiesToInclude)
        delete object["version"]
        let defaults = this.getDefaultProperties()
        for(let property in object){
            if(property === "type"){
                continue
            }
            if(defaults[property] ){
                if(object[property] === defaults[property]){
                    delete object[property]
                }
            }
            else{
                if(object[property] === fabric.Rect.prototype[property]){
                    delete object[property]
                }
            }
        }
        return object
    },

    getDefaultProperties(){
        return this.defaultProperties || {}
    }
}
Object.assign(fabric.Object.prototype,ObjectOptionsMixin)


/**
 * Augment declarations to add custom methods to fabric.Canvas interface
 */
declare module "fabric" {
    namespace fabric {
        interface IObjectOptions {
            id?: string
            subTargetCheck?: boolean
        }
        interface Object {
            id: string,
            _onSetRunning?: boolean
            propertyApplyOrder?: string[]
            onSet (options: {[key: string] : any}): void

            stateProperties: string[]
            cacheProperties: string[]
            group: fabric.Group
            _setObject(options: any):void
            _setOptions(options: any):void
            _initGradient(options: any,property: string):void
            _initPattern(options: any,property: string):void
            _constrainScale(value: number):void
            [index: string]: any
        }
    }
}