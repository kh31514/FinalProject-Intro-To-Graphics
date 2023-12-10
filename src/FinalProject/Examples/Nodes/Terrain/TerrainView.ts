import { TerrainModel } from "../..";
import { ATerrainView } from "../../../../anigraph/scene/nodes/terrain/ATerrainView";
import { MainSceneModel } from "src/FinalProject/Main";
export class TerrainView extends ATerrainView {

  get model(): TerrainModel {
    return this._model as TerrainModel;
  }

  updateElements() {
    // super.update();
    // console.log("here")
    let c = this.model.c
    console.log(c)
    console.log(this.model.heightMap.height)
    console.log(this.model.heightMap.width)
    for (let y = 0; y < this.model.heightMap.height; y++) {
      for (let x = 0; x < this.model.heightMap.width; x++) {
        this.model.heightMap.setPixelNN(x, y, this.model.heightMap.pixelData.getPixelNN(x, y) * c);
      }
    }
    this.model.heightMap.setTextureNeedsUpdate();
  }

  init(): void {
    super.init();
    // this.updateElements(); // TODO figure out how to call this repeatedly
    // this.update();

    const self = this;

    this.subscribe(this.model.addUpdateListener(
      () => {
        this.updateElements();
      }
    ))

  }
}

