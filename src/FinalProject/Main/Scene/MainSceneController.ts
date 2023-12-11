import { ExampleSceneController } from "src/FinalProject/Examples/Apps/ExampleSceneController";
import { Color, Mat3, V3 } from "src/anigraph";
import { MainSceneModel } from "./MainSceneModel";
import { ExampleClickInteractionMode } from "src/FinalProject/Examples";

export class MainSceneController extends ExampleSceneController {
    get model(): MainSceneModel {
        return this._model as MainSceneModel;
    }

    /**
     * This is where you specify the mapping from model classes to view classes.
     */
    initModelViewSpecs(): void {
        super.initModelViewSpecs();
        this.addExampleModelViewSpecs();
    }

    async initScene(): Promise<void> {
        await super.initScene()
        // this.initSkyBoxCubeMap();
        this.setClearColor(Color.Black());
    }

    initInteractions() {
        super.initInteractions();
        // this.initExampleInteractions();
        this.defineInteractionMode("ExampleClick", ExampleClickInteractionMode.Create(this));
        this.setCurrentInteractionMode("ExampleClick")
    }

}