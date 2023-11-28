import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useEffect, useState} from "react";
import {MainComponent, GUIComponent, Layout, FullLayout, GUIBottomComponent} from "./Component";
import {AppState, CreateAppState, ControlPanel} from "../anigraph";



import {SceneModel, SceneControllerClass} from "./SceneSelection";



const appState = CreateAppState(SceneModel);
SceneModel.initAppState(appState);
appState.createMainRenderWindow(SceneControllerClass);
const initConfirmation = appState.confirmInitialized();

// const LayoutToUse = FullLayout;
const LayoutToUse = Layout;



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
            <LayoutToUse>
                <div className={"container-fluid"} id={"anigraph-app-div"}>
                    <div className={"row anigraph-row"}>
                        <div className={`col-${appState.getState("CanvasColumnSize")??10} anigraph-component-container`}>
                            <MainComponent renderWindow={appState.mainRenderWindow} name={appState.sceneModel.name}>
                                <GUIComponent appState={appState}>
                                </GUIComponent>
                            </MainComponent>
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={`col-${appState.getState("CanvasColumnSize")??10} anigraph-component-container`}>
                            <GUIBottomComponent appState={appState}>
                            </GUIBottomComponent>
                        </div>
                    </div>
                </div>
            </LayoutToUse>
        </div>
    );
}

export default App;
