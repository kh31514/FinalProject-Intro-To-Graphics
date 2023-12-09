<<<<<<< HEAD
/**
 * @file Main scene controller for your application
 * @description This is where you connect models to views.
 * This is done mainly by defining your model view spec and interaction modes.
 */
import {MainSceneModel} from "./MainSceneModel";
import {ADragInteraction, AGLContext, AInteractionEvent, AKeyboardInteraction, Color} from "../../../anigraph";
import {BaseSceneController} from "../../HelperClasses";
import {CustomNode1Model, CustomNode1View} from "../Nodes/CustomNode1";
import {BillboardParticleSystemModel, BillboardParticleSystemView} from "../Nodes/BillboardParticleSystem";
import {ADebugInteractionMode} from "../../../anigraph/starter";
import {CustomInteractionMode} from "../InteractionModes/CustomInteractionMode";
=======
import { ExampleSceneController } from "src/FinalProject/Examples/Apps/ExampleSceneController";
import { Color, Mat3, V3 } from "src/anigraph";
import { MainSceneModel } from "./MainSceneModel";
import { ExampleClickInteractionMode } from "src/FinalProject/Examples";
>>>>>>> origin

export class MainSceneController extends ExampleSceneController {
    get model(): MainSceneModel {
        return this._model as MainSceneModel;
    }

    /**
     * This is where you specify the mapping from model classes to view classes.
     */
    initModelViewSpecs(): void {
        super.initModelViewSpecs();
<<<<<<< HEAD
        this.addModelViewSpec(CustomNode1Model, CustomNode1View);
        this.addModelViewSpec(BillboardParticleSystemModel, BillboardParticleSystemView);
=======
        this.addExampleModelViewSpecs();
>>>>>>> origin
    }

    async initScene(): Promise<void> {
        await super.initScene()
        // this.initSkyBoxCubeMap();
        this.setClearColor(Color.Black());
    }

    initInteractions() {
        super.initInteractions();
        this.initExampleInteractions();
        this.defineInteractionMode("ExampleClick", ExampleClickInteractionMode.Create(this));
    }

}