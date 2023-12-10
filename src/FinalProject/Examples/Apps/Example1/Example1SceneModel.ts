import {
    ACameraModel, AInteractionEvent, AMaterial,
    AppState, GetAppState,
    NodeTransform3D, Particle3D,
    V3, Vec2,
} from "../../../../anigraph";
import {
    BillboardParticleSystemModel,
} from "../../Nodes";
import {ExampleSceneModel} from "../ExampleSceneModel";
import {ABlinnPhongShaderModel} from "../../../../anigraph/rendering/shadermodels";

export class Example1SceneModel extends ExampleSceneModel {
    billboardParticles!:BillboardParticleSystemModel;

    /**
     * Optionally add some app state here. Good place to set up custom control panel controls.
     * @param appState
     */
    initAppState(appState: AppState): void {

        /**
         * Adding sliders to control blinn phong parameters
         * We can attach the corresponding parameters for a material later on by calling
         * ```
         * ABlinnPhongShaderModel.attachMaterialUniformsToAppState(material);
         * ```
         */
        ABlinnPhongShaderModel.AddAppState();
        // ParticleSystemModel.AddParticleSystemControls();

    }


    async PreloadAssets() {
        await super.PreloadAssets();
        await this.LoadExampleTextures();
        await this.LoadExampleModelClassShaders()
        await this.LoadTheCat();
    }


    initCamera() {
        super.initCamera();
        this.cameraModel = ACameraModel.CreatePerspectiveFOV(90, 1, 0.01, 10);
        this.cameraModel.setPose(
            NodeTransform3D.LookAt(
                V3(0, -1, 1),
                V3(0,0,0),
                V3(0,0,1)
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

        // await this.addBotsInHierarchy();

        this.initCatPlayer();

        // this.addExampleThreeJSNodeModel();

        this.addExampleBilboardParticleSystem();

        GetAppState().addCheckboxControl("CullFront", false);
        const self = this;
        this.subscribeToAppState("CullFront", (v:boolean)=>{
            if(v) {
                self.player.material.setRenderSide(AMaterial.GEOMETRY_SIDE.BACK)
            }else{
                self.player.material.setRenderSide(AMaterial.GEOMETRY_SIDE.FRONT)
            }
        })



        /**
         * Here we attach our character's shader parameters to controls in the control panel
         */
        ABlinnPhongShaderModel.attachMaterialUniformsToAppState(this.player.material);
    }


    getCoordinatesForCursorEvent(event: AInteractionEvent){
        return event.ndcCursor??new Vec2();
    }

    /**
     * Here we will separate out logic that check to see if a particle (characters implement the particle interface, so
     * this can be used on characters as well) intersects the terrain.
     * @param particle
     */
    adjustParticleHeight(particle:Particle3D){
        let height = this.terrain.getTerrainHeightAtPoint(particle.position.xy);
        if(particle.position.z<height){particle.position.z = height;}
    }



    timeUpdate(t: number, ...args:any[]) {

        this.timeUpdateDescendants(t);
        this.adjustParticleHeight(this.player);
        for(let ei=0;ei<this.bots.length;ei++){
            let e = this.bots[ei];
            /**
             * adjust their height
             */
            this.adjustParticleHeight(e);
        }
        // this.timeUpdateOrbitBots(t);
    }


}


