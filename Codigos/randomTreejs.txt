class exitPoint{
    constructor(v1,vf,myplace,placef){
        this.v1=v1;
        this.vf=vf;
        this.alineado=false;
        this.myplace=myplace;
        this.placef=placef;
    }
    dibujar(){
        strokeWeight(1);
        stroke(0,30,100,100);
        line(this.v1.x,this.v1.y,this.v1.z,this.vf.x,this.vf.y,this.vf.z);
    }
}