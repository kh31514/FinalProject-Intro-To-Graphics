import {AScenePointerLockInteractionMode} from "../../../anigraph/starter/interactionmodes";
import {BaseSceneController} from "../Scene";
import {BaseSceneModel} from "../Scene";
import {CharacterInterface} from "../Nodes";
import {Particle3D} from "../../../anigraph";

interface HasPlayerSceneController extends BaseSceneController{
    player:Particle3D;
}

export class MainAppPointerLockInteractionMode extends AScenePointerLockInteractionMode{
    get owner(): BaseSceneController {
        return this._owner as unknown as BaseSceneController;
    }

    get model(): BaseSceneModel {
        return this.owner.model;
    }
}
