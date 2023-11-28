import {V2, Vec2} from "../../math";
import {AParticle} from "./AParticle";


export interface Particle2D extends AParticle<Vec2>{
    // mass:number;
    position:Vec2;
    // velocity:Vec2;
    depth:number;
}

export class AParticle2D implements Particle2D{
    mass:number;
    position:Vec2;
    velocity:Vec2;
    visible:boolean=true;
    size:number;
    depth:number=0;

    get hidden(){
        return !this.visible;
    }

    constructor(position?:Vec2, velocity?:Vec2, mass?:number, size?:number){
        this.position = position??V2();
        this.velocity = velocity??V2();
        this.mass = mass??1;
        this.size = size??1;
    }
}



