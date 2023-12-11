import {
    ACamera,
    ACameraModel, AClickInteraction,
    ADOMPointerMoveInteraction, ADragInteraction,
    AInteractionEvent,
    AInteractionMode,
    AKeyboardInteraction, ANodeModel3D, ASceneController,
    ASceneModel,
    ASerializable, AWheelInteraction, NodeTransform3D,
    SetInteractionCallbacks, V2, V4, Vec3, Mat4, Quaternion
} from "../../../anigraph";
import type { HasInteractionModeCallbacks } from "../../../anigraph";
import { ASceneInteractionMode } from "../../../anigraph/starter";
import { ExampleSceneModel } from "../Apps/ExampleSceneModel";


interface IsSceneModelWithRequirements extends ASceneModel {
    // Put any expected functions of supported scene models here
    onClick(event: AInteractionEvent): void;
    onKeyDown(event: AInteractionEvent, interaction: AKeyboardInteraction): void;

    cursorModel: ANodeModel3D;
}

@ASerializable("ExampleClickInteractionMode")
export class ExampleClickInteractionMode extends ASceneInteractionMode {
    static MODE_NAME = "Custom Mode"

    keyboardMovementSpeed: number = 1;
    keyboardRotationAngle: number = 0.5;

    /**
     * Here we are simply defining our model getter to cast our scene model as one with the required interface implemented
     * @returns {IsSceneModelWithRequirements}
     */
    get model(): IsSceneModelWithRequirements {
        return (this.owner.model as IsSceneModelWithRequirements);
    }

    get owner(): ASceneController {
        return this._owner as ASceneController;
    }

    updateCursor(event: AInteractionEvent) {
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

            /**
             * Set the position of our cursor to this eye coordinates position
             */
            this.model.cursorModel.setTransform(
                new NodeTransform3D(eyeCoordinates.Point3D, undefined, 0.0002)
            );
        }
    }

    /**
     * Our click response will simply call whatever `onClick` method is defined in our model
     * @param event
     */
    onClick(event: AInteractionEvent): void {
        this.model.onClick(event);
    }

    onKeyDown(event: AInteractionEvent, interaction: AKeyboardInteraction) {
        if (interaction.keysDownState['w']) {
            // this.camera.setPosition(this.camera.position.plus(new Vec3(0, this.keyboardMovementSpeed, 0)))
            // this.cameraModel.setTargetPosition(this.camera.position.plus(new Vec3(0, this.keyboardMovementSpeed, 0)));

            //forward in the direction the camera is facing
            this.cameraModel.setTargetPosition(this.camera.position.plus(this.camera.forward));
        }
        if (interaction.keysDownState['a']) {
            // this.camera.setPosition(this.camera.position.plus(new Vec3(-this.keyboardMovementSpeed, 0, 0)))
            // this.cameraModel.setTargetPosition(this.camera.position.plus(new Vec3(-this.keyboardMovementSpeed, 0, 0)));

            //to the left relative to current forward direction (no z-change tho)
            let right_vector = new Vec3(this.camera.forward.y, -this.camera.forward.x, 0)
            this.cameraModel.setTargetPosition(this.camera.position.minus(right_vector));
        }
        if (interaction.keysDownState['s']) {
            // this.camera.setPosition(this.camera.position.plus(new Vec3(0, -this.keyboardMovementSpeed, 0)))
            // this.cameraModel.setTargetPosition(this.camera.position.plus(new Vec3(0, -this.keyboardMovementSpeed, 0)));

            //backward in the direction the camera is facing
            this.cameraModel.setTargetPosition(this.camera.position.minus(this.camera.forward));
        }
        if (interaction.keysDownState['d']) {
            // this.camera.setPosition(this.camera.position.plus(new Vec3(this.keyboardMovementSpeed, 0, 0)))
            // this.cameraModel.setTargetPosition(this.camera.position.plus(new Vec3(this.keyboardMovementSpeed, 0, 0)));

            //to the right relative to current forward direction (no z-change tho)
            let right_vector = new Vec3(this.camera.forward.y, -this.camera.forward.x, 0)
            this.cameraModel.setTargetPosition(this.camera.position.plus(right_vector));
        }
        if (interaction.keysDownState['ArrowUp']) {
            this.cameraModel.setTargetPosition(this.camera.position.plus(new Vec3(0, 0, this.keyboardMovementSpeed)));
            // let rad = -this.keyboardRotationAngle
            // let M = new Mat4(1, 0, 0, 0, 0, Math.cos(rad), -Math.sin(rad), 0, 0, Math.sin(rad), Math.cos(rad), 0, 0, 0, 0, 1)
            // // let M = new Mat4(Math.cos(rad), 0, Math.sin(rad), 0, 0, 1, 0, 0, -Math.sin(rad), 0, Math.cos(rad), 0, 0, 0, 0, 1)
            // // this.camera.transform.rotation = this.camera.transform.rotation.times(M)
            // this.camera.transform.rotation = Quaternion.FromCameraOrientationVectors(this.camera.forward, this.camera.up)
        }
        if (interaction.keysDownState['ArrowDown']) {
            this.cameraModel.setTargetPosition(this.camera.position.plus(new Vec3(0, 0, -this.keyboardMovementSpeed)));
        }
        if (interaction.keysDownState['ArrowLeft']) {
            let rad = this.keyboardRotationAngle
            let M = new Mat4(Math.cos(rad), -Math.sin(rad), 0, 0, Math.sin(rad), Math.cos(rad), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
            // this.camera.transform.rotation = this.camera.transform.rotation.times(M)
            this.cameraModel.setTargetRotation(this.camera.transform.rotation.times(M))
        }
        if (interaction.keysDownState['ArrowRight']) {
            let rad = -this.keyboardRotationAngle
            let M = new Mat4(Math.cos(rad), -Math.sin(rad), 0, 0, Math.sin(rad), Math.cos(rad), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
            // this.camera.transform.rotation = this.camera.transform.rotation.times(M)
            this.cameraModel.setTargetRotation(this.camera.transform.rotation.times(M))
        }
    }
    // onKeyUp(event:AInteractionEvent, interaction:AKeyboardInteraction){}
    // onWheelMove(event:AInteractionEvent, interaction?:AWheelInteraction){}
    onMouseMove(event: AInteractionEvent, interaction?: ADOMPointerMoveInteraction) {
        this.updateCursor(event);
    }
    onDragStart(event: AInteractionEvent, interaction: ADragInteraction) {
        this.updateCursor(event);
    }
    // onDragMove(event:AInteractionEvent, interaction:ADragInteraction){}
    // onDragEnd(event:AInteractionEvent, interaction:ADragInteraction){}

    /**
     * We will make the cursor visible when this mode is activated
     * @param args
     */
    beforeActivate(...args: any[]) {
        super.beforeActivate(...args);
        this.model.cursorModel.visible = true;
    }

    /**
     * We will make the cursor invisible when this mode is deactivated
     * @param args
     */
    beforeDeactivate(...args: any[]) {
        super.beforeDeactivate(...args);
        this.model.cursorModel.visible = false;
    }

    /**
     * This is a model that contains a camera.
     * The camera itself just encapsulates a pose and projection matrix. The model is what the camera belongs to,
     * and can be an actual entity in the scene.
     * @returns {ACameraNodeModel}
     */
    get cameraModel(): ACameraModel {
        return this.owner.cameraModel;
    }

    get camera(): ACamera {
        return this.cameraModel.camera;
    }

    /**
     * This is the DOM element that is the game window being controlled
     * @type {HTMLElement}
     */
    get domElement(): HTMLElement {
        return this.owner._renderWindow.container;
    }

    /**
     * Create an instance in a single call, instead of calling new followed by init
     * @param owner
     * @param args
     * @returns {ASceneInteractionMode}
     * @constructor
     */
    static Create(owner: ASceneController, ...args: any[]) {
        let controls = new this(this.InteractionModeClassName(), owner);
        controls.init(owner);
        return controls;
    }

}
