import {
    ACameraModel, AInteractionEvent,
    AppState, GetAppState, Quaternion, ATriangleMeshModel,
    NodeTransform3D, Particle3D,
    V3, Vec2, VertexArray3D
} from "src/anigraph";
import { BillboardParticleSystemModel } from "../Nodes/BillboardParticleSystem";
import { ParticleSystemModel } from "../Nodes/ParticleSystem";
import { ExampleSceneModel } from "src/FinalProject/Examples/Apps/ExampleSceneModel";
import { ABlinnPhongShaderModel } from "src/anigraph/rendering/shadermodels";
import {ExampleParticleSystemModel, TerrainModel} from "../../Examples";
import {CharacterModel} from "../../HelperClasses";

export class MainSceneModel extends ExampleSceneModel {
    billboardWaterfallParticles!: BillboardParticleSystemModel;
    billboardMistParticles!: BillboardParticleSystemModel;
    billboardMistParticles2!: BillboardParticleSystemModel;
    waterSurfaceParticles!: ParticleSystemModel;

    /**
     * Optionally add some app state here. Good place to set up custom control panel controls.
     * @param appState
     */
    initAppState(appState: AppState): void {

    }

    async LoadExampleModelClassShaders() {

        /**
         * Some custom models can have their own shaders (see implementations for details)
         * Which we can load to the model class.
         */
        await TerrainModel.LoadShaderModel();
        await CharacterModel.LoadShaderModel();
        await ExampleParticleSystemModel.LoadShaderModel();
        await BillboardParticleSystemModel.LoadShaderModel();
        await ParticleSystemModel.LoadShaderModel();
    }

    async PreloadAssets() {
        await super.PreloadAssets();
        await this.LoadExampleTextures();
        await this.LoadExampleModelClassShaders()

        await this.LoadCursorTexture();
        let appState = GetAppState();
        await appState.loadShaderMaterialModel("simpletexture");
        await appState.addShaderMaterialModel("blinnphong", ABlinnPhongShaderModel);

        await this.loadTexture("./images/terrain/rock.jpg", "rock");
        await this.loadTexture("./images/waterfallParticle.png", "waterfallParticle");
        await this.loadTexture("./images/mistParticle.png", "mistParticle");
        await this.loadTexture("./images/waterSurfaceParticle.png", "waterSurfaceParticle");
    }

    CreateBilboardParticleSystem(nParticles:number){
        this.billboardWaterfallParticles = BillboardParticleSystemModel.Create(nParticles, this.getTexture("waterfallParticle"));
        return this.billboardWaterfallParticles
    }

    addExampleBilboardParticleSystem(nParticles:number=30){
        this.addChild(this.CreateBilboardParticleSystem(nParticles))
    }

    CreateBilboardParticleSystem2(nParticles:number){
        this.billboardMistParticles = BillboardParticleSystemModel.Create(nParticles, this.getTexture("mistParticle"));
        return this.billboardMistParticles
    }

    addExampleBilboardParticleSystem2(nParticles:number=30){
        this.addChild(this.CreateBilboardParticleSystem2(nParticles))
    }

    CreateBilboardParticleSystem3(nParticles:number){
        this.waterSurfaceParticles = ParticleSystemModel.Create(nParticles, this.getTexture("waterSurfaceParticle"));
        return this.waterSurfaceParticles
    }

    addExampleBilboardParticleSystem3(nParticles:number=80){
        this.addChild(this.CreateBilboardParticleSystem3(nParticles))
    }

    CreateBilboardParticleSystem4(nParticles:number){
        this.billboardMistParticles2 = BillboardParticleSystemModel.Create(nParticles, this.getTexture("mistParticle"));
        return this.billboardMistParticles2
    }

    addExampleBilboardParticleSystem4(nParticles:number=30){
        this.addChild(this.CreateBilboardParticleSystem4(nParticles))
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

        // adding particle system
        this.addExampleBilboardParticleSystem();
        this.addExampleBilboardParticleSystem2();
        this.addExampleBilboardParticleSystem3();
        this.addExampleBilboardParticleSystem4();

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
        let appState = GetAppState();
        let newModel = this.CreateNewClickModel(0.1);
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
        this.addChild(newModel);
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

        this.waterSurfaceParticles.timeUpdate(t, this.camera, "waterSurface");
        this.billboardWaterfallParticles.timeUpdate(t, this.camera, "waterfall");
        this.billboardMistParticles.timeUpdate(t, this.camera, "mist");
        this.billboardMistParticles2.timeUpdate(t, this.camera, "mist2");


        /**
         * If you want to update the react GUI components
         */
        // GetAppState().updateComponents();

    }


}