/**
 * @file Main scene model
 * @description Main model for your application
 */

import { AMaterialManager, AppState, Color, GetAppState, NodeTransform3D, Particle3D, V3 } from "../../../anigraph";
import { ABasicSceneModel } from "../../../anigraph/starter";
import { AddExampleControlPanelSpecs } from "../../../ControlPanelExamples";
import { BaseSceneModel } from "../../HelperClasses";
import { CustomNode1Model } from "../Nodes/CustomNode1";
import { UpdateGUIJSX, UpdateGUIJSXWithCameraPosition } from "../../Examples/GUIHelpers";
import { ExampleSceneModel } from "../../Examples/Apps/ExampleSceneModel"

/**
 * This is your Main Model class. The scene model is the main data model for your application. It is the root for a
 * hierarchy of models that make up your scene/
 */
export class MainSceneModel extends ExampleSceneModel {

    async PreloadAssets(): Promise<void> {
        super.LoadExampleModelClassShaders();
        let appState = GetAppState();
        // await appState.loadShaderMaterialModel("rgba");
        await this.LoadExampleTextures();
    }

    /**
     * This will add variables to the control pannel
     * @param appState
     */
    initAppState(appState: AppState) {
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
        this.initPerspectiveCameraFOV(Math.PI / 2, 1.0)

        // You can set its initial pose as well
        this.camera.setPose(NodeTransform3D.LookAt(V3(0, 0, 1), V3(), V3(0, 1, 0)))
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
    initScene() {
        // let appState = GetAppState();
        // let custommodel = CustomNode1Model.CreateTriangle();
        // let mat = appState.CreateShaderMaterial("rgba");
        // custommodel.setMaterial(mat);
        // this.addChild(custommodel);

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
};
