import {ShaderDemoSceneModel} from "./ShaderDemoSceneModel";
import {AGLContext, AInteractionMode, Color} from "../../../../anigraph";
import {ShaderDemoInteractionMode} from "./ShaderDemoInteractionMode";
import {ExampleSceneController} from "../ExampleSceneController";

/**
 * This is your Main Controller class. The scene controller is responsible for managing user input with the keyboard
 * and mouse, as well as making sure that the view hierarchy matches the model heirarchy.
 */
export class ShaderDemoSceneController extends ExampleSceneController{
    get model():ShaderDemoSceneModel{
        return this._model as ShaderDemoSceneModel;
    }


    /**
     * The main customization you might do here would be to set the background color or set a background image.
     * Check out Lab Cat's helpful C1Example2 scene for example code that sets the background to an image.
     * @returns {Promise<void>}
     */
    async initScene(): Promise<void> {
        // You can set the clear color for the rendering context
        await super.initScene();
    }


    initInteractions() {
        super.initInteractions();

        // add the example interaction modes
        this.initExampleInteractions();

        let shaderInteractionMode = new ShaderDemoInteractionMode(this);
        this.defineInteractionMode("shader", shaderInteractionMode);
        this.setCurrentInteractionMode("shader");
    }


    /**
     * Specifies what view classes to use for different model class.
     * If you create custom models and views, you will need to link them here by calling `addModelViewSpec` with the
     * model class as the first argument and the view class as the second. Check out C1Example2 and C1Example3 for examples
     * with custom nodes added.
     */
    initModelViewSpecs() {
        // Call the super function if you want default specs
        super.initModelViewSpecs();
        this.addExampleModelViewSpecs()
    }

    onAnimationFrameCallback(context:AGLContext) {
        super.onAnimationFrameCallback(context);
    }



}
