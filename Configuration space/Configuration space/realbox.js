class Boxes{
    constructor(v1,v2,v3,v4,v5,c){
        this.v1=v1;
        this.v2=v2;
        this.v3=v3;
        this.v4=v4;
        this.v5=v5;
        this.c=c;
        this.v1real=createVector(mapSize(this.v1.x),this.v1.y,mapSize(this.v1.z));
        this.v2real=createVector(mapSize(this.v2.x),this.v2.y,mapSize(this.v2.z));
        this.v3real=createVector(mapSize(this.v3.x),this.v3.y,mapSize(this.v3.z));
        this.v5real=createVector(mapSize(this.v5.x),this.v5.y,mapSize(this.v5.z));
        this.w=mapSize(this.v5.x-this.v1.x);
        this.h=(this.v2.y)-(this.v1.y);
        this.d=mapSize((this.v3.z)-(this.v1.z));
    }
    dibujar(){
        //noStroke();
        push();
            translate(mapSize(this.v1.x) + this.w/2,this.v1.y+this.h/2,mapSize(this.v1.z) + this.d/2);
            if(this.c==1){
                fill(255,0,0,150);
            }else{
                fill(49, 196, 59,150);
            }
            box(this.w,this.h,-this.d);
        pop();
        push();
            translate(mapSize(this.v1.x) + this.w/2,this.v1.y+this.h/2 - 180,mapSize(this.v1.z) + this.d/2);
            if(this.c==1){
                fill(255,0,0,150);
            }else{
                fill(49, 196, 59,150);
            }
            box(this.w,this.h,-this.d);
        pop();
    }
    into(re){
        //print(re)
        if(re.x>=this.v1real.x && re.x<=this.v5real.x && ((re.y>=this.v2real.y && re.y<=this.v1real.y)|| (re.y>=this.v2real.y-180  &&re.y<=this.v1real.y-180 )) && re.z>=this.v3real.z&& re.z<=this.v1real.z){
            return true;
        }else{
            return false;
        }
    }
}