/**
 * @file Main scene model
 * @description Main model for your application
 */

import {AMaterialManager, AppState, Color, GetAppState, NodeTransform3D, Particle3D, V3} from "../../../anigraph";
import {ABasicSceneModel} from "../../../anigraph/starter";
import {AddExampleControlPanelSpecs} from "../../../ControlPanelExamples";
import {BaseSceneModel} from "../../HelperClasses";
import {CustomNode1Model} from "../Nodes/CustomNode1";

/**
 * This is your Main Model class. The scene model is the main data model for your application. It is the root for a
 * hierarchy of models that make up your scene/
 */
export class MainSceneModel extends BaseSceneModel{

    async PreloadAssets(): Promise<void> {
        super.PreloadAssets();
        let appState = GetAppState();
        await appState.loadShaderMaterialModel("rgba");

    }



    /**
     * This will add variables to the control pannel
     * @param appState
     */
    initAppState(appState:AppState){
        /**
         * The function below shows exampled of very general ways to use app state and the control panel.
         */
        AddExampleControlPanelSpecs(this);

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
        let appState = GetAppState();
        let custommodel = CustomNode1Model.CreateTriangle();
        let mat = appState.CreateShaderMaterial("rgba");
        custommodel.setMaterial(mat);
        this.addChild(custommodel);
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

        /**
         * Update stuff here
         */

    }
};
