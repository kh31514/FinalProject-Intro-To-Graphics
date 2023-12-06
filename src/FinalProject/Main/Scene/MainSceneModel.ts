/**
 * @file Main scene model
 * @description Main model for your application
 */

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

    async PreloadAssets(): Promise<void> {
        super.PreloadAssets();
        let appState = GetAppState();
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
    }



    /**
     * This will add variables to the control pannel
     * @param appState
     */
    initAppState(appState:AppState){
        /**
         * The function below shows exampled of very general ways to use app state and the control panel.
         */
        // AddExampleControlPanelSpecs(this);

        /**
         * Optionally, you can add functions that will tell what should be displayed in the React portion of the GUI. Note that the functions must return JSX code, which means they need to be written in a .tsx file. That's why we've put them in a separate file.
         */
        // appState.setReactGUIContentFunction(UpdateGUIJSX);
        // appState.setReactGUIBottomContentFunction(UpdateGUIJSXWithCameraPosition);

    }

    initCamera(...args: any[]) {
        const appState = GetAppState();

        // You can change your camera parameters here
        this.initPerspectiveCameraFOV(Math.PI/2, 1.0)

        // You can set its initial pose as well
        this.camera.setPose(NodeTransform3D.LookAt(V3(0,0,1), V3(), V3(0,1,0)))
    }

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
    }


    /**
     * Update the model with time here.
     * If no t is provided, use the model's time.
     * If t is provided, use that time.
     * You can decide whether to couple the controller's clock and the model's. It's usually good practice to have the model run on a separate clock.
     * @param t
     */
    timeUpdate(t?: number):void;
    timeUpdate(...args:any[])
    {
        let t = this.clock.time;
        if(args != undefined && args.length>0){
            t = args[0];
        }

        this.billboardParticles.timeUpdate(t, this.camera);

        /**
         * If you want to update the react GUI components
         */
        // GetAppState().updateComponents();

    }
};
