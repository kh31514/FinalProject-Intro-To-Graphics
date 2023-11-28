import {ASerializable} from "../../../anigraph";
import {ASceneInteractionMode} from "../../../anigraph/starter/interactionmodes";
import {BaseSceneController, BaseSceneModel} from "../Scene";

@ASerializable("MainAppInteractionMode")
export class MainAppInteractionMode extends ASceneInteractionMode {
    get owner(): BaseSceneController {
        return this._owner as BaseSceneController;
    }

    get model(): BaseSceneModel {
        return this.owner.model;
    }


}
