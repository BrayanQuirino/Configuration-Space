class Robot{
    constructor(x,y,w,h,c,grid){
        this.x=resize(x);
        this.y=resize(y);
        this.w=resize(w);
        this.h=resize(h);
        this.grid=grid;
        this.c=c;
        this.ready=false;
        this.chance=false;
        this.a=0;
        this.ultraCollision=true;
        this.lines=grating(0,0,this.w,this.h,grid); //Arreglo de objetos del tipo Linea
    }
    dibujar(){
        push();
        fill(this.c)
        translate(this.x,this.y);
        rectMode(CENTER);
        rotateZ(this.a);
        //rect(0,0,this.w,this.h);
        rect(0,0,this.w,this.h);
        pop();
    }
    collisionA(){
        push();
        translate(this.x,this.y);
        this.chance=false;
        for (let i of this.lines){
            if(!this.chance){
                for(let j of walls){
                    let intersection=i.collision(j,this.x,this.y);
                    if(intersection){
                        /*stroke(255,0,0,100);
                        point(intersection.x-this.x,intersection.y-this.y,0);*/
                        if(this.min==undefined){
                            this.min=degrees(this.a);
                            this.max=degrees(this.a);
                        }else{
                            this.max=degrees(this.a);
                        }
                        this.chance=true;
                        break;
                        //dots.push(maps(this.x,this.y,degrees(this.a)));
                    }
                }
               
            }else{
                //break;
            }
             //i.dibujar();
        }
        if(!this.chance){
            if(this.min!=undefined){
                dots.push(new Simple(maps(this.x,this.y,this.min),maps(this.x,this.y,this.max)));
                this.min=this.max=undefined;
            }
        }else{
            if(this.max>=180){
                dots.push(new Simple(maps(this.x,this.y,this.min),maps(this.x,this.y,this.max)));
                this.min=this.max=undefined;
            }
        }
        if(degrees(this.a)>=180){
            this.a=0;
            this.ready=true;
        }
        this.a+=0.05;
        this.rotateLines(); //Rotamos toda la regilla con respecto al centro geometrico
        pop();
    }
    position(x,y){
        this.x=x;
        this.y=y;
    }
    onlyPoint(){
        point(this.x,this.y); //Obtiene el centro geometrico del robot
    }
    rotateLines(){
        for (let i of this.lines){
            i.rotationLine();
        }
    }
}