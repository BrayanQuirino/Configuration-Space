/*Programa realizado por 
Brandon Banti
Brayan Quirino
22 de mayo de 2020
Configuration Space and RRT

Logica:
Cada robot está formado por un rectangulo amarillo, a su vez contiene una malla de lineas del tipo Lines(Line.js)
para detectar coliones. Los anaqueles tienen de misma forma un enmallado de estas lineas y los bodes son del mismo 
tipo. 
En lugar de iterar cada posicion, optamos por generar un robot en cada posicion posible >16000
Se itera cada robot en grados para detectar as collisiones. 
Necesitamos una transformacion lineal para graficar ya que los ejes estan investidos. De igual forma hay que redimensionar. 

Exiten varias optimizaciones ya que el pintado se vuelve catastrofico(:v) entre mas objetos tengamos
*/
let canvasX=window.innerWidth; 
let canvasY=window.innerHeight;
let mapW=875; //Tamaño para graficar es decir 35000/4 (Escalado)
let mapH=500; //2000/4
let play; //Se pausa el programa oprimiento p
let walls=[]; //Lineas donde puede haber colision 
let anaqueles=[]; //Areglo de onjetos dle tipo anaquel (anaqueles.js)
let walle; //Walle para crear un solo robot (robot.js)
let evas=[]; //Arreglo de objetos del tipo Robot (robot.js)
let dots=[]; //Graficado por lineas en el mapa (Muchas lineas, muerte de RAM)--Vectores
let rects=[]; //Graficado por rectangulos en el mapa (Muchos rectandulos, muerte de RAM)- Arreglo de objetos del tipo Simple(simpleLine.js)
let boxes=[]; //Grafico por cubos en el mapa Mas optimo- Arreglo de objetos Boxes (realBox.js)
let arboles=[]; //Arreglo de puntos del tipo exitPoint (randomTree.js)
let optionalPoints=[]; //Areglo que guarda los puntos generados pero no pudieron unirse (Quiza despues puedan unirse)
let fullLines=[]; //Intento de optimizar el arbol Arreglo de objetos del tipo Comple(CompleteLines.js)
let freePoints=[];//Intento por optimizar el arreglo del arbol RRT (randomTree.js)
let anglesInit=false; //Funcion que inicia los angulos de las rejillas de cada Robot
let stopRandom=false; //Bandera para deterner el árbol si encontro el punto final
let i,j,k,l,f;
let inicio;
let fin;
let ourGreen, ourRed; //Colores
let countx=0,county=0; //ColumnasxFilas de Robots que creamos
/*function preload(){
    f = loadFont("Inconsolata-Black.otf");
}*/
function setup(){
    createCanvas(canvasX,canvasY,WEBGL);
    debugMode(mapW, 12, 0, 0, 0, 50, -mapW/2, -400,0);
    ourGreen=0;
    ourRed=1;
    /*
    Ruta numero uno    
    inicio=new exitPoint(createVector(140,-180,-477.5),createVector(140,-180,-477.5),0,0);
    fin= new Boxes(createVector(resize(2700),-87,resize(-1075)),
    createVector(resize(2700),-93,resize(-1075)),
    createVector(resize(2700),-87,resize(-1025)),
    createVector(resize(2700),-93,resize(-1025)),
    createVector(resize(2770),-87,resize(-1075)),ourRed);*/
    //Ruta numero dos
    inicio= new exitPoint(createVector(317.5,0,-395),createVector(317.5,0,-395));
    fin= new Boxes(createVector(resize(3200),0,resize(-300)),createVector(resize(3300),-180,resize(-300)),
    createVector(resize(3300),0,resize(-440)),createVector(resize(3300),-180,resize(-440)),
    createVector(resize(3500),0,resize(-300)),ourRed);
    i=50;
    j=70;
    k=1; //Espacio entre los robots en columanas respecto al centro geometrico de los Robots
    l=1; //Espacio entre los robots en filas respecto al centro geometrico de los Robots
    //camera(0, -30, 875, 0, 0, 0, 0, 0, 0);
    //Se inicializan los robots
    for(let j=resize(1788);j<=resize(2000-70);j+=l){
        for(let i=resize(3000);i<=resize(3500-50);i+=k){
            evas.push(new Robot(i*20,j*20,100,140,'yellow',2));    
            if(j==resize(70)){
                countx++;
            }  
        }   
        county++;
    }       
    print(evas.length);
    print(county,countx);
    //walle=new Robot(2500,1040,100,140,'yellow',2);
    rounds(); //Se inicializan los bordes
    workSpace(); //Se inicializan los anaqueles 
    play=true;
    arboles.push(inicio); //Se inicializa la raiz del árbol
}
function draw(){
    if(play){
        background(220);
        orbitControl(); //Controlar el ambiente con el mouse
        push(); 
        translate(-mapW/2,-500,-mapW/2);

        //Inicializamos la regilla(objetos de tipo Line) de cada robot
        if(!anglesInit){
            for(let i of evas){
                for(let z of i.lines){
                    z.angles(i.x,i.y);
                }
            }
            anglesInit=true;
            //Para inicializar la rejilla de walle
            /*for(let g of walle.lines){
                g.angles(walle.x,walle.y);
            }*/
        }
        /*

        Ierar a walle por posición

        walle.dibujar();
        walle.collisionA();
        
        if(resize(i)<=resize(3500-50)){
            walle.position(resize(i),resize(j));
            i+=17;
        }else{
            if(resize(j)<=resize(2000-70)){
                j+=31;
                i=50;
            }
        }*/

        //Para obtimizar Los robots solo girará 180 graos
        for(let i=0;i<evas.length;i++){
            //strokeWeight(10);
            if(!evas[i].ready){
                evas[i].collisionA();
                //evas[i].dibujar();
            }else{
                //Para obtimizar los eliminamos.
                evas.splice(i,1);
            }
            //strokeWeight(1);
        }
        /*Se van a ir eliminando las evas, cuando pase por 1 se inicializan las lineas para pasarlas a
        rectangulos o planos para a su vez pasarlo a cubos.
        */
        if(evas.length==1){
            print('Listo!');
            dotOP();
            rectOp();
            dots=[];
            rects=[];
            print("Cubos:",boxes.length); //Total de cubos--Espacio de collison Color verde
        }
        startEndPoints(); //Rectangulo ver y rojo en el espacio de trabajo
        for(let i=0;i<=3;i++){
            walls[i].dibujar();
        }
        /*for (let i of walls){
            i.dibujar();
        }*/
        for(let i of anaqueles){
            i.dibujar();
        }
        pop();
        stroke(0);

        push();
        translate(-mapW/2,0,mapW/2);
        ejes();
        for(let rec of boxes){
            rec.dibujar();
            //frameRate(10);
        }
        if(evas.length==0){
            if(!stopRandom){
                rrt(); //Se calcula el árbol hasta que encuentre el punto final
                //print(arboles.length);
            }else{
                print("Acabe");
            }
        }
        
        //unificador();  Intento por optimizar las ramas
        //print(fullLines.length);
        for(let rama of arboles){
            rama.dibujar();
        }
        for(let ar of arboles){
            ar.alineado=false;
        }
        //print(arboles.length);
        //frameRate(60);
        //fill(0,255,0,100);
        fin.dibujar();
        //print(rects.length);
        point(0,0,0);
        pop();
    }
}
//Funcion para poner pausa
function keyPressed(){
    if(keyCode==80){
        play=!play;
    }
}
//Funcion que inicializa los bordes
function rounds(){
    walls.push(new Lines(v(0,0,0),v(0,resize(2000),0),'blue',0,0));
    walls.push(new Lines(v(0,0,0),v(resize(3500),0,0),'blue',0,0));
    walls.push(new Lines(v(resize(3500),resize(2000),0),v(0,resize(2000),0),'blue',0,0));
    walls.push(new Lines(v(resize(3500),resize(2000),0),v(resize(3500),0),'blue',0,0));
    //walls.push(new Lines(v(resize(850),0,0),v(resize(850),resize(2000),0),'blue'));
    //walls.push(new Lines(v(resize(970),0,0),v(resize(970),resize(2000),0),'blue'));
}
//Crear un vector
function v(x,y,z){
    return createVector(x,y,z);
}
//Puntos en terminos de 35000/20 y 2000/20
function resize(x){
    return x/20;
}
//Inicializacion espacio de trabajo
function workSpace(){
    //anaqueles.push(new Anaquel(resize(140),resize(180),0,resize(1820),'green','Entrada de\n Material',10,resize(1),true));
    //anaqueles.push(new Anaquel(resize(180),resize(140),resize(3320),resize(300),'red','Salida de\n Material',10,resize(1),false));
    let hilera1=resize(610);
    for(let i=1;i<=5;i++){
        anaqueles.push(new Anaquel(resize(240),resize(1500),hilera1,resize(200),'yellow','Anaquel '+i+'',25,resize(375),true,8));
        hilera1+=resize(360);
    }
    hilera1=resize(740);
    for(let i=6;i<=8;i++){
        anaqueles.push(new Anaquel(resize(750),resize(240),resize(2450),hilera1,'yellow','Anaquel '+i+'',25,resize(10),false,8));
        hilera1+=resize(360);
    }
}
//Las Rejillas simepre se van a crear en 0 por los translate y rotate
function lineCenter(x,y,w,h){
    return createVector(x-(w/2),y-(h/2),0);
}
//Generado de rejillas para Robots
function grating(x,y,w,h,grid){
    let lines=[];
    let stopy=(h)/grid;
    let stopx=(w)/grid;
    for(let i=0;i<=grid;i++){
        lines.push(new Lines(lineCenter(0,(i*stopy),w,h),lineCenter(w,(i*stopy),w,h),'blue',x,y));
        lines.push(new Lines(lineCenter((i*stopx),h,w,h),lineCenter((i*stopx),0,w,h),'blue',x,y));
        if(i>0){
            lines.push(new Lines(lineCenter(0,i*stopy,w,h),lineCenter(i*stopx,0,w,h),'blue',x,y));
            lines.push(new Lines(lineCenter(w,h-i*stopy,w,h),lineCenter(w-i*stopx,h,w,h),'blue',x,y));
        }
    }
    lines.push(new Lines(lineCenter(0,h,w,h),lineCenter(w,0,w,h),'blue',x,y));
    return lines;
}
//Generado de rejillas para anaqueles
function gratingA(x,y,w,h,grid){
    let lines=[];
    let stopy=h/grid;
    let stopx=w/grid;
    for(let i=0;i<=grid;i++){
        lines.push(new Lines(createVector(x,y+(i*stopy),x,y),createVector(x+w,y+(i*stopy),x,y),'blue',x,y));
        lines.push(new Lines(createVector(x+(i*stopx),y+h,x,y),createVector(x+(i*stopx),y,x,y),'blue',x,y));
        if(i>0){
            lines.push(new Lines(createVector(x,y+i*stopy,x,y),createVector(x+i*stopx,y,x,y),'blue',x,y));
            lines.push(new Lines(createVector(x+w,y+h-i*stopy,x,y),createVector(x+w-i*stopx,y+h,x,y),'blue',x,y));
        }
    }
    lines.push(new Lines(createVector(x,y+h,x,y),createVector(x+w,y,x,y),'blue',x,y));
    return lines;
}
//Funcion que pinta "Los lugares de entrada y salida del material"
function startEndPoints(){
    fill(0,255,0);
    rect(0,resize(1820),resize(140),resize(180));
    fill(255,0,0)
    rect(resize(3320),resize(300),resize(180),resize(140));
}
/*Funcion que inicializa los angulos de la regilla para rotar 
sin funcion rotate si no por seno y coseno*/
function getAngles(x,y,ax,ay,bx,by){
    let a,b;
    let aux=[];
    push();
    translate(x,y);
    let v1=createVector(ax,ay);
    let v2=createVector(bx,by);
    let v3=createVector(1,0); 
    a=v3.angleBetween(v1);
    b=v3.angleBetween(v2);
    pop();
    aux.push(a);
    aux.push(b);
    return aux;
}
/*Funcion que pinta los ejes push y pops comentandos por que el texto en 3d 
solo es posible ejecuatando el programa en un servidor*/
function ejes(){
    //Eje x
    //textSize(10);
    stroke(0);
    fill(0);
    let p1;
    let p2;
    for (let i=0;i<=3500;i+=50){
        p1=maps(tosize(i),-5,0);
        p2=maps(tosize(i),5,0);
        line(p1.x,p1.y,p1.z,p2.x,p2.y,p2.z);
        /*push();
          translate(resize(i),0,0);
          rotateX(PI/2);
          rotateZ(PI/2);
          text(''+int(i)+'',0,0);
        pop();*/
        p1=maps(870,tosize(i),0);
        p2=maps(880,tosize(i),0);
        line(p1.x,p1.y,p1.z,p2.x,p2.y,p2.z);
        /*push();
          translate(880,0,-resize(i));
          rotateX(PI/2);
          //rotateZ(PI/2);
          text(''+int(i)+'',0,0);
        pop();*/
    }
    for (let i=0;i<=360;i+=10){
        p1=maps(870,0,i);
        p2=maps(880,0,i);
        line(p1.x,p1.y,p1.z,p2.x,p2.y,p2.z);
        /*push();
          translate(880,-i,0);
          text(''+int(i)+'',0,0);
        pop();*/
    }
}
//Transformación lineal para graficar
function maps(x,y,z){
    return createVector(x,-z,-y);
}
//Funcion que dado un punto real la vuelve en terminos de la grafica
function tosize(x){
    return x/4;
}
//Funcion que dado un puntoescalado /20 lo devulve en terminos de la grafica
function mapSize(x){
    return x*5;
}
//dotOp -dots Optimizacion- Transformamos de lineas formadas por puntos a planos en el espacio   
function dotOP(){
    let start;
    let finish;
    let count=[];
    let nua=0;
    let dotsCopy=count.concat(dots);
    for(let i of dotsCopy){
        if(i != undefined )
        {
            start=i;
                finish=i;
                for (let o=0;o<dotsCopy.length;o++){
                    if(dotsCopy[o]!=undefined){
                        if((finish.v1.y==dotsCopy[o].v1.y) && (finish.v2.y==dotsCopy[o].v2.y) && (finish.v1.z==dotsCopy[o].v1.z) && (finish.v1.x+k==dotsCopy[o].v1.x)){
                            //print(finish.v1.x,dotsCopy[o].v1.x,nua,o);
                            //print(i.v1.y,i.v2.y)
                            finish=dotsCopy[o];
                            if(finish.v1.x<start.v1.x){
                                let aux=start;
                                start=finish;
                                finish=aux;
                                //dotsCopy.splice(i,1);
                                //o-=1;
                                //delete dotsCopy[o];
                            }
                            delete dotsCopy[o];
                            //dotsCopy.splice(o,1);
                            //o-=1;
                        }
                    }
                }
                //nua++;
                //delete dotsCopy[nua];
                if(finish!=i){
                    //print(true)
                    finish.v1.x+=k;
                    finish.v2.x+=k;
                    rects.push(new moreSimple(start.v1,start.v2,finish.v1,finish.v2));
                }else{
                    //start.v1.x+=resize(k);
                    //start.v2.x+=resize(k);
                    rects.push(new moreSimple(i.v1,i.v2,createVector(i.v1.x+k,i.v1.y,i.v1.z),createVector(i.v2.x+k,i.v2.y,i.v2.z)));
                }
            }
        }
}
//dotOp -rects Optimizacion- Transformamos los planos formados por lineas a cubos en el espacio   
function rectOp(){
    let start;
    let finish;
    let count=[];
    let nua=0;
    let rectsCopy=count.concat(rects);
    for(let i of rectsCopy){
        start=i;
        finish=i;
        if(i!=undefined){
            for(let r=0;r<rectsCopy.length;r++){
                if(rectsCopy[r]!=undefined){
                    if((finish.v1.y==rectsCopy[r].v1.y) && (finish.v2.y==rectsCopy[r].v2.y) && (finish.v1.x==rectsCopy[r].v1.x) && (finish.v1.z-l==rectsCopy[r].v1.z)){
                        finish=rectsCopy[r];
                        if(finish.v1.x<start.v1.x){
                            let aux=start;
                            start=finish;
                            finish=aux;
                            //dotsCopy.splice(i,1);
                            //o-=1;
                            //delete dotsCopy[o];
                        }
                        delete rectsCopy[r];
                    }
                }
            }
            if(finish!=i){
                //print(finish.v1.y,finish.v2.y,i.v1.y,i.v2.y);
                //print(true)
                finish.v1.z-=l;
                finish.v2.z-=l;
                boxes.push(new Boxes(start.v1,start.v2,finish.v1,finish.v2,start.v3,ourGreen));
            }else{
                //start.v1.x+=resize(k);
                //start.v2.x+=resize(k);
                //print(nua-1);
                boxes.push(new Boxes(i.v1,i.v2,createVector(i.v1.x,i.v1.y,i.v1.z-l),createVector(i.v2.x,i.v2.y,i.v2.z-l),i.v3,ourGreen));
            }
        }
    }
}
//Argoritmo RRT
function rrt(){
    //let nodos=int(random(1,101));
    let nodos=1000;
    let distancia=30;
    let minimo=Infinity;
    let auxf;
    let npoints=[];
    let mitades=[];
    let diviciones = 10;
    //let nv;
    for(let r=0;r<nodos;r++){
        npoints.push(createVector((random(-851,851)),(random(-360,361)),(random(475,-475))));
        //npoints.push(p5.Vector.random3D().setMag(random(-851,851)));
    }
    
    for(let nodo of npoints){

        for(let arbol of arboles){
            if(arbol.v1.dist(nodo)<minimo){
                minimo=arbol.v1.dist(nodo);
                auxf=arbol;
            }
        }
        minimo=Infinity;
        for(let p=0;p<diviciones;p++){
            let aux=nodo;
            mitades.push(aux.setMag(distancia/(p+1)));
            let aux2=mitades[p];
            mitades[p]=p5.Vector.add(auxf.v1,aux2);
        }
        //nodo.setMag(distancia);
        //print(auxf.v1);
        //let aa= nodo;
        //nodo=p5.Vector.add(auxf.v1,aa);
        //mitad=p5.Vector.add(auxf.v1,doblea);
        let verdadero=false;
        let refor=false;
        for(let b of boxes){
            if(!verdadero){
                    for(let i =0;i<mitades.length;i++){
                        if(i==0){
                            if(b.into(mitades[0])){
                                refor=true;
                            }
                        }
                        if(b.into(mitades[i])){
                            verdadero=true;
                            break;
                        }
                    }
                }
        }
        
        //pop();
        if(!verdadero){
            //print(nodo);
            if(mitades[0].x>=51 && mitades[0].x<=862 && mitades[0].y>=-360 && mitades[0].y<=0 && mitades[0].z>=-465 && mitades[0].z<=-35){
                //print(nodo);
                arboles.push(new exitPoint(mitades[0],auxf.v1,arboles.length,auxf.myplace));
                if(fin.into(mitades[0])){
                    stopRandom=true;
                }
            }
        }else{
            if(!refor){
                optionalPoints.push(mitades[0]);
            }
        }
        aux=undefined;
        mitades=[];
    }
    //noLoop();
    for(let nodo=0;nodo < optionalPoints.length ; nodo++){

        for(let arbol of arboles){
            if(arbol.v1.dist(optionalPoints[nodo])<minimo){
                minimo=arbol.v1.dist(optionalPoints[nodo]);
                auxf=arbol;
            }
        }
        minimo=Infinity;
        for(let p=0;p<diviciones;p++){
            let aux=optionalPoints[nodo];
            mitades.push(aux.setMag(distancia/(p+1)));
            let aux2=mitades[p];
            mitades[p]=p5.Vector.add(auxf.v1,aux2);
        }
        //optionalPoints[nodo].setMag(distancia);
        //print(auxf.v1);
        //let aa= optionalPoints[nodo];
        //optionalPoints[nodo]=p5.Vector.add(auxf.v1,aa);
        //mitad=p5.Vector.add(auxf.v1,doblea);
        let verdadero=false;
        for(let b of boxes){
            if(!verdadero){
                    for(let i =0;i<mitades.length;i++){
                        if(b.into(mitades[i])){
                            verdadero=true;
                            break;
                        }
                    }
                }
        }
        
        //pop();
        if(!verdadero){
            //print(optionalPoints[nodo]);
            if(mitades[0].x>=51 && mitades[0].x<=862 && mitades[0].y>=-360 && mitades[0].y<=0 && mitades[0].z>=-465 && mitades[0].z<=-35){
                //print(optionalPoints[nodo]);
                arboles.push(new exitPoint(mitades[0],auxf.v1,arboles.length,auxf.myplace));
                if(fin.into(mitades[0])){
                    stopRandom=true;
                }
                optionalPoints.splice(nodo,1);
            }
        }
        aux=undefined;
        mitades=[];
    }
    //noLoop();
}
//Intento de optimizar las ramas del arbol
function unificador(){
    //let copy=[];
    let lineador=[];
    fullLines=[];
    //copy=lineador.concat(arboles);
    //print(arboles.length);
    lineador=[];
    for(let arbolito=arboles.length-1;arbolito>=1;arbolito--){
        lineador=[];
        if(arboles[arbolito].alineado==false){
            let aux=[];
            lineador=aux.concat(seguidilla(arboles[arbolito],arboles[arboles[arbolito].placef]));
            if(lineador.length==1){
                lineador.push(arboles[arboles[arbolito].placef].v1);
            }
            //print(lineador.length)
            fullLines.push(new Comple(lineador));
        }else{
           // print(true);
        }
        //noLoop();
    }
    //print(fullLines.length);
}
//Intento por optimizar
function seguidilla(arbolito,father){
    let seg=[];
    let aux=[];
    if(!arbolito.alineado && !arbolito.v1.equals(father.v1) && !father.alineado){
        aux.push(arbolito.v1);
        seg=aux.concat(seguidilla(father,arboles[father.placef]));
        father.alineado=true;
        arbolito.alineado=true;
    }else{
        seg.push(father.v1);
        arbolito.alineado=true;
    }
    return seg;
}