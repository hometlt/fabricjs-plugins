/**
 * Augment declarations to add custom methods to fabric.Canvas interface
 */
declare module "fabric" {
    namespace fabric {
        interface IObjectOptions {
            id?: string;
            subTargetCheck?: boolean;
        }
        interface Object {
            id: string;
            _onSetRunning?: boolean;
            propertyApplyOrder?: string[];
            onSet(options: {
                [key: string]: any;
            }): void;
            stateProperties: string[];
            cacheProperties: string[];
            group: fabric.Group;
            _setObject(options: any): void;
            _setOptions(options: any): void;
            _initGradient(options: any, property: string): void;
            _initPattern(options: any, property: string): void;
            _constrainScale(value: number): void;
            [index: string]: any;
        }
    }
}
export {};
