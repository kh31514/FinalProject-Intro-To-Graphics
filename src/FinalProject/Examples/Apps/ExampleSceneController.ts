import {BaseSceneController} from "../../HelperClasses";
import {
    BillboardParticleSystemModel, BillboardParticleSystemView,
    BotModel,
    BotView, ExampleLoadedCharacterModel, ExampleLoadedView, ExampleParticleSystemModel, ExampleParticleSystemView,
    ExampleThreeJSNodeModel,
    ExampleThreeJSNodeView,
    PlayerModel,
    PlayerView,
    TerrainModel,
    TerrainView, TriangleMeshCharacterModel, TriangleMeshCharacterView
} from "../Nodes";
import {ExamplePlayerInteractionMode, ExamplePointerLockInteractionMode} from "../InteractionModes";
import {AGLContext, Quaternion} from "../../../anigraph";
import {ExampleSceneModel} from "./ExampleSceneModel";

export class ExampleSceneController extends BaseSceneController{
    get model():ExampleSceneModel{
        return this._model as ExampleSceneModel;
    }

    /**
     * So that interaction modes know how to access the model's player
     * @returns {CharacterModel}
     */
    get player(){
        return this.model.player;
    }

    /**
     * add the example model view specs
     */
    addExampleModelViewSpecs(): void {
        this.addModelViewSpec(TriangleMeshCharacterModel, TriangleMeshCharacterView);
        this.addModelViewSpec(TerrainModel, TerrainView);
        this.addModelViewSpec(PlayerModel, PlayerView);
        this.addModelViewSpec(BotModel, BotView);
        this.addModelViewSpec(ExampleThreeJSNodeModel, ExampleThreeJSNodeView);
        this.addModelViewSpec(ExampleParticleSystemModel, ExampleParticleSystemView);
        this.addModelViewSpec(BillboardParticleSystemModel, BillboardParticleSystemView);
        this.addModelViewSpec(ExampleLoadedCharacterModel, ExampleLoadedView)
    }

    /**
     * Initialize / add example interaction modes
     */
    initExampleInteractions() {
        /**
         * This code adds the ExamplePlayer interaction mode and sets it as the current active mode
         */
        let playerInteractionMode = new ExamplePlayerInteractionMode(this);
        playerInteractionMode.cameraTarget = this.model.player;
        this.defineInteractionMode("ExamplePlayer", playerInteractionMode);


        let pointerLockInteractionMode = new ExamplePointerLockInteractionMode(this);
        this.defineInteractionMode("ExamplePointerLock", pointerLockInteractionMode);

        /**
         * If we want to start out in debug interaction mode we have a convenience method for switching to it
         */
        this.switchToDebugInteractionMode()

        /**
         * if we want to switch to one of the others we can do that like this
         */
        // this.setCurrentInteractionMode("ExamplePlayer");

    }

    loadSpaceSkymap(){
        /**
         * Set up the skybox background
         */
        // let urls = [];
        // for(let i=0;i<6; i++) {
        //     urls.push("./images/cube/spaceface/spaceface.jpg")
        // }
        this.initSkyBoxCubeMap(
            undefined, undefined,
            // Quaternion.RotationX(Math.PI*0.5)
        );
    }


    initInteractions() {
        /**
         * We will define the debug interaction mode here.
         * The debug mode is offered mainly to provide camera controls for developing and debugging non-control-related
         * features. It may also be useful as an example for you to look at if you like.
         */
        super.initInteractions();
    }

    /**
     * This is what gets called every time the browser grabs a new frame to render
     * @param context
     */
    onAnimationFrameCallback(context:AGLContext) {
        /**
         * let's update the model...
         */
        this.model.timeUpdate(this.model.clock.time);

        /**
         * and let's update the controller...
         * This will mostly update any interactions that depend on time.
         * Keep in mind that the model and controller run on separate clocks for this, since we may
         * want to pause our model's clock and continue interacting with the scene (e.g., moving the camera around).
         */
        this.timeUpdate();

        /**
         * Clear the rendering context.
         * you can also specify which buffers to clear: clear(color?: boolean, depth?: boolean, stencil?: boolean)
         * ``` this.renderer.clear(false, true); ```
         */
        context.renderer.clear();

        // render the scene view
        context.renderer.render(this.getThreeJSScene(), this.getThreeJSCamera());
    }



}


