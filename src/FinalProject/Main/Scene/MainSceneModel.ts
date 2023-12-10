import {
    ACameraModel, AInteractionEvent,
    AppState, GetAppState, Quaternion, ATriangleMeshModel,
    NodeTransform3D, Particle3D,
    V3, V4, Vec2, VertexArray3D
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


    /**
     * Let's generate a random slightly bumpy terrain.
     * It's just uniform random bumps right now, nothing fancy.
     */
    // this.terrain.reRollRandomHeightMap();

    /**
    * Let's add the cursor model but keep it invisible until an appropriate mode is activated
    * @type {boolean}
    */
    // this.initCursorModel();
    // this.cursorModel.visible = false;




    CreateNewClickModel(radius: number = 0.01) {
        let appState = GetAppState();
        let newClickModel = new ATriangleMeshModel();
        let verts = VertexArray3D.Sphere(radius);
        newClickModel.setVerts(verts);
        let newModelMaterial = appState.CreateShaderMaterial("blinnphong");
        newModelMaterial.setTexture("diffuse", this.getTexture("cursor"));
        newClickModel.setMaterial(newModelMaterial);
        return newClickModel
    }


    onClick(event: AInteractionEvent) {
        //console.log(event);
        //console.log(event.cursorPosition)
        // TODO: transform pixel coordinates to terrain coordinates

        let ndcCursor = event.ndcCursor;
        if (ndcCursor) {

            /**
             * The cursor in NDC coordinates (randing from -1 to 1 across the x and y dimensions of your rendering window), as a homogeneous 3D vector at depth 0 in NDC space
             * @type {Vec4}
             */
            let cursorCoordsH = V4(
                ndcCursor.x,
                ndcCursor.y,
                0,
                1
            );

            /**
             * The cursor in eye coordinates. We will calculate this by transforming by the inverse of our projection matrix.
             * @type {Vec4}
             */
            let eyeCoordinates = this.camera.projection.getInverse().times(cursorCoordsH).getHomogenized();

            // convert the point in eye coordinates to world coordinates
            let cursorWorld = this.camera.transform.times(eyeCoordinates)
            // TODO divide by homogenous coordinates?

            // get the current location of the camera in world coordinates
            let cameraWorld = V4(this.camera.position.x, this.camera.position.y, this.camera.position.z, 1)

            let ray = cursorWorld.minus(cameraWorld)

            // find place where ray height is 0, see where it intersects?
            let terrain_height = 0
            let t = (terrain_height - cameraWorld.z) / ray.z

            if (t > 0) {
                // find intersection with x and y
                let x = cameraWorld.x + t * ray.x
                let y = cameraWorld.y + t * ray.y
                let z = cameraWorld.z + t * ray.z
                console.log(x)
                console.log(y)
                console.log(z)
                let terrainWorld = V4(x, y, z, 1)
                let terrainCoords = this.terrain.transform.getMat4().invert().times(terrainWorld)
                console.log(terrainCoords)
            }
        }

        let pos = event.cursorPosition
        if (pos != null) {
            // need to figure out how to transform 2d point with 4D matrix??
            // transform pixels to world coordinates
            // then world coordinates -> terrain coordinates

            /**
             * Get the world coordinates of the cursor
             */
            let cursorWorldCoordinates = this.getCoordinatesForCursorEvent(event);
            //console.log(cursorWorldCoordinates)
            // TODO figure out how to convert these to 3D world coordinates

            let trans = this.terrain.transform.getMat4()

            this.terrain.playerInteraction(this.terrain.heightMap.width / 2, this.terrain.heightMap.height / 2, .05)
        }

        let appState = GetAppState();
        /* let newModel = this.CreateNewClickModel(0.1);
        newModel.setTransform(
            new NodeTransform3D(
                V3(
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    0
                ).times(appState.globalScale),
                Quaternion.RotationY(-Math.PI * 0.5).times(Quaternion.RotationX(-Math.PI * 0.25))
            )
    
        )
        this.addChild(newModel); */
    }

    getCoordinatesForCursorEvent(event: AInteractionEvent) {
        return event.ndcCursor ?? new Vec2();
    }


    /**
     * Update the model with time here.
     * If no t is provided, use the model's time.
     * If t is provided, use that time.
     * You can decide whether to couple the controller's clock and the model's. It's usually good practice to have the model run on a separate clock.
     * @param t
     */
    timeUpdate(t?: number): void;
    timeUpdate(...args: any[]) {
        let t = this.clock.time;
        if (args != undefined && args.length > 0) {
            t = args[0];
        }
    }


}