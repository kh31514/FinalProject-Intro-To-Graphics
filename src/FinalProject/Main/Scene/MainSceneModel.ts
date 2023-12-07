import {
    ACameraModel, AInteractionEvent,
    AppState,
    NodeTransform3D, Particle3D,
    V3, Vec2,
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
        this.initTerrain();

        /**
         * Let's generate a random slightly bumpy terrain.
         * It's just uniform random bumps right now, nothing fancy.
         */
        this.terrain.reRollRandomHeightMap();
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