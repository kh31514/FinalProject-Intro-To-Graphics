import {ASerializable} from "../../../base";
import {AGraphicElement, AGraphicGroup} from "../../../rendering";
import {Mat4} from "../../../math";
import * as THREE from "three";
import {ASVGModel} from "./ASVGModel";
import {SVGAsset} from "../SVGAsset";

@ASerializable("ASVGGraphic")
export class ASVGGraphic extends AGraphicGroup{
    _svgObject!:THREE.Object3D;
    svgRootNode!:THREE.Object3D;
    get svgObject():THREE.Object3D{
        return this._svgObject;
    }

    protected constructor(svgSourceObject:THREE.Object3D) {
        super();
        this._svgObject=svgSourceObject.clone();
        this.threejs.add(svgSourceObject);
    }

    static Create(svgAsset:SVGAsset){
        let svgObj = svgAsset.getNewSceneObject(true);
        let group = new THREE.Group();
        group.matrixAutoUpdate=false;
        group.add(svgObj);
        let newNode = new this(group);
        newNode.svgRootNode = svgObj;
        return newNode;
    }

    setSourceTransform(mat:Mat4){
        mat.assignTo(this.svgRootNode.matrix);
    }

    // static Create(svgSourceObject:THREE.Object3D){
    //     return new this(svgSourceObject);
    // }
}
