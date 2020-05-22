class Comple{
    constructor(array){
        this.array=array;
    }
    dibujar(){
        noFill();
        //strokeWeight(2);
        //print(this.array.length);
        //stroke(0);
        beginShape();
        for(let i=0;i<this.array.length;i++){
            vertex(this.array[i].x,this.array[i].y,this.array[i].z);
        }
        endShape();
        //noLoop();
    }
}