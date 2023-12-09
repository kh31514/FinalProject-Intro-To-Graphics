import {AParticleSystemModel} from "../../../../anigraph/effects/particles/AParticleSystemModel";
import {
    ASerializable,
    AShaderMaterial,
    AShaderModel,
    ATexture,
    Color,
    GetAppState,
    V3,
    Vec3,
    Mat3, Mat4, ACamera
} from "../../../../anigraph";
import {BillboardParticle} from "./BillboardParticle";
import {AInstancedParticleSystemModel} from "../../../../anigraph/effects";


// let appState = GetAppState();

@ASerializable("BillboardParticleSystemModel")
export class BillboardParticleSystemModel extends AInstancedParticleSystemModel<BillboardParticle>{

    static DEFAULT_MAX_PARTICLES = 300;
    static VelocitySliderName:string="Velocity"
    static GravitySliderName:string="Gravity"
    static ForceStrengthSliderName:string="ForceStrength";
    static ParticleMassSliderName:string="ParticleMass"


    //particles:ABillboardParticle[]
    lastEmittedIndex:number=0;
    lastTimeUpdate:number=-1;

    /**
     * This is an example of how you can add particle system controls to the control panel
     * @constructor
     */
    static AddParticleSystemControls(){
        let appState = GetAppState();
        appState.addSliderIfMissing(this.VelocitySliderName, 0.5, 0,1,0.01);
        appState.addSliderIfMissing(this.GravitySliderName, 0.5, 0,1,0.01);
        appState.addSliderIfMissing(this.ForceStrengthSliderName, 0.5, 0,1,0.01);
        appState.addSliderIfMissing(this.ParticleMassSliderName, 1, 0,100,0.01);
    }

    /**
     * This will emit a new particle. The starter implementation does this in a round-robin order, so it will recycle
     * the particle that was emitted least recently.
     * @param position
     * @param velocity
     * @param mass
     * @param radius
     * @param t0
     */
    emit(position:Vec3, velocity:Vec3, mass?:number, radius?:number, t0:number=-1){
        let i=(this.lastEmittedIndex+1)%(this.nParticles);

        this.particles[i].position = position;
        this.particles[i].velocity = velocity;
        this.particles[i].mass = mass??1;
        this.particles[i].size = radius??0.1;
        this.particles[i].visible=true;
        this.particles[i].t0=t0;
        this.particles[i].color = Color.Random();
        this.lastEmittedIndex=i;
    }

    /**
     * Here you initialize the particles
     * @param nParticles
     */
    initParticles(nParticles:number){
        for(let i=0;i<nParticles;i++){
            let newp = new BillboardParticle();

            /**
             * Here we will initialize the particles to be invisible.
             * This won't do anything on its own, though; you will have to ensure that invisible particles are not visible in your corresponding custom view class.
             */
            newp.visible=false;

            /**
             * Let's add the particle...
             */
            this.addParticle(newp);
        }
    }

    static Create(nParticles?:number, particleTexture?:ATexture,...args:any[]){
        let psystem = new this(nParticles, ...args);
        let mat = this.CreateMaterial(particleTexture)
        psystem.setMaterial(mat);
        return psystem;
    }

    constructor(nParticles?:number, ...args:any[]) {
        super(nParticles);
        this.initParticles(nParticles??BillboardParticleSystemModel.DEFAULT_MAX_PARTICLES);
        this.signalParticlesUpdated();
    }

    timeUpdate(t: number, camera: ACamera, ...args:any[]) {
        let appState = GetAppState();
        super.timeUpdate(t, ...args);

        /**
         * This is one way to check and see if we are in our first timeUpdate call.
         * We initialized this.lastTimeUpdate to -1, so if it is less than 0 we know it's our first time calling this function.
         */
        if(this.lastTimeUpdate<0){
            this.lastTimeUpdate=t;
        }

        let timePassed = t-this.lastTimeUpdate;
        this.lastTimeUpdate=t;

        /**
         * Let's emit a new particle
         */
        let particleSize = 0.05;
        let startPosition = this.getWorldTransform().c3.Point3D;
        // console.log(startPosition);
        let startSpeed = appState.getState(BillboardParticleSystemModel.ForceStrengthSliderName)??0.5;
        // let startVelocity = new Vec3(0,1,0)
        let startVelocity = V3(Math.cos(t*5), Math.sin(t*5), 1.0).times(startSpeed);
        let newParticleMass = appState.getState(BillboardParticleSystemModel.ParticleMassSliderName)??1;
        this.emit(startPosition,
            startVelocity,
            newParticleMass,
            particleSize,
            t
        );

        /**
         * Here we will define some behavior for our particles. This is a bare minimum simple forward euler simulation.
         */
        for(let i=0;i<this.particles.length;i++){
            let p =this.particles[i];


            let theta = 0.1;

            // x
            // let rotMax = new Mat3(1,0,0, 0,Math.cos(theta),-Math.sin(theta),0,Math.cos(theta),-Math.sin(theta));
            // y
            // let rotMax = new Mat3(Math.cos(theta),0,Math.sin(theta),0,1,0,-Math.sin(theta),0,Math.cos(theta));
            // z
            // let rotMax = new Mat3(Math.cos(theta),-Math.sin(theta),0, Math.sin(theta),Math.cos(theta),0, 0,0,1);



            // p.position=rotMax.times(p.position)


            p.position=p.position.plus(
                p.velocity.times(
                    (appState.getState(BillboardParticleSystemModel.VelocitySliderName)??0.5)*timePassed
                )
            );

            // p.position=p.position.times(
            // face camera
            // model = mat4(1.0,   0.0,   0.0, 0.0,
            //     0.0,   1.0,   0.0, 0.0,
            //     0.0,   0.0,   1.0, 0.0,
            //     aOffset.x, aOffset.y, aOffset.z, 1.0);

            // let look = normalize(camera.position - p.position);
            // let right = math.cross(camera.up, look);
            // let up2 = math.cross(look, right);
            // let transform = ;
            // transform[0] = vec4(right, 0);
            // transform[1] = vec4(up2, 0);
            // transform[2] = vec4(look, 0);
            // Uncomment this line to translate the position as well
            // (without it, it's just a rotation)
            //transform[3] = vec4(position, 0);
            // p.position=transform.times(p.position);
        }

        /**
         * This is important! You need to signal that the particles have been updated to trigger re-rendering of the view!
         */
        this.signalParticlesUpdated();
    }

}
