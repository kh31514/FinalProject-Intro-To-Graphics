import {V2, Mat3, Mat4, NodeTransform2D, Vec2} from "../anigraph";
import {
    ArrayEqualTo,
    ArrayCloseTo,
    MatrixEqual,
    VecEqual,
    VertexArray2DCircToBeCloseTo,
    VertexArray2DToBeCloseTo,
} from "./helpers/TestHelpers";
expect.extend(ArrayEqualTo);
expect.extend(ArrayCloseTo);
expect.extend(VertexArray2DToBeCloseTo);
expect.extend(MatrixEqual);
expect.extend(VecEqual);
expect.extend(VertexArray2DCircToBeCloseTo);


describe("NodeTransformTests", () => {

    function testTransform(transform, name){
        return test(`NodeTransform2D Test: ${name}`, () => {
            let mat3 = transform.getMatrix();
            let newTransform = NodeTransform2D.FromTransformationInterface(mat3);
            expect(newTransform.position.elements).ArrayCloseTo(transform.position.elements);
            expect(newTransform.anchor.elements).ArrayCloseTo(transform.anchor.elements);
            expect((newTransform.rotation-transform.rotation)%(2*Math.PI)).toBeCloseTo(0);
            expect(newTransform._scale.elements).ArrayCloseTo(transform._scale.elements);
        });
    }

    // testTransform(new NodeTransform2D(Vec2.Random()), "Position 1");
    // testTransform(new NodeTransform2D(Vec2.Random()), "Position 2");
    testTransform(new NodeTransform2D(undefined, Math.random()*Math.PI*2), "Rotation 1");
    testTransform(new NodeTransform2D(undefined, Math.random()*Math.PI*2), "Rotation 2");
    testTransform(new NodeTransform2D(undefined, undefined, Vec2.Random()), "Scale 1");
    testTransform(new NodeTransform2D(undefined, undefined, Vec2.Random()), "Scale 2");

    testTransform(new NodeTransform2D(Vec2.Random(), undefined, Vec2.Random()), "Position Scale 1");
    testTransform(new NodeTransform2D(Vec2.Random(), undefined, Vec2.Random()), "Position Scale 2");

    testTransform(new NodeTransform2D(Vec2.Random(), Math.random()*Math.PI*2), "Position Rotation 1");
    testTransform(new NodeTransform2D(Vec2.Random(), Math.random()*Math.PI*2), "Position Rotation 2");

    testTransform(new NodeTransform2D(undefined, Math.random()*Math.PI*2, Vec2.Random()), "Scale Rotation 1");
    testTransform(new NodeTransform2D(undefined, Math.random()*Math.PI*2, Vec2.Random()), "Scale Rotation 2");

    for(let i=0;i<50;i++){
        testTransform(new NodeTransform2D(Vec2.Random(), Math.random()*Math.PI*2, Vec2.Random()), `Position Rotation Scale ${i}`);
    }

});
