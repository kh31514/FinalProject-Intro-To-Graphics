import {
    ACameraModel, AInteractionEvent,
    AppState, GetAppState, Quaternion, ATriangleMeshModel,
    NodeTransform3D, Particle3D,
    V3, Vec2, VertexArray3D
} from "src/anigraph";
import {
    BillboardParticleSystemModel, TerrainModel,
} from "src/FinalProject/Examples/Nodes";
import { ExampleSceneModel } from "src/FinalProject/Examples/Apps/ExampleSceneModel";
import { ABlinnPhongShaderModel } from "src/anigraph/rendering/shadermodels";

const SelectionOptions = [
    "Rocky Terrain",
    "Grassy Hills",
    "Lab Cat Land"
]

export class MainSceneModel extends ExampleSceneModel {
    billboardParticles!: BillboardParticleSystemModel;

    initAppState(appState: AppState): void {
        // TerrainModel.initAppState(appState);
        // Dropdown menus with options are a bit more annoying but also doable...
        appState.setSelectionControl(
            "Terrain",
            "default",
            SelectionOptions
        )
    }

    async PreloadAssets() {
        let appState = GetAppState();
        await super.PreloadAssets();
        await this.LoadExampleTextures();
        await this.LoadExampleModelClassShaders()
        await this.LoadCursorTexture();
        await appState.loadShaderMaterialModel("simpletexture");
        await appState.addShaderMaterialModel("blinnphong", ABlinnPhongShaderModel);
        await this.loadTexture("./images/terrain/rock.jpg", "rock")
        await this.loadTexture("./images/terrain/labcat.png", "labcat")
        await this.loadTexture("./images/terrain/grass.jpeg", "grass")
    }

    initCamera() {
        super.initCamera();
        this.cameraModel = ACameraModel.CreatePerspectiveFOV(90, 1, 0.01, 10);
        this.cameraModel.setPose(
            NodeTransform3D.LookAt(
                V3(0, -1, 1),
                V3(0, 0, 0),
                V3(0, 0, 1)
            )
        )
    }

    initScene() {
        this.addViewLight();
        this.initTerrain("rock");
        this.terrain.perlinTerrain(0.08);

        let appState = GetAppState();
        this.subscribe(appState.addStateValueListener("Terrain",
            (selection: any) => {
                switch (selection) {
                    case SelectionOptions[0]:
                    case SelectionOptions[1]:
                        this.terrain.clear()
                        this.initTerrain("rock");
                        this.terrain.perlinTerrain(0.08);
                        break;
                    case SelectionOptions[2]:
                        this.terrain.clear()
                        this.initTerrain("grass");
                        this.terrain.perlinTerrain(0.05);
                        break;
                    case SelectionOptions[3]:
                        this.terrain.clear()
                        this.initTerrain("labcat");
                        this.terrain.perlinTerrain(0.01);
                        break;
                    default:
                        console.log(`Unrecognized selection ${selection}`);
                        break;
                }
            }), "Terrain");
    }

    timeUpdate(t?: number): void;
    timeUpdate(...args: any[]) {
        let t = this.clock.time;
        if (args != undefined && args.length > 0) {
            t = args[0];
        }
    }


}