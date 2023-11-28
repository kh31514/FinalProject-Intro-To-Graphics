import {BaseSceneModel} from "./BaseSceneModel";
import {ABasicSceneController} from "../../../anigraph/starter";
import {Particle3D} from "../../../anigraph";


export abstract class BaseSceneController extends ABasicSceneController {
    get model(): BaseSceneModel {
        return this._model as BaseSceneModel;
    }
    async initScene(): Promise<void> {
        super.initScene();
        // You could potentially load a skybox here
        // this.view.loadSkyBox();
    }

    abstract get player():Particle3D;

}
