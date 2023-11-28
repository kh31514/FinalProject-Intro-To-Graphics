import {ASerializable, Particle3D} from "../../../anigraph";
import {ABasicSceneModel} from "../../../anigraph/starter";
import {CharacterInterface} from "../Nodes";

@ASerializable("BaseSceneModel")
export abstract class BaseSceneModel extends ABasicSceneModel {
    /**
     * Some of the example interaction modes expect to interaction
     * @type {Particle3D}
     */
    _player!:Particle3D; // Change this to whatever class you want
    get player(){return this._player;}


    abstract timeUpdate(...args:any[]): void;

}

