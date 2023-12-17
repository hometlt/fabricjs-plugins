import { fabric } from "fabric";
import { IPoint } from "fabric/fabric-impl";
/**
 * FabricJS Table Object
 */
declare class FabricConnection extends fabric.Line {
    type: string;
    /**
     * customizable FabricJS properties
     */
    fill: string;
    stroke: string;
    cornerColor: string;
    cornerSize: number;
    strokeWidth: number;
    selectable: boolean;
    evented: boolean;
    orientation: string;
    _source: fabric.Object;
    _target: fabric.Object;
    getConnectionPoint(target: fabric.Object, side: string): IPoint;
    updateLinePoints(): void;
    constructor(options: Partial<fabric.ConnectionOptions>);
    unsubscribe(): void;
    _watchObject(object: fabric.Object): void;
    _unwatchObject(object: fabric.Object): void;
    _setSource(object: fabric.Object): void;
    _setTarget(object: fabric.Object): void;
    setSource(value: fabric.Object | string): void;
    setTarget(value: fabric.Object | string): void;
    toObject(propertiesToInclude?: string[]): fabric.IObjectOptions;
    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render(ctx: CanvasRenderingContext2D): void;
}
declare module "fabric" {
    namespace fabric {
        /**
         * Additional Table Intilization properties
         */
        interface IObjectOptions {
            connections?: string[];
        }
        /**
         * Additional Table Intilization properties
         */
        interface ConnectionOptions extends fabric.IObjectOptions {
            source: fabric.Object | string;
            target: fabric.Object | string;
        }
        class Connection extends FabricConnection {
        }
    }
}
export {};
