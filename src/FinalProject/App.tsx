import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useEffect, useState} from "react";
import {MainComponent, GUIComponent, Layout} from "./Component";
import {AppState, CreateAppState, ControlPanel} from "../anigraph";



import {SceneModel, SceneControllerClass} from "./SceneSelection";



const appState = CreateAppState(SceneModel);
SceneModel.initAppState(appState);
appState.createMainRenderWindow(SceneControllerClass);
const initConfirmation = appState.confirmInitialized();

function App() {
    useEffect(() => {
        initConfirmation.then(()=> {
                console.log("Main Initialized.");
                // appState.addSliderIfMissing("exampleValue", 0, 0, 1, 0.001);
                appState.updateControlPanel();
            }
        );
    }, []);


    return (
        <div>
            <div className={"control-panel-parent"}>
                <ControlPanel appState={appState}></ControlPanel>
            </div>
            <Layout>
                <div className={"container-fluid"} id={"anigraph-app-div"}>
                    <div className={"row anigraph-row"}>
                        <div className={`col-${appState.getState("CanvasColumnSize")??8} anigraph-component-container`}>
                            <MainComponent renderWindow={appState.mainRenderWindow} name={appState.sceneModel.name}>
                                <GUIComponent appState={appState}>
                                </GUIComponent>
                            </MainComponent>
                        </div>
                    </div>
                </div>
            </Layout>
        </div>
    );
}

export default App;
