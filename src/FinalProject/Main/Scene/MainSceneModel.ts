import {
    ACameraModel, AInteractionEvent,
    AppState, GetAppState, Quaternion, ATriangleMeshModel,
    NodeTransform3D, Particle3D,
    V3, Vec2, VertexArray3D
} from "src/anigraph";
import {
    BillboardParticleSystemModel,
} from "src/FinalProject/Examples/Nodes";
import { ExampleSceneModel } from "src/FinalProject/Examples/Apps/ExampleSceneModel";
import { ABlinnPhongShaderModel } from "src/anigraph/rendering/shadermodels";
export class MainSceneModel extends ExampleSceneModel {
    billboardParticles!: BillboardParticleSystemModel;

    /**
     * Optionally add some app state here. Good place to set up custom control panel controls.
     * @param appState
     */
    initAppState(appState: AppState): void {

    }


    async PreloadAssets() {
        await super.PreloadAssets();
        await this.LoadExampleTextures();
        await this.LoadExampleModelClassShaders()

        await this.LoadCursorTexture();
        let appState = GetAppState();
        await appState.loadShaderMaterialModel("simpletexture");
        await appState.addShaderMaterialModel("blinnphong", ABlinnPhongShaderModel);

        await this.loadTexture("./images/terrain/rock.jpg", "rock")
    }


    initCamera() {
        super.initCamera();
        this.cameraModel = ACameraModel.CreatePerspectiveFOV(90, 1, 0.01, 10);
        this.cameraModel.setPose(
            NodeTransform3D.LookAt(
                V3(0, -1, 1),
                V3(0, 0, 0),
                V3(0, 0, 1)
            )
        )
    }


    initScene() {
        /**
         * We need to add a light before we can see anything.
         * The easiest thing is to just attach a point light to the camera.
         */
        this.addViewLight();

        /**
         * initialize terrain
         */
        this.initTerrain("rock");

        /**
         * Let's generate a random slightly bumpy terrain.
         * It's just uniform random bumps right now, nothing fancy.
         */
        this.terrain.reRollRandomHeightMap();

        /**
 * Let's add the cursor model but keep it invisible until an appropriate mode is activated
 * @type {boolean}
 */
        this.initCursorModel();
        this.cursorModel.visible = false;
    }



    CreateNewClickModel(radius: number = 0.01) {
        let appState = GetAppState();
        let newClickModel = new ATriangleMeshModel();
        let verts = VertexArray3D.Sphere(radius);
        newClickModel.setVerts(verts);
        let newModelMaterial = appState.CreateShaderMaterial("blinnphong");
        newModelMaterial.setTexture("diffuse", this.getTexture("cursor"));
        newClickModel.setMaterial(newModelMaterial);
        return newClickModel
    }


    onClick(event: AInteractionEvent) {
        console.log(event);
        console.log(event.cursorPosition)
        // TODO: transform pixel coordinates to terrain coordinates
        let pos = event.cursorPosition
        if (pos != null) {
            // need to figure out how to transform 2d point with 4D matrix??
            // transform pixels to world coordinates
            // then world coordinates -> terrain coordinates

            /**
             * Get the world coordinates of the cursor
             */
            let cursorWorldCoordinates = this.getCoordinatesForCursorEvent(event);
            console.log(cursorWorldCoordinates)
            // TODO figure out how to convert these to 3D world coordinates

            let trans = this.terrain.transform.getMat4()

            this.terrain.playerInteraction(this.terrain.heightMap.width / 2, this.terrain.heightMap.height / 2, .05)
        }

        let appState = GetAppState();
        /* let newModel = this.CreateNewClickModel(0.1);
        newModel.setTransform(
            new NodeTransform3D(
                V3(
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    0
                ).times(appState.globalScale),
                Quaternion.RotationY(-Math.PI * 0.5).times(Quaternion.RotationX(-Math.PI * 0.25))
            )

        )
        this.addChild(newModel); */
    }

    getCoordinatesForCursorEvent(event: AInteractionEvent) {
        return event.ndcCursor ?? new Vec2();
    }


    /**
     * Update the model with time here.
     * If no t is provided, use the model's time.
     * If t is provided, use that time.
     * You can decide whether to couple the controller's clock and the model's. It's usually good practice to have the model run on a separate clock.
     * @param t
     */
    timeUpdate(t?: number): void;
    timeUpdate(...args: any[]) {
        let t = this.clock.time;
        if (args != undefined && args.length > 0) {
            t = args[0];
        }

        /**
         * If you want to update the react GUI components
         */
        // GetAppState().updateComponents();

    }


}