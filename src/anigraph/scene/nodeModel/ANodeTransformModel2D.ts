import {ANodeModelSubclass} from "./NodeModelSubclass";
import {Mat3, NodeTransform2D, TransformationInterface} from "../../math";
import {BoundingBox2D, BoundingBox3D, HasBounds2D, VertexArray2D} from "../../geometry";
import {ANodeModel3D} from "./ANodeModel3D";
import {ANodeModel2D} from "./ANodeModel2D";

export class ANodeTransformModel2D extends ANodeModelSubclass<NodeTransform2D, VertexArray2D> implements HasBounds2D{
    _zValue:number=0;
    /** Get set zValue */
    set zValue(value){
        this._zValue = value;
        this.signalTransformUpdate();
    }
    get zValue(){return this._zValue;}

    constructor(verts?:VertexArray2D, transform?:NodeTransform2D, ...args:any[]) {
        super(verts, transform);
        if(!this.verts){
            this._setVerts(new VertexArray2D());
        }
    }

    get transform(): NodeTransform2D {
        return this._transform as NodeTransform2D;
    }
    setTransformToIdentity(){
        this._transform = new NodeTransform2D();
    }

    setTransform(transform:TransformationInterface){
        if(transform instanceof NodeTransform2D){
            this._transform = transform;
            return;
        }else if(transform instanceof Mat3) {
            this._transform = NodeTransform2D.FromMatrix(transform);
        }else{
            let m3 = new Mat3();
            let m4 = transform.getMat4()
            m3.m00 = m4.m00;
            m3.m10 = m4.m10;
            m3.m01 = m4.m01;
            m3.m11 = m4.m11;
            m3.c2 = m4.c3.Point3D;
            this._transform = NodeTransform2D.FromMatrix(m3);
        }
        // this.signalTransformUpdate();
    }

    /**
     * Right now, bounds are only transformed by the model's current (local) transform
     * @returns {BoundingBox2D}
     */
    getBounds(): BoundingBox2D {
        let b = this.verts.getBounds().getBoundsXY();
        b.transform = this.transform.getMatrix();
        return b;
    }

    /**
     * Right now, bounds are only transformed by the model's current (local) transform
     * @returns {BoundingBox2D}
     */
    getBounds2D(): BoundingBox2D {
        let b = this.verts.getBounds().getBoundsXY();
        b.transform = this.transform.getMatrix();
        return b;
    }

    /**
     * Right now, bounds are only transformed by the model's current (local) transform
     * @returns {BoundingBox3D}
     */
    getBounds3D(): BoundingBox3D {
        let b = this.verts.getBounds();
        b.transform = this.transform.getMat4();
        return b;
    }

    /**
     * Right now, bounds are only transformed by the model's current (local) transform
     * @returns {BoundingBox3D}
     */
    getBoundsXY(): BoundingBox2D {
        return this.getBounds();
    }

    /**
     * Returns the transform from object coordinates (the coordinate system where this.verts is
     * defined) to world coordinates
     * @returns {TransformType}
     */
    getWorldTransform():Mat3{
        let parent = this.parent;
        if(parent instanceof ANodeModel3D){
            throw new Error("Mixing 2D and 3D Node models not supported yet!")
        }
        if(parent && (parent instanceof ANodeModel2D || parent instanceof ANodeTransformModel2D)){
            // return parent.getWorldTransform().getMat4().times(this.transform.getMat4());
            return parent.getWorldTransform().times(this.transform.getMatrix());
        }else{
            return this.transform.getMatrix();
        }
    }

}