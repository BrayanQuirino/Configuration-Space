class Lines {
    constructor(v1,v2,c,xf,yf) {
      this.v1 = v1;
      this.v2 = v2;
      this.uA = 0;
      this.uB = 0;
      this.inx=0;
      this.iny=0;
      this.xf=xf;
      this.yf=yf;
      this.c=c;
      this.a=0;
      this.b=0;
      this.d1=0;
      this.d2=0;
      this.length=p5.Vector.dist(this.v1,this.v2);
    }
    dibujarPush() {
      push();
        stroke(this.c);
        strokeWeight(1);
        translate(this.v1.x,this.v1.y);
        line(0,0,this.v2.x, this.v2.y);
      pop();
    }
    dibujar(){
      stroke(this.c);
      strokeWeight(1);
      line(this.v1.x,this.v1.y,this.v2.x, this.v2.y);
    }
    /*Formuala basada de:
    https://en.wikipedia.org/wiki/Line–line_intersection
    */
    collision(other,xf,yf){
        let x1=other.v1.x;
        let y1=other.v1.y;
        let x2=other.v2.x;
        let y2=other.v2.y;
        let x3=this.v1.x+xf;
        let y3=this.v1.y+yf;
        let x4=this.v2.x+xf;
        let y4=this.v2.y+yf;
        this.uA = ((x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1)) / ((y2 - y1) * (x4 - x3) - (x2 - x1) * (y4 - y3));
        this.uB = ((x4 - x3) * (y3 - y1) - (y4 - y3) * (x3 - x1)) / ((y2 - y1) * (x4 - x3) - (x2 - x1) * (y4 - y3));
        if (this.uA >= 0 && this.uA <=1 && this.uB >= 0 && this.uB <= 1) {
        this.inx = x3 + (this.uA * (x4-x3));
        this.iny = y3 + (this.uA * (y4-y3));
        return createVector(this.inx,this.iny);
        }else{
        return;
        }
    }
    angles(x,y){
        //Rotamos los angulos
        let aux=getAngles(x,y,this.v1.x,this.v1.y,this.v2.x,this.v2.y);
        this.a=aux[0];
        this.b=aux[1];
        this.d1=dist(x,y,this.v1.x+x,this.v1.y+y);
        this.d2=dist(x,y,this.v2.x+x,this.v2.y+y);
    }
    rotationLine(x,y){
        this.v1.x= cos(this.a)*this.d1;
        this.v1.y= sin(this.a)*this.d1;
        this.v2.x= cos(this.b)*this.d2;
        this.v2.y= sin(this.b)*this.d2;
        this.a+=0.05;
        this.b+=0.05;
    }
  }