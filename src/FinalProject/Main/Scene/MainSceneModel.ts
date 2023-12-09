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

<<<<<<< HEAD
import {AMaterialManager, AppState, Color, GetAppState, NodeTransform3D, Particle3D, V3} from "../../../anigraph";
import {ABasicSceneModel} from "../../../anigraph/starter";
import {AddExampleControlPanelSpecs} from "../../../ControlPanelExamples";
import {BaseSceneModel, CharacterModel} from "../../HelperClasses";
import {CustomNode1Model} from "../Nodes/CustomNode1";
import { BillboardParticleSystemModel } from "../Nodes/BillboardParticleSystem";
import {UpdateGUIJSX, UpdateGUIJSXWithCameraPosition} from "../../Examples/GUIHelpers";
import {ExampleParticleSystemModel, TerrainModel} from "../../Examples";

/**
 * This is your Main Model class. The scene model is the main data model for your application. It is the root for a
 * hierarchy of models that make up your scene/
 */
export class MainSceneModel extends BaseSceneModel{
    billboardParticles!:BillboardParticleSystemModel;


    async LoadExampleModelClassShaders() {

        /**
         * Some custom models can have their own shaders (see implementations for details)
         * Which we can load to the model class.
         */
        await BillboardParticleSystemModel.LoadShaderModel();
    }

    async LoadExampleTextures(){
        /**
         * Let's load some example textures
         */
        await this.loadTexture("./images/gradientParticle.png", "particle")
        // await ExampleParticleSystemModel.LoadShaderModel();
        // this.materials.setMaterialModel("textured", await ABasicShaderModel.CreateModel("basic"));
    }
=======
    /**
     * Optionally add some app state here. Good place to set up custom control panel controls.
     * @param appState
     */
    initAppState(appState: AppState): void {

    }

>>>>>>> origin

    async PreloadAssets() {
        await super.PreloadAssets();
        await this.LoadExampleTextures();
        await this.LoadExampleModelClassShaders()

        await this.LoadCursorTexture();
        let appState = GetAppState();
<<<<<<< HEAD
        await appState.loadShaderMaterialModel("rgba");
        await this.LoadExampleTextures();
        await this.LoadExampleModelClassShaders()
    }

    CreateBilboardParticleSystem(nParticles:number){
        // BillboardParticleSystemModel.AddParticleSystemControls();
        /**
         * And now let's create our particle system
         */

        this.billboardParticles = BillboardParticleSystemModel.Create(nParticles, this.getTexture("particle"));
        return this.billboardParticles
    }

    addExampleBilboardParticleSystem(nParticles:number=50){
        this.addChild(this.CreateBilboardParticleSystem(nParticles))
=======
        await appState.loadShaderMaterialModel("simpletexture");
        await appState.addShaderMaterialModel("blinnphong", ABlinnPhongShaderModel);

        await this.loadTexture("./images/terrain/rock.jpg", "rock")
>>>>>>> origin
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

<<<<<<< HEAD
    /**
     * Use this function to initialize the content of the scene.
     * Generally, this will involve creating instances of ANodeModel subclasses and adding them as children of the scene:
     * ```
     * let myNewModel = new MyModelClass(...);
     * this.addChild(myNewModel);
     * ```
     *
     * You may also want to add tags to your models, which provide an additional way to control how they are rendered
     * by the scene controller. See example code below.
     */
    initScene(){
        this.addExampleBilboardParticleSystem();
        let appState = GetAppState();
        //let custommodel = CustomNode1Model.CreateTriangle();
        // let mat = appState.CreateShaderMaterial("rgba");
        // custommodel.setMaterial(mat);
        // this.addChild(custommodel);
=======

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
>>>>>>> origin
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

        this.billboardParticles.timeUpdate(t, this.camera);

        /**
         * If you want to update the react GUI components
         */
        // GetAppState().updateComponents();

    }


}