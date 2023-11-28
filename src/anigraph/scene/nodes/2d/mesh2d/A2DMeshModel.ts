import {ASerializable} from "../../../../base";
import {ANodeTransformModel2D} from "../../../nodeModel";
import {VertexArray2D, VertexArray3D} from "../../../../geometry";
import {NodeTransform2D} from "../../../../math";

@ASerializable("A2DMeshModel")
export class A2DMeshModel extends ANodeTransformModel2D{
    constructor(verts?:VertexArray2D, transform?:NodeTransform2D) {
        super();
        if(transform){
            this.setTransform(transform);
        }
        if(verts === undefined){
            verts = new VertexArray2D();
        }
        this._setVerts(verts);
    }


    static Create2DMeshModel(hasColors: boolean = true,
                  hasTextureCoords: boolean = true,
                  hasNormals: boolean = false, ...args:any[]){
        let verts = VertexArray2D.CreateForRendering(hasColors, hasTextureCoords, hasNormals);
        return new this(verts);
    }
}


