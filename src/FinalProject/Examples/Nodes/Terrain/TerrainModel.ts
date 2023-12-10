import { ATerrainModel } from "../../../../anigraph/scene/nodes/terrain/ATerrainModel";
import {
    ASerializable, assert, BlinnPhongShaderAppState,
    CreatesShaderModels, SeededRandom, Vec2
} from "../../../../anigraph";
import { TerrainShaderModel } from "./TerrainShaderModel";
import type { TransformationInterface } from "../../../../anigraph";
import { ATexture } from "../../../../anigraph/rendering/ATexture";
import { ADataTextureFloat1D } from "../../../../anigraph/rendering/image";
import * as THREE from "three";
import { makeNoise2D } from "fast-simplex-noise";
import { BlinnPhongMaterial } from "../../../../anigraph/rendering/shadermodels";
import { MainSceneModel } from "src/FinalProject/Main";
import { GetAppState } from "../../../../anigraph";
import { AppState } from "../../../../anigraph";
// import Noise from 'noisejs';

// Constants for terrain generation
const scale = 0.1; // Scale factor for the noise (adjusts the frequency)
const amplitude = 0.01; // Amplitude factor (adjusts the height range)
enum AppStateKeys {
    c = "c"
}
@ASerializable("TerrainModel")
export class TerrainModel extends ATerrainModel {
    static AppStateKeys = AppStateKeys;
    c: number;
    useDataTexture: boolean = true;

    /**
     * Reusable instance of the shader model, which is a factory for creating shader materials
     */
    static ShaderModel: TerrainShaderModel;

    /**
     * Function to load the shader
     */
    static async LoadShaderModel(...args: any[]) {
        this.ShaderModel = await TerrainShaderModel.CreateModel("terrain")
    }


    textureWrapX: number = 5;
    textureWrapY: number = 5;

    /**
 * This is what you would use to add a listener to the custom update event
 * @param callback
 * @param handle
 * @returns {AEventCallbackSwitch}
 */
    addUpdateListener(callback: (...args: any[]) => void, handle?: string) {
        return this.addEventListener(TerrainModel.AppStateKeys.c, callback, handle);
    }

    constructor(
        width?: number,
        height?: number,
        widthSegments?: number,
        heightSegments?: number,
        transform?: TransformationInterface,
        textureWrapX?: number,
        textureWrapY?: number
    ) {
        super(width, height, widthSegments, heightSegments, transform);
        this.c = GetAppState().getState(TerrainModel.AppStateKeys.c);
        if (textureWrapX !== undefined) { this.textureWrapX = textureWrapX; }
        if (textureWrapY !== undefined) { this.textureWrapY = textureWrapY; }

    }

    getTerrainHeightAtPoint(p: Vec2) {
        return this.heightMap.pixelData.getPixelNN(p.x, p.y);
    }

    static Create(
        diffuseMap: ATexture,
        width?: number,
        height?: number,
        widthSegments?: number,
        heightSegments?: number,
        transform?: TransformationInterface,
        wrapTextureX?: number,
        wrapTextureY?: number,
        ...args: any[]) {

        assert(TerrainModel.ShaderModel !== undefined, "You need to call TerrainModel.LoadShaderModel() in an async function like PreloadAssets")

        /**
         * Create and initialize the terrain with the provided texture
         */
        let terrain = new this(width, height, widthSegments, heightSegments, transform, wrapTextureX, wrapTextureY);
        terrain.init(diffuseMap);
        return terrain;
    }

    init(diffuseMap: ATexture, useDataTexture?: boolean) {
        this.diffuseMap = diffuseMap;

        if (useDataTexture !== undefined) {
            this.useDataTexture = useDataTexture;
        }

        /**
         * If you want to use a data texture to implement displacement map terrain, create a heightMap data texture.
         * Most recent machines should support this feature, but I haven't verified on all platforms.
         * If it seems to fail, you might set useDataTexture to false by default.
         */
        if (useDataTexture ?? this.useDataTexture) {
            this.heightMap = ADataTextureFloat1D.CreateSolid(this.widthSegments, this.heightSegments, 0.5)
            this.heightMap.setMinFilter(THREE.LinearFilter);
            this.heightMap.setMagFilter(THREE.LinearFilter);
            // this.reRollHeightMap();
        }

        let terrainMaterial = TerrainModel.ShaderModel.CreateMaterial(
            this.diffuseMap,
            this.heightMap,
        );

        terrainMaterial.setUniform(BlinnPhongShaderAppState.Diffuse, 0.5);
        this.setMaterial(terrainMaterial);
    }

    perlinNoise(x: number, y: number): number {
        // Generate a pseudo-random gradient vector at this grid point
        const v = (x * 15485863 + y * 101 + 23571) & 0xff; // Replace with your own pseudo-random function

        // Pre-calculated gradient vectors (you can define your own gradients)
        const gradients = [
            [1, 1],
            [-1, 1],
            [1, -1],
            [-1, -1]
        ];
        // Calculate dot product between gradient and distance vectors
        const dx = x - Math.floor(x);
        const dy = y - Math.floor(y);
        const gradientIndex = (x + y) & 3;
        const [gradX, gradY] = gradients[gradientIndex];
        const dotProduct = dx * gradX + dy * gradY;

        return dotProduct;
    }

    reRollRandomHeightMap(seed?: number, gridResX: number = 5, gridResY: number = 5) {
        for (let y = 0; y < this.heightMap.height; y++) {
            for (let x = 0; x < this.heightMap.width; x++) {
                this.heightMap.setPixelNN(x, y, Math.random() * 0.05);
            }
        }

        this.heightMap.setTextureNeedsUpdate();
    }


    clear() {
        for (let y = 0; y < this.heightMap.height; y++) {
            for (let x = 0; x < this.heightMap.width; x++) {
                this.heightMap.setPixelNN(x, y, -10000);
            }
        }
        this.heightMap.setTextureNeedsUpdate();
    }

    perlinTerrain(c: number) {
        let waterfall_width = 20
        let waterfall_height = 1

        for (let y = 0; y < this.heightMap.height; y++) {

            for (let x = 0; x < this.heightMap.width; x++) {

                if (y > this.heightMap.height * 3 / 4) {
                    // raised terrain for the waterfall
                    this.heightMap.setPixelNN(x, y, Math.random() * 0.05 + waterfall_height);
                }
                else if (y > this.heightMap.height * 3 / 4 - waterfall_width) {
                    // sloping part of waterfall
                    // calculate the height, then change slightly based on randomness
                    let slope = waterfall_height / waterfall_width
                    let t = y - (this.heightMap.width * 3 / 4 - waterfall_width)
                    let sigmoid_output = waterfall_height / (1 + Math.exp(-6 * (t - waterfall_width / 2) / waterfall_width))
                    //let height = slope * (y - (this.heightMap.width * 3 / 4 - 10))
                    let height = sigmoid_output

                    this.heightMap.setPixelNN(x, y, Math.random() * 0.05 + height);
                }
                else if (x > this.heightMap.width * 3.5 / 8 && x < this.heightMap.width * 4.5 / 8 && y < this.heightMap.height * 5 / 8) {
                    // todo: make the elevation a little more natural here, maybe based on squared diff from center
                    let center_dist = Math.abs(x - this.heightMap.width / 2)
                    let stream_height = .5
                    let stream_width = this.heightMap.width / 16
                    let sigmoid_output = stream_height / (1 + Math.exp(-6 * (center_dist - stream_width / 2) / stream_width))
                    this.heightMap.setPixelNN(x, y, Math.random() * 0.05 - .5 + sigmoid_output);
                }
                else {
                    let noiseValue = this.perlinNoise(x * scale, y * scale);
                    let heightValue = Math.floor(amplitude * noiseValue);
                    const rolling = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 5; // Adjust the rolling effect here
                    const rolledHeight = heightValue + rolling;
                    this.heightMap.setPixelNN(x, y, c * rolledHeight);
                }
            }
        }
        this.heightMap.setTextureNeedsUpdate();
    }

    playerInteraction(x: number, y: number, change: number) {

        //this.reRollRandomHeightMap(1)
        for (let i = y - 5; i < y + 5; i++) {
            for (let j = x - 5; j < x + 5; j++) {
                // TODO make the edges less rigid
                this.heightMap.setPixelNN(i, j, this.heightMap.pixelData.getPixelNN(x, y) + change);
                //this.heightMap.setPixelNN(j, i, 10);
            }
        }
        this.heightMap.setTextureNeedsUpdate();
    }


}
