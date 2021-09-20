import * as THREE from "https://threejs.org/build/three.module.js"; 
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://threejs.org/examples/jsm/loaders/GLTFLoader.js";

import { Water } from  "https://threejs.org/examples/jsm/objects/Water.js";
import { FBXLoader } from "https://threejs.org/examples/jsm/loaders/FBXLoader.js";
import { GUI } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/libs/dat.gui.module.js';


//varaibles for the 3D models 

let spine, spine1, spine2, head, rightArm, leftArm, body, rightForeArm, leftForeArm, hip, rightUpLeg, rightLeg, rightFoot, rightToeBase, leftUpLeg, leftLeg, leftFoot, leftToeBase, rightHand, leftHand;
let objectBird, birdBody, birdRoot, birdLeftWingPivot, birdLeftWingTip, birdRightWingPivot, birdRightWingTip;
let car;
let objectChick, chickLeftLeg, chickRightLeg, chickRightFoot, chickLeftFoot, chickRightWing, chickLeftWing, chickHead; 

//animation varibles to start and stop the animation
var animationSwitch = false;
var carAnimationSwitch = false;
var walkingChicken= false;
var eatingChicken = false;
var flyingChicken = false;

//parameters for the car speed
var speed= 0.08;
var speedWheels = 4;

//variables for the bird animation
var invertLeftWing = 0;
var invertRightWing = 0;
var speedWing = 3;

//variables to move the bird in the scene
var xMove = 0.0001;
var yMove = 0.0001;


//scene and camera 
var scene, camera, renderer, controls, water;
var directionalLight;

//texture loader
const textureLoader = new THREE.TextureLoader();

//pivot variable for the rotation of object around the lightHouse (oggetto coprente)
var pivotPoint;

//Water generation function

function buildWater() {
    const waterGeometry = new THREE.CircleGeometry(30, 30);
     water = new Water(
      waterGeometry,
      {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load('./Textures/water/Water_002_NORM.jpg', function ( texture ) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),
        alpha: 1.0,
      }
    );
    water.rotation.x =- Math.PI / 2;
    water.position.x = 100;
    water.position.y = 1;
    water.position.z = -80;
    
    return water;
  }

//clouds generation function

function cloudGen(){

    const cloudGroup = new THREE.Group();
    const cloudColor = new THREE.MeshLambertMaterial({
        color:'white',
    });

    const sphere1 =  new THREE.SphereGeometry(3, 14, 16);
    const sphereCloud1 = new THREE.Mesh(sphere1, cloudColor);
    sphereCloud1.castShadow = true;
    sphereCloud1.position.set(-2,30,0);
    cloudGroup.add(sphereCloud1);

    const sphere2 = new THREE.SphereGeometry(3, 14, 16);
    const sphereCloud2 =  new THREE.Mesh(sphere2, cloudColor);
    sphereCloud2.castShadow = true;
    sphereCloud2.position.set(2,30,0);
    cloudGroup.add(sphereCloud2);

    const sphere3 = new THREE.SphereGeometry(3.5, 14, 16);
    const sphereCloud3 =  new THREE.Mesh(sphere3, cloudColor);
    sphereCloud3.castShadow = true;
    sphereCloud3.position.set(0,30,0);
    cloudGroup.add(sphereCloud3);

    return cloudGroup;

}

//treePine function for the pines generation

function treePine(){

   const baseColorPineTrunk = textureLoader.load('./Textures/Wood/Bark_06_basecolor.jpg');
   const bumpMapPineTrunk = textureLoader.load('./Textures/Wood/Bark_06_normal.jpg');

    var treeGroup = new THREE.Group();
    const colorTree = new THREE.MeshLambertMaterial({color: 'green' });
    
    const colorTrunk = new THREE.MeshStandardMaterial({
        map: baseColorPineTrunk,
        normalMap: bumpMapPineTrunk,
    });

    const cone1Tree = new THREE.ConeGeometry(1.5,2,8);
    const cone1 = new THREE.Mesh( cone1Tree, colorTree);
    cone1.position.y = 4;
    cone1.position.x = 0;
    cone1.castShadow = true;
    treeGroup.add(cone1);

    const cone2Tree = new THREE.ConeGeometry(2,2,8);
    const cone2 = new THREE.Mesh( cone2Tree, colorTree);
    cone2.position.y = 3;
    cone2.position.x = 0;
    cone2.castShadow = true;
    treeGroup.add(cone2);

    const cone3Tree = new THREE.ConeGeometry(3,2,8);
    const cone3 = new THREE.Mesh( cone3Tree, colorTree);
    cone3.position.y = 2;
    cone3.position.x = 0;
    cone3.castShadow = true;
    treeGroup.add(cone3);

    const trunkTree = new THREE.CylinderGeometry(0.5,0.5,2);
    const trunk = new THREE.Mesh( trunkTree, colorTrunk);
    trunk.position.y = 0;
    trunk.position.x = 0;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    treeGroup.add(trunk);

    return treeGroup;

}

//treeRound function to generate the round trees

function treeRound(){

    var treeRoundGroup = new THREE.Group();

    const treeRoundCol = new THREE.MeshLambertMaterial({color: '#90EE90'});
    const trunkRoundCol = new THREE.MeshLambertMaterial({color: '#d3d3d3'});

    const trunkTreeRound = new THREE.IcosahedronGeometry(9, 0);
    const trunkRound = new THREE.Mesh( trunkTreeRound, trunkRoundCol);
    trunkRound.rotation.x = Math.PI / 2;
    trunkRound.position.x = 7;
    trunkRound.position.y = 11;
    trunkRound.scale.set(0.2, 0.2, 3);
    trunkRound.castShadow = true;
    trunkRound.receiveShadow = true;
    treeRoundGroup.add(trunkRound);
    
    const branchTree = new THREE.IcosahedronGeometry(6, 0);
    const branch = new THREE.Mesh (branchTree, trunkRoundCol);
    branch.rotation.x = Math.PI/2;
    branch.rotation.y = Math.PI/4;
    branch.position.x = 1;
    branch.position.y = 25;
    branch.scale.set(0.2, 0.2, 2);
    branch.castShadow = true;
    treeRoundGroup.add(branch);
   
    const branchTree2 = new THREE.IcosahedronGeometry(6, 0);
    const branch2 = new THREE.Mesh (branchTree2, trunkRoundCol);
    branch2.rotation.x = Math.PI/2;
    branch2.rotation.y = - Math.PI/4;
    branch2.position.x = 13;
    branch2.position.y = 28;
    branch2.scale.set(0.1, 0.1, 1.5);
    branch2.castShadow = true;
    treeRoundGroup.add(branch2);
   
    const crownRound = new THREE.IcosahedronGeometry(20,0);
    const crown = new THREE.Mesh(crownRound, treeRoundCol );
    crown.position.x = 7;
    crown.position.y = 40;
    crown.scale.set(1,0.5,1);
    crown.castShadow = true;
    treeRoundGroup.add(crown);
   
    const crownRound2 = new THREE.IcosahedronGeometry(15,0);
    const crown2 = new THREE.Mesh(crownRound2, treeRoundCol );
    crown2.position.x = -4;
    crown2.position.y = 30;
    crown2.scale.set(1, 0.5, 0.5);
    crown2.castShadow = true;
    treeRoundGroup.add(crown2);
   
    const crownRound3 = new THREE.IcosahedronGeometry(15,0);
    const crown3 = new THREE.Mesh(crownRound3, treeRoundCol );
    crown3.position.x = 20;
    crown3.position.y = 35;
    crown3.scale.set(1, 0.4, 0.5);
    crown3.castShadow = true;
    treeRoundGroup.add(crown3);
    
    return treeRoundGroup;

}

//Street generation function
    
function streeGen(){
    
    const street = new THREE.BoxGeometry( 15,10,99, 100, 100, 100);
    street.translate( 0.5, 0.5, 0 );

    const colorTextStreet = textureLoader.load('./Textures/street/Stylized_Stone_Wall_001_basecolor.jpg');
    const bumpMapStreet = textureLoader.load('./Textures/street/Stylized_Stone_Wall_001_normal.jpg');
    const displacementMapStreet = textureLoader.load('./Textures/street/Stylized_Stone_Wall_001_height.png');
    const roughMapStreet = textureLoader.load('./Textures/street/Stylized_Stone_Wall_001_roughness.jpg');

    const streetMaterial = new THREE.MeshStandardMaterial({
        map:colorTextStreet,
        normalMap:bumpMapStreet,
        displacementMap:  displacementMapStreet,
        displacementBias: -0.5,
        roughnessMap: roughMapStreet,
        roughness: 0.5,
    });

    const streetMesh = new THREE.Mesh(street, streetMaterial);
    streetMesh.position.x = 30;
    streetMesh.position.z = 1;
    streetMesh.scale.set(3,0.5,3);
    streetMesh.castShadow = true;
    streetMesh.receiveShadow = true;

    return streetMesh;

    }

//metallic fence generation function
    
function fenceGen(){

    const fenceColor = textureLoader.load('./Textures/metalFence/Metal_Hammered_001_basecolor.jpg');
    const fenceNormalMap = textureLoader.load('./Textures/metalFence/Metal_Hammered_001_normal.jpg');
    const fenceDisplaceMap = textureLoader.load('./Textures/metalFence/Metal_Hammered_001_height.png');
    const fenceRoughMap = textureLoader.load('./Textures/metalFence/Metal_Hammered_001_roughness.jpg');
    const fenceMetallic =  textureLoader.load('./Textures/metalFence/Metal_Hammered_001_metallic.jpg');

    var fenceGroup = new THREE.Group();

    const cylinder1 = new THREE.CylinderGeometry( 2,2,300,32);
    const materialBar = new THREE.MeshStandardMaterial({
        map:fenceColor,
        normalMap:fenceNormalMap,
        displacementMap: fenceDisplaceMap,
        displacementScale: 0.5,
        displacementBias: -0.5,
        roughnessMap: fenceRoughMap,
        roughness: 0.5,
        metalnessMap: fenceMetallic,
        metalness: 1
    });


    const horizontalBar = new THREE.Mesh( cylinder1, materialBar );

    horizontalBar.rotation.x = Math.PI/2;
    horizontalBar.position.y = 10;
    horizontalBar.castShadow = true;
    horizontalBar.receiveShadow = true;
    fenceGroup.add(horizontalBar);

    const cylinder2 = new THREE.CylinderGeometry(2,2,16,32);
    const verticalBarRight =  new THREE.Mesh( cylinder2, materialBar );
    verticalBarRight.position.z = 140;
    verticalBarRight.position.y = 5;
    verticalBarRight.receiveShadow = true;
    verticalBarRight.castShadow = true;
    fenceGroup.add(verticalBarRight);

    const cylinder3 = new THREE.CylinderGeometry(2,2,16,32);
    const verticalBarLeft =  new THREE.Mesh( cylinder3, materialBar );
    verticalBarLeft.position.z = -140;
    verticalBarLeft.position.y = 5;
    verticalBarLeft.castShadow = true;
    verticalBarLeft.receiveShadow = true;
    fenceGroup.add(verticalBarLeft);

    const cylinder4 = new THREE.CylinderGeometry(2,2,16,32);
    const verticalBarMid1 =  new THREE.Mesh( cylinder4, materialBar );
    verticalBarMid1.position.z = 35;
    verticalBarMid1.position.y = 5;
    verticalBarMid1.castShadow = true;
    verticalBarMid1.receiveShadow = true;
    fenceGroup.add(verticalBarMid1);

    const cylinder5 = new THREE.CylinderGeometry(2,2,16,32);
    const verticalBarMid2 =  new THREE.Mesh( cylinder5, materialBar );
    verticalBarMid2.position.z = -35;
    verticalBarMid2.position.y = 5;
    verticalBarMid2.castShadow = true;
    verticalBarMid2.receiveShadow = true;
    fenceGroup.add(verticalBarMid2);

    return fenceGroup;

}


//Circle of stones generation function

function circleStoneGen(){
    var geomStone = new THREE.DodecahedronGeometry(3,0);
    var stoneColor = new THREE.MeshLambertMaterial({color: '#bababa'});
    var stoneArr = [];

    var radius = 20;

    for(var i = 0; i < 15; i++){

        stoneArr[i] = new THREE.Mesh(geomStone, stoneColor);
        
        stoneArr[i].position.x = radius*Math.cos(i) + radius*Math.sin(i) ;
        stoneArr[i].position.z = radius*Math.cos(i) - radius*Math.sin(i);
        stoneArr[i].translateX(100);
        stoneArr[i].translateZ(-80);
        stoneArr[i].castShadow = true;

        var toss = (Math.random()*(2 - 0));
        var tossInt = parseInt(toss);

        if(tossInt == 0){

        stoneArr[i].scale.set( 3 , 5 , 3);

        } else{
            stoneArr[i].scale.set(3, 2, 3);
        }

        scene.add(stoneArr[i]);

    }
}
    
//Mountain generation function

function mountainGen(){
    var geomMountain = new THREE.DodecahedronGeometry(3,0);
    var mountainColor = new THREE.MeshLambertMaterial({color: '#bababa'});
    var mountainArr = [];

    for(var i = 0; i < 30; i++){

        mountainArr[i] = new THREE.Mesh(geomMountain, mountainColor);
        
        mountainArr[i].position.x = parseInt(Math.random()*(70-20));
        mountainArr[i].position.z = parseInt(Math.random()*(120-0));

    
        mountainArr[i].translateX(80);
        mountainArr[i].translateY(18);
        mountainArr[i].translateZ(0);
        mountainArr[i].castShadow = true;

        var toss = (Math.random()*(2 - 0));
        var tossInt = parseInt(toss);
        var height = (Math.random()*(20 - 0));
        var width = (Math.random()*(20 - 10));
        

        if(tossInt == 0){

            mountainArr[i].scale.set( 8 , height + 8 , width + 4);

        } else{
            mountainArr[i].scale.set( 3 , height , width);
        }

        scene.add(mountainArr[i]);
    }

}

//sand road generation function

function sandRoadGen(){

    const road = new THREE.BoxGeometry( 10,10,99, 100, 100, 100);
    road.translate( -15, 0.5, 0 );

    const colorTextRoad = textureLoader.load('./Textures/sandRoad/Sand_004_COLOR.png');
    const bumpMapRoad = textureLoader.load('./Textures/sandRoad/Sand_004_Normal.png');
    const displacementMapRoad = textureLoader.load('./Textures/sandRoad/Sand_004_Height.png');
    const roughMapRoad = textureLoader.load('./Textures/sandRoad/Sand_004_ROUGH.png');

    const roadMaterial = new THREE.MeshStandardMaterial({ 
        map:colorTextRoad,
        normalMap:bumpMapRoad,
        displacementMap:  displacementMapRoad,
        displacementBias: -0.9,
        roughnessMap: roughMapRoad,
        roughness: 0.5,
    });

    const roadMesh = new THREE.Mesh(road, roadMaterial);
    roadMesh.position.x = 20;
    roadMesh.position.z = 1;
    roadMesh.scale.set(3,0.5,3);
    roadMesh.castShadow = true;
    roadMesh.receiveShadow = true;

    return roadMesh;

}

//Function to create textures on the front and lateral part of the car 

function frontTextureCar(){

    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 50;
    const context = canvas.getContext("2d");

    context.fillStyle =  "#ffffff";
    context.fillRect(0, 0, 64, 32);

    context.fillStyle = "#666666";
    context.fillRect(8, 8, 48, 24);

    return new THREE.CanvasTexture(canvas);

}

function sideTextureCar(){

    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 50;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 128, 32);

    context.fillStyle = "#666666";
    context.fillRect(10, 8, 38, 24);
    context.fillRect(58, 8, 60, 24);

    return new THREE.CanvasTexture(canvas);

}

//car creation function

function createCar(){
    const tireTextureMap = textureLoader.load('./Textures/tire/rim.png');

    var carGroup = new THREE.Group();
    
    const carBodyColor = new THREE.MeshLambertMaterial({color:'red'});
    
    //car cabin settings

    const textureFrontCar = frontTextureCar();
    const textureSideCar = sideTextureCar();

    const carCabinSet = new THREE.BoxGeometry( 4, 4, 6,30 ,30);
    const carCabin = new THREE.Mesh(carCabinSet, [

        new THREE.MeshLambertMaterial({map: textureSideCar}),
        new THREE.MeshLambertMaterial({ map: textureSideCar }),
        new THREE.MeshLambertMaterial({ color: 'white' }), //top
        new THREE.MeshLambertMaterial({ color: 'white' }), // bottom
        new THREE.MeshLambertMaterial({ map: textureFrontCar }),
        new THREE.MeshLambertMaterial({ map: textureFrontCar }),
    ]
        );
    carCabin.position.set(0,3,1);
    carCabin.castShadow = true;
    carGroup.add(carCabin);

    //car body settings

    const carBodySet = new THREE.BoxGeometry( 5, 2 , 10, 30, 30);
    const carBody = new THREE.Mesh(carBodySet, carBodyColor);
    carBody.castShadow = true;
    carBody.position.set(0,2,0)
    carGroup.add(carBody);

    //car exhaust pipe settings

    const carPipeSet = new THREE.CylinderGeometry(1,1,5,32);
    const carPipeColor = new THREE.MeshLambertMaterial({color:'grey'});
    const carPipe = new THREE.Mesh(carPipeSet, carPipeColor);
    carPipe.position.set(1.5,1.5,5);
    carPipe.rotation.x = Math.PI/2;
    carPipe.scale.set(0.3,0.3,0.3);

    carPipe.castShadow = true;
    carGroup.add(carPipe);

    //car tires settings 

    var tires = [];
    const carTireSet = new THREE.CylinderGeometry(1,1,1,32);
   
    for( var i=0; i<4; i++){
    
    
        tires[i] = new THREE.Mesh(carTireSet, [

            new THREE.MeshLambertMaterial({color:'black'}),
            new THREE.MeshLambertMaterial({map:tireTextureMap}),
            new THREE.MeshLambertMaterial({map:tireTextureMap}),
        ]);
        
        tires[i].rotation.x = Math.PI / 2;
        tires[i].rotation.z = Math.PI / 2;
        tires[i].castShadow = true;
        carGroup.add(tires[i]);

    }

    tires[0].position.set(2.5, 0.5,3);
    tires[1].position.set(-2.5, 0.5, 3);
    tires[2].position.set(2.5, 0.5, -3);
    tires[3].position.set(-2.5, 0.5, -3);

    carGroup.scale.set(3,3,3);
    carGroup.position.set(30,4.5,130);
    return carGroup;
    
}
    

//function for the generation of the lamps along the road

function createLamp(){

    const colorTextLamp = textureLoader.load('./Textures/bark/Stylized_Bark_001_COLOR.jpg');
    const bumpTextLamp = textureLoader.load('./Textures/bark/Stylized_Bark_001_NORM.jpg');
    const displaceTextLamp = textureLoader.load('./Textures/bark/Stylized_Bark_001_DISP.png');
    const roughMapLamp = textureLoader.load('./Textures/bark/Bark_001_SPEC.jpg');

    const groupLamp = new THREE.Group();

    const circleLampSet = new THREE.SphereGeometry(5, 32, 16);
    const lampLight = new THREE.PointLight( 0xffee88, 1, 100, 2 )
    const circleLampMaterial = new THREE.MeshStandardMaterial( {
        emissive: 0xffffee,
        emissiveIntensity: 1,
        color: 0x000000
    });

    lampLight.add(new THREE.Mesh(circleLampSet, circleLampMaterial));
    lampLight.position.set(7,52,0);
    lampLight.castShadow = true;
    groupLamp.add(lampLight);

    const lightPoleSet = new THREE.CylinderGeometry(1,1,18,32);

    const lightPoleMaterial = new THREE.MeshStandardMaterial({ 
        map:colorTextLamp,
        normalMap:bumpTextLamp,
        displacementMap:  displaceTextLamp,
        displacementBias: -0.8,
        roughnessMap: roughMapLamp,
        roughness: 0.5,
    });

    const lightPoleVertical = new THREE.Mesh(lightPoleSet, lightPoleMaterial);
    lightPoleVertical.scale.set(2,4,2);
    lightPoleVertical.position.set(-6,30,0);
    groupLamp.add(lightPoleVertical);

    const lightPoleHorizontal = new THREE.Mesh(lightPoleSet, lightPoleMaterial);
    lightPoleHorizontal.scale.set(2,1,2);
    lightPoleHorizontal.rotation.z = -Math.PI/2;
    lightPoleHorizontal.position.set(0,60,0);
    groupLamp.add(lightPoleHorizontal);

    const miniPoleVerticalSet = new THREE.IcosahedronGeometry(2,0);
    const miniPole = new THREE.Mesh(miniPoleVerticalSet, lightPoleMaterial);
    miniPole.position.set(7,60,0);
    miniPole.scale.set(1,3,1)
    groupLamp.add(miniPole);

    return groupLamp;
}

//chicken fence generation function

function woodFenceGen(){

    const woodfenceColor = textureLoader.load('./Textures/woodFence/Stylized_Wood_Planks_001_basecolor.jpg');
    const woodfenceNormalMap = textureLoader.load('./Textures/woodFence/Stylized_Wood_Planks_001_normal.jpg');
    const woodfenceDisplaceMap = textureLoader.load('./Textures/woodFence/Stylized_Wood_Planks_001_height.png');
    const woodfenceRoughMap = textureLoader.load('./Textures/woodFence/Stylized_Wood_Planks_001_roughness.jpg');
   
 
    var woodfenceGroup = new THREE.Group();
 
    const box1 = new THREE.BoxGeometry( 10,1,1 );
    const materialFence = new THREE.MeshStandardMaterial({
        map:woodfenceColor,
        normalMap:woodfenceNormalMap,
        displacementMap: woodfenceDisplaceMap,
        displacementBias: -0.25,
        roughnessMap: woodfenceRoughMap,
        roughness: 0.5,
       
    });
 
 
    const horizWood = new THREE.Mesh( box1, materialFence );
 
    horizWood.position.set(-90, 7, 0);
    horizWood.scale.set(5,3,4)
    horizWood.castShadow = true;
    horizWood.receiveShadow = true;
    woodfenceGroup.add(horizWood);
    
 
 
    const horizWood2 = new THREE.Mesh( box1, materialFence );
 
    horizWood2.position.set(-90, 15, 0);
    horizWood2.scale.set(5,3,4)
    horizWood2.castShadow = true;
    horizWood2.receiveShadow = true;
    woodfenceGroup.add(horizWood2);
 
    const verWood = new THREE.Mesh( box1, materialFence );
 
    verWood.position.set(-70, 10, 0);
    verWood.rotation.z = -Math.PI/2;
    verWood.scale.set(2,2,4)
    verWood.castShadow = true;
    verWood.receiveShadow = true;
    woodfenceGroup.add(verWood);
 
    const verWood2 = new THREE.Mesh( box1, materialFence );
 
    verWood2.position.set(-110, 10, 0);
    verWood2.rotation.z = -Math.PI/2;
    verWood2.scale.set(2,2,4)
    verWood2.castShadow = true;
    verWood2.receiveShadow = true;
    woodfenceGroup.add(verWood2);
 
    return woodfenceGroup;
}





function init(){

    scene = new THREE.Scene();

    //camera

    camera = new THREE.PerspectiveCamera(40, 
        window.innerWidth/ window.innerHeight, 
        0.1, 
        10000
        );
        
    //DAT.GUI

    const gui = new GUI({width:300 });

    //camera folder 

    const cameraFolder = gui.addFolder("camera");
    cameraFolder.add(camera.position, "x", 0, 300);
    cameraFolder.add(camera.position, "y", 0, 300);
    cameraFolder.add(camera.position, "z", 0, 300);

    //parameters for the chicken

    var params = {
        animationSwitch: false,
        walkingChicken: false,
        eatingChicken: false,
        flyingChicken: false,
    };

    //switch for the human walking animation

    gui.add(params, 'animationSwitch').onChange(function(){
        if(animationSwitch == false){
            animationSwitch = true;
        }else{
            animationSwitch = false;
        }
    });
    
    //car folder and car parameters

    var paramCar = {
        carAnimationSwitch: false,
        resetAnimationCar: function(){
            carAnimationSwitch = false;
            car.position.set(30, 4.5,130);
            speed = 0.08;
            speedWheels = 4;
        },
        speed: speed,
        speedWheels: speedWheels,
    };

    
    const carFolder = gui.addFolder("car");
    
    var speedSlider = carFolder.add(paramCar, 'speed', 0.08, 5).listen();
    speedSlider.onChange(function(value){
        speed = value;
    });

    var speedWheelSlider = carFolder.add(paramCar, 'speedWheels', 4, 8).listen();
    speedWheelSlider.onChange(function(valueWheel){
        speedWheels = valueWheel;
    });

    carFolder.add(paramCar, 'carAnimationSwitch').onChange(function(){
        if(carAnimationSwitch == false){
            carAnimationSwitch = true;
        }else{
            carAnimationSwitch = false;
        }
        
    });
    carFolder.add(paramCar, 'resetAnimationCar');
    
    //chicken folder

    const chickFolder = gui.addFolder("chicken");

    chickFolder.add(params, 'walkingChicken').onChange(function(){
        if(walkingChicken == false){
            walkingChicken = true;
        }else{
            walkingChicken = false;
        }  
    });

    chickFolder.add(params, 'eatingChicken').onChange(function(){
        if(eatingChicken == false){
            eatingChicken = true;
        }else{
            eatingChicken = false;
        }
    });

    chickFolder.add(params, 'flyingChicken').onChange(function(){
        if(flyingChicken == false){
            flyingChicken = true;
        }else{
            flyingChicken = false;
        }
    });

    //renderer

    renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor( 0x0099ff, 1 );

    //set up renderer with shadow
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; //set to soft so smooth shadows are produced

    document.body.appendChild(renderer.domElement);

    //orbitControls 

    controls = new OrbitControls( camera, renderer.domElement );
    camera.position.set( 0, 20, 100 );
    controls.update();

    //lights

    const hlight = new THREE.AmbientLight(0x404040,0.5);
    scene.add(hlight);

    directionalLight = new THREE.DirectionalLight(0xffffff,0.5);

    directionalLight.position.x += 20;
    directionalLight.position.y += 300;
    directionalLight.position.z += 20;

    //set up shadow for the directional light. Only directional/spotlight produce shadow
    directionalLight.shadow.camera.top += 140;
    directionalLight.shadow.camera.bottom -=140;
    directionalLight.shadow.camera.left -=140;
    directionalLight.shadow.camera.right += 140;

    directionalLight.castShadow = true;

    //to increase the shadow quality 
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
   
    

    scene.add(directionalLight);


    //create the pivot for the rotation of the black cube around the pointlight inside the light house

    const loaderLightHouseGLTF = new GLTFLoader();

    loaderLightHouseGLTF.load('/lightHouse/scene.gltf', function(gltfHouse){

        const objectHouse = gltfHouse.scene;
        objectHouse.castShadow = true;
        objectHouse.scale.set(0.01,0.01,0.01);
        objectHouse.position.set(-110, 60, -170);
        scene.add(objectHouse );
       
    });

    
    pivotPoint = new THREE.Group();
   
    const houselampLight = new THREE.PointLight( 0xffee88, 10, 250, 2 )
    
    houselampLight.add(pivotPoint); 
    houselampLight.position.set(-130,150,-88);
    houselampLight.castShadow = true;
    scene.add(houselampLight);

    //black cube settings inside the lighthouse

    const corpoSet = new THREE.BoxGeometry(5,3,5);
    const corpoMaterial = new THREE.MeshStandardMaterial({
        color:'black'
    });

    const corpoCoprente = new THREE.Mesh(corpoSet, corpoMaterial);

    //corpoCoprente.position.set it's the position with respect to the pivot point

    corpoCoprente.position.set(-3, 0, -3);
    corpoCoprente.scale.set(2,2,2);
    corpoCoprente.castShadow = true;
    corpoCoprente.rotation.x = Math.PI/2;
    scene.add(corpoCoprente);
    pivotPoint.add(corpoCoprente);

    //chicken model loader and chicken settings to animate it

    const loaderChickGltf = new GLTFLoader();

    loaderChickGltf.load('/low_poly_chick/scene.gltf',function(gltfChick){

        objectChick = gltfChick.scene;
        objectChick.scale.set(15, 15 , 15);
        objectChick.castShadow = true;
        
        scene.add(objectChick);

        chickLeftLeg = objectChick.getObjectByName('Bone002_20');
        chickRightLeg = objectChick.getObjectByName('Bone001_24');
        chickRightFoot = objectChick.getObjectByName('Bone003_22');
        chickLeftFoot = objectChick.getObjectByName('Bone004_18');

        chickRightWing = objectChick.getObjectByName('Bone006_3');
        chickLeftWing = objectChick.getObjectByName('Bone007_5');
        chickHead = objectChick.getObjectByName('Bone008_16');
       
        //set initial position of wings

        chickLeftWing.rotation.x = Math.PI/2; 
        chickLeftWing.rotation.y = Math.PI/2;

        chickRightWing.rotation.x = -Math.PI/2;
        chickRightWing.rotation.y = -Math.PI/2;
       
        //set the initial position of legs and foots

        chickLeftLeg.rotation.y = Math.PI/180*2;
        chickLeftFoot.rotation.z = Math.PI/2;
        chickLeftFoot.rotation.x = Math.PI;
        chickLeftFoot.rotation.y = Math.PI/12;

        chickRightLeg.rotation.y = Math.PI/180*2;
        chickRightFoot.rotation.z = Math.PI/2;
        chickRightFoot.rotation.x = Math.PI;
        chickRightFoot.rotation.y = -Math.PI/12;

        //positioning of the chick inside the cage

        objectChick.position.set(-85,-12, 100);
        objectChick.rotation.y = -Math.PI/2;
        

    })


    //Seagull model loader and its settings to animate it

    const loaderBirdgGltf = new GLTFLoader();

    loaderBirdgGltf.load('/low_poly_bird/scene.gltf', function(gltf){

        gltf.scene.castShadow = true;
        objectBird = gltf.scene;

        objectBird.position.set(-10,100,0);
        objectBird.scale.set(4,4,4);
        objectBird.rotation.y = -Math.PI;
        scene.add(objectBird);

        birdLeftWingPivot = objectBird.getObjectByName('Bird_LeftWing_Pivot_01');
        birdLeftWingTip = objectBird.getObjectByName('Bird_LeftWing_Tip_02');
        birdRightWingPivot = objectBird.getObjectByName('Bird_RightWing_Pivot_03');
        birdRightWingTip = objectBird.getObjectByName('Bird_RightWing_Tip_04');

 
    });

    

    //Human model loader and its settings to animate it

    const loaderFBX = new FBXLoader();

    loaderFBX.load('/human-model/xbot.fbx', function(object){

        
        object.scale.set(0.2, 0.2, 0.2);
        object.position.set(-25, 2.5, 130);
        object.rotation.y = Math.PI;
        object.castShadow = true;
        
        object.receiveShadow = true;

        //initialization of the body components into the respective variables used for the animations

        head = object.getObjectByName( 'mixamorigHead' );

        rightArm = object.getObjectByName( 'mixamorigRightArm' );
        rightForeArm = object.getObjectByName('mixamorigRightForeArm');
        rightHand = object.getObjectByName('mixamorigRightHand');
    
        leftArm = object.getObjectByName( 'mixamorigLeftArm' );
        leftForeArm = object.getObjectByName('mixamorigLeftForeArm');
        leftHand = object.getObjectByName('mixamorigLeftHand');

        spine = object.getObjectByName('mixamorigSpine');
        spine1 = object.getObjectByName('mixamorigSpine1');
        spine2 =  object.getObjectByName('mixamorigSpine2');
        
        hip = object.getObjectByName('mixamorigHips');
        
        rightUpLeg = object.getObjectByName('mixamorigRightUpLeg');
        rightLeg = object.getObjectByName('mixamorigRightLeg');
        rightFoot = object.getObjectByName('mixamorigRightFoot');
        rightToeBase = object.getObjectByName('mixamorigRightToeBase');

        leftUpLeg = object.getObjectByName('mixamorigLeftUpLeg');
        leftLeg = object.getObjectByName('mixamorigLeftLeg');
        leftFoot = object.getObjectByName('mixamorigLeftFoot');
        leftToeBase = object.getObjectByName('mixamorigLeftToeBase');

       
        scene.add(object);
        
    });



    //building the cube for the ground and its textures 

    const colorTextGrass = textureLoader.load('./Textures/grassField/Stylized_Grass_003_basecolor.jpg');
    const bumpMapGrass = textureLoader.load('./Textures/grassField/Stylized_Grass_003_normal.jpg');
    const displacementMapGrass = textureLoader.load('./Textures/grassField/Stylized_Grass_003_height.png');
    const roughMapGrass = textureLoader.load('./Textures/grassField/Stylized_Grass_003_roughness.jpg');

    const geometry = new THREE.BoxGeometry( 300, 20, 300);
    const material = new THREE.MeshStandardMaterial( {
        map:colorTextGrass,
        normalMap:bumpMapGrass,
        displacementMap:  displacementMapGrass,
        displacementBias: -0.9,
        roughnessMap: roughMapGrass,
        roughness: 0.5,
    } );
    const cube = new THREE.Mesh( geometry, material );

    cube.castShadow = false;
    cube.receiveShadow = true;
    
    cube.position.y = -10; 
    scene.add( cube );
    //---//

    //adding cloud to the scene
    const cloud = cloudGen();
    cloud.position.x = -10;
    cloud.scale.set(3,3,3);

    scene.add(cloud);

    const cloud1 = cloudGen();
    cloud1.position.x = 50;
    cloud1.position.y = 20;
    cloud1.position.z = -30;
    cloud1.scale.set(3,3,3);

    scene.add(cloud1);

    const cloud2 = cloudGen();
    cloud2.position.x = -50;
    cloud2.position.y = 20;
    cloud2.position.z = 30;
    cloud2.scale.set(3,3,3);

    scene.add(cloud2);
    //---//

    //TreePine creation
    const pine = treePine();
    pine.position.x = 140;
    pine.position.y = 4;
    pine.position.z = -110;
    pine.scale.set(6,6,6);
    scene.add(pine);

    const pine1 = treePine();
    pine1.position.x = 140;
    pine1.position.y = 4;
    pine1.position.z = -70;
    pine1.scale.set(6,6,6);
    scene.add(pine1);

    const pine2 = treePine();
    pine2.position.x = 110;
    pine2.position.y = 4;
    pine2.position.z = -130;
    pine2.scale.set(6,6,6);
    scene.add(pine2);
    //---//

    //Round tree creation
    const tree = treeRound();
    tree.position.x = -140;
    tree.position.z = 130;
    tree.rotation.y = Math.PI / 2;
    scene.add(tree);
    
    const tree1 = treeRound();
    tree1.position.x = -140;
    tree1.position.z = 80;
    tree1.rotation.y = Math.PI / 2;
    scene.add(tree1);

    const tree2 = treeRound();
    tree2.position.x = -110;
    tree2.position.z = 140;
    scene.add(tree2);
    //---//

    //street creation
    const street = streeGen();
    scene.add(street);

    //adding the water
    const water = buildWater();
    scene.add(water);
  
    //fence creation
    const fenceLeft = fenceGen();
    fenceLeft.position.x = 4;
    scene.add(fenceLeft);

    const fenceRight = fenceGen();
    fenceRight.position.x= 60;
    scene.add(fenceRight);
    //---//
   
    //circular stones near lake
    circleStoneGen();
    
    //mountain generator
    mountainGen();
    
    car = createCar();
    scene.add(car);

    const sandRoad = sandRoadGen();
    scene.add(sandRoad);

    //generation of the lamps along the road
    const lamp1 = createLamp();
    lamp1.position.set(3,0,130);
    scene.add(lamp1);

    const lamp2 = createLamp();
    lamp2.position.set(3,0,-130);
    scene.add(lamp2);

    const lamp3 = createLamp();
    lamp3.position.set(75,0,-20);
    lamp3.rotation.y = -Math.PI;
    scene.add(lamp3);

    //creation of the fence for the chicken
    const woodFence1 = woodFenceGen();
    woodFence1.position.z = 115;
    woodFence1.position.x = 2;
    scene.add(woodFence1);

    const woodFence2 = woodFenceGen();
    woodFence2.position.set(-65, 0 ,0);
    woodFence2.rotation.y = Math.PI/2;
    scene.add(woodFence2);

    const woodFence3 = woodFenceGen();
    woodFence3.position.set(-65,0,-40);
    woodFence3.rotation.y = Math.PI/2;
    scene.add(woodFence3);
  
    const woodFence4 = woodFenceGen();
    woodFence4.position.set(-111, 0 ,0);
    woodFence4.rotation.y = Math.PI/2;
    scene.add(woodFence4);

    const woodFence5 = woodFenceGen();
    woodFence5.position.set(-111,0,-40);
    woodFence5.rotation.y = Math.PI/2;
    scene.add(woodFence5);

    const woodFence6 = woodFenceGen();
    woodFence6.position.z = 25;
    woodFence6.position.x = 2;
    scene.add(woodFence6);
    //-----//


}



//function to animate the water
 function update() {

    // Animate water
    water.material.uniforms.time.value += 0.5 / 60.0;

}

function animateModelIdle(){


    if(rightArm && rightForeArm &&rightHand ){
        rightArm.rotation.z = (Math.PI/180 * 80);
        rightArm.rotation.x = (Math.PI/180 * 10);
        rightForeArm.rotation.x = -(Math.PI/180 * 90);
        rightForeArm.rotation.z = (Math.PI/180 * 40);
        rightHand.rotation.x = Math.PI/2;

    }
  
    if(leftArm && leftForeArm &&leftHand ){
       leftArm.rotation.z = - (Math.PI/180 * 80);
       leftArm.rotation.x = (Math.PI/180 * 10);
       leftForeArm.rotation.x = -(Math.PI/180 * 90);
       leftForeArm.rotation.z = -(Math.PI/180 * 40);
       leftHand.rotation.x = Math.PI/2;
    }
    

    if( rightUpLeg && rightLeg && rightFoot && rightToeBase && leftUpLeg && leftLeg && leftFoot && leftToeBase ){

        rightUpLeg.rotation.x = 0;
        leftUpLeg.rotation.x = 0;
        rightLeg.rotation.x = 0;
        leftLeg.rotation.x = 0;

    }
}

var invertSpine = 0;
var invertLeftLeg = 0;
var invertRightLeg = 0;
var invertLowerLegLeft = 0;
var invertLowerLegRight = 0;
var invertRightArm = 0;
var invertLeftArm = 0;

function walkAnimation(){


    if(rightArm){


       if( rightArm.rotation.x >= -(Math.PI/180*20) && invertRightArm == 0){
            rightArm.rotation.x += Math.asin(-(Math.PI/180*0.05));

            if(rightArm.rotation.x <= -(Math.PI/180*20) ){
                invertRightArm = 1;
               
            }
       }

       if(invertRightArm == 1){
        rightArm.rotation.x += Math.sin(Math.PI/180*0.05);

            if(rightArm.rotation.x >= (Math.PI/180*20)){
                invertRightArm = 0;
            }
        }
    }

    if(leftArm){

       if(leftArm.rotation.x <= (Math.PI/180*20) && invertLeftArm == 0){

            leftArm.rotation.x += Math.sin(Math.PI/180*0.05);

            if(leftArm.rotation.x >= (Math.PI/180*20)){
                invertLeftArm = 1;
                
            }
       }

       if(invertLeftArm == 1){

        leftArm.rotation.x += Math.asin(-(Math.PI/180*0.05));

        if(leftArm.rotation.x <= -(Math.PI/180*20)){
            invertLeftArm = 0;
        }

       }
        

    }

    if(spine){


            if(spine.rotation.y <= (Math.PI/180*10) && invertSpine == 0){
                
                spine.rotation.y += Math.sin(Math.PI/180*0.05);
                
                if(spine.rotation.y >= (Math.PI/180*10) ){
                    invertSpine = 1;
                }
            }

            if( invertSpine == 1 ){
                
                spine.rotation.y += Math.asin(-(Math.PI/180*0.05));

                if(spine.rotation.y <= -(Math.PI/180*10) ){
                    invertSpine = 0;
                } 
            }
        }
        
    if(leftUpLeg && leftLeg){

        
        if(leftUpLeg.rotation.x >= -(Math.PI/180*20) && invertLeftLeg == 0){

            leftUpLeg.rotation.x += Math.asin(-(Math.PI/180*0.05));

            if(invertLowerLegLeft == 0){
                
                leftLeg.rotation.x += Math.sin((Math.PI/180*0.05));
                    
                    if( leftLeg.rotation.x >= (Math.PI/180*20) ){
                
                        invertLowerLegLeft = 1;   
                        
                    }
                    
                }
                
            if(leftUpLeg.rotation.x <= -(Math.PI/180*20) ){
            
                invertLowerLegLeft = 1;

            }
        }

        
        if(invertLowerLegLeft == 1){

            leftLeg.rotation.x += Math.asin(-(Math.PI/180*0.05));
            
            if(leftLeg.rotation.x <= 0.008726558757962598){
                invertLowerLegLeft = 0;
                invertLeftLeg = 1;

                
            }

        }

        
        if(invertLeftLeg == 1){

            leftUpLeg.rotation.x += Math.sin((Math.PI/180*0.05));

            if(leftUpLeg.rotation.x >= (Math.PI/180*20)){
                invertLeftLeg = 0;
            }
        }
            
    
    }

    if(rightLeg && rightUpLeg){

        if(rightUpLeg.rotation.x <= (Math.PI/180*20) && invertRightLeg == 0){

            rightUpLeg.rotation.x -= Math.sin(-(Math.PI/180*0.05));

               
            if(rightUpLeg.rotation.x >= (Math.PI/180*20) ){
                
                invertRightLeg = 1;
            }
        }


        
        if(invertRightLeg == 1){
            
            rightUpLeg.rotation.x += Math.sin((Math.PI/180*0.05) + Math.PI );

            
            if(invertLowerLegRight == 0){
                
                rightLeg.rotation.x += Math.sin((Math.PI/180*0.05));
                   
                    if( rightLeg.rotation.x >= (Math.PI/180*20) ){
                
                        invertLowerLegRight = 1;   
                       
                    }
                    
                }

            if(rightUpLeg.rotation.x <= -(Math.PI/180*30)){
                
                invertLowerLegRight = 1;
            }

            
            if(invertLowerLegRight == 1){

                rightLeg.rotation.x += Math.asin(-(Math.PI/180*0.05));
               
                if(rightLeg.rotation.x <= 0.008726558757962598){
                    invertLowerLegRight = 0;
                    invertRightLeg = 0;

                }

            }


        }
        
        if(hip){   
           
            if(hip.position.z <= 1200){
            
                    hip.position.z += 0.008;

            }else{
                if(hip.position.z > 1200){
                    hip.position.z = 2.0760766178438086;
                }
            }
        }

    }

}

function animateCar(){

    car.children[3].rotation.x += Math.sin(-(Math.PI/180*speedWheels));
    car.children[4].rotation.x += Math.sin(-(Math.PI/180*speedWheels));
    car.children[5].rotation.x += Math.sin(-(Math.PI/180*speedWheels));
    car.children[6].rotation.x += Math.sin(-(Math.PI/180*speedWheels));

    if(car.position.z >= -130){
        car.position.z -= speed;
    }else{
        if(car.position.z <= -130){
            car.position.z = 130;
        }
    }

}


function birdAnimation(){

    
    if(objectBird && birdLeftWingPivot && birdLeftWingTip && birdRightWingPivot && birdRightWingTip){
      
        if( birdLeftWingPivot.rotation.z <= (Math.PI/180*40) && invertLeftWing == 0){

            birdLeftWingPivot.rotation.z += Math.sin(Math.PI/180*speedWing);

            if(birdLeftWingPivot.rotation.z >= (Math.PI/180*40) ){
                invertLeftWing = 1;
            }

        }

        if(invertLeftWing == 1){

            
            birdLeftWingPivot.rotation.z += Math.asin(-(Math.PI/180*speedWing));

            if(birdLeftWingPivot.rotation.z <= -(Math.PI/180*40) ){

                invertLeftWing = 0;

            }

        }
       

        if( birdRightWingPivot.rotation.z <= -(Math.PI/140) && invertRightWing == 0){

            birdRightWingPivot.rotation.z += Math.sin(Math.PI/180*speedWing);

            if(birdRightWingPivot.rotation.z >= -(Math.PI/180*140) ){
                
                invertRightWing = 1;
            }

        }

        if(invertRightWing == 1){

          
            birdRightWingPivot.rotation.z += Math.asin(-(Math.PI/180*speedWing));

            if(birdRightWingPivot.rotation.z <= -(Math.PI/180*220) ){

                invertRightWing = 0;

            }

        }

        //The 'limits' to avoid that the seagull goes out of the scene
        if(objectBird.position.x <= -130){

            objectBird.position.x = -129;

        }

        if(objectBird.position.x >= 130){

            objectBird.position.x = 129;

        }

        if(objectBird.position.z <= -130){

            objectBird.position.z = -129;

        }

        
        if(objectBird.position.z >= 130){

            objectBird.position.z = 129;

        }

    }


}

var invertChickLeftLeg = 0;
var invertChickRightLeg = 0;
var invertChickLeftWing = 0;
var invertChickRightWing = 0;
var invertChickHead = 0;
var headInitialPos = -1.570;
var headFinPos = 0.0872;
var speedWings = 2;
var speedLegChick = 1;
var reverse = 0;




function walkingChick(){

    if( chickLeftLeg && chickRightLeg ){


        if(chickLeftLeg.rotation.z <= Math.PI/180*30 && invertChickLeftLeg == 0){

            chickLeftLeg.rotation.z += Math.sin(Math.PI/180*speedLegChick);

            if(chickLeftLeg.rotation.z >= Math.PI/180*30){
                invertChickLeftLeg = 1;
            }

        }
        if(invertChickLeftLeg == 1){

            chickLeftLeg.rotation.z += Math.asin(-(Math.PI/180*speedLegChick));
            if(chickLeftLeg.rotation.z <= (-Math.PI/180*30) ){
                invertChickLeftLeg = 0;
            }

        }

        if(chickRightLeg.rotation.z >= -Math.PI/180*30 && invertChickRightLeg == 0){

            chickRightLeg.rotation.z += Math.asin(-(Math.PI/180*speedLegChick));

            if(chickRightLeg.rotation.z <= -Math.PI/180*30){
                invertChickRightLeg = 1;
            }

        }
        if(invertChickRightLeg == 1){

            chickRightLeg.rotation.z += Math.sin((Math.PI/180*speedLegChick));
            if(chickRightLeg.rotation.z >= (Math.PI/180*30) ){
                invertChickRightLeg = 0;
            }

        }

        if(objectChick.position.z > 40 && reverse == 0){

           
            objectChick.position.z = objectChick.position.z - 0.2;

            if(objectChick.position.z <= 40){

                objectChick.rotation.y = Math.PI/2;
                objectChick.position.z = 40;
                reverse = 1;

            }   

        }

        if(reverse ==1){
           
            objectChick.position.z = objectChick.position.z + 0.2;

                if(objectChick.position.z >= 100){
    
                    objectChick.position.z = 100;
                    objectChick.rotation.y = -Math.PI/2;
                    reverse = 0;
    
                }
           
        }

    }
    
}




function flyingChick(){

    
    

    if(chickLeftWing && chickRightWing){

       
        if(chickLeftWing.rotation.y <= Math.PI/180*140 && invertChickLeftWing == 0 ){

            chickLeftWing.rotation.y += Math.sin((Math.PI/180*speedWings));
            if(chickLeftWing.rotation.y >= Math.PI/180*140){
                invertChickLeftWing = 1;
            }

        }
        if(invertChickLeftWing == 1){
            chickLeftWing.rotation.y += Math.asin(-(Math.PI/180*speedWings));
            if(chickLeftWing.rotation.y <=  Math.PI/180*50){
                invertChickLeftWing = 0;
            }
        }

        
        if(chickRightWing.rotation.y >= -Math.PI/180*140 && invertChickRightWing == 0 ){

            chickRightWing.rotation.y += Math.asin(-(Math.PI/180*speedWings));
            if(chickRightWing.rotation.y <= -Math.PI/180*140){
                invertChickRightWing = 1;
            }

        }
        if(invertChickRightWing == 1){
            chickRightWing.rotation.y += Math.sin((Math.PI/180*speedWings));
            if(chickRightWing.rotation.y >=  -Math.PI/180*50){
                invertChickRightWing = 0;
            }
        }

       
    }
  
}

function eatingChick(){

    if(chickLeftWing && chickRightWing && chickHead){

        if(chickHead.rotation.z <= headFinPos && invertChickHead == 0){
            chickHead.rotation.z += Math.sin(Math.PI/180*1);
            if(chickHead.rotation.z >= headFinPos ){
                invertChickHead = 1;
            }
        }

        if( invertChickHead == 1){
            chickHead.rotation.z += Math.asin(-(Math.PI/180*1)); 
            if(chickHead.rotation.z <= headInitialPos){
                invertChickHead = 0;
            }

        }
  
    }

}



function animate() {

    //animation of the water
    update();
    
    //idle pose of the human model or walk animation
    if(animationSwitch == false){
            animateModelIdle();
        }

    if(animationSwitch == true){
        walkAnimation();
    }

    if(carAnimationSwitch == true){
        animateCar();
    }


    //animation of the bird
    birdAnimation();

    //To move the seagull with the arrows
    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {

        var keyCode = event.which;
        if (keyCode == 38) {
            objectBird.position.z -= xMove;
        } else if (keyCode == 37) {
            objectBird.position.x -= yMove;
        } else if (keyCode == 39) {
            objectBird.position.x += yMove;
        } else if (keyCode == 40) {
            objectBird.position.z += xMove;
        }

    };  

    //to animate the chicken
   if( walkingChicken == true ){

       walkingChick();

    }

    if(eatingChicken == true ){
        eatingChick();
    }

    if(flyingChicken == true){
        flyingChick();
    }
    
    //moving the pivot and so the object in the lightHouse 
    pivotPoint.rotation.y += 0.01;
    
    //moving directional light in the scene
    const time = Date.now() * 0.0005;
    directionalLight.position.x =  Math.sin(time * 0.7) * 20;
    directionalLight.position.z =  Math.cos(time * 0.7)  * 20;

    controls.update();

	renderer.render( scene, camera );
  
    requestAnimationFrame( animate );
}

init();
animate();
