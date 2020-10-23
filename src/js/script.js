/*global THREE, requestAnimationFrame, console*/

let camera, scene, renderer;

let geometry, material, mesh;

let table;

let sticks = [new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D()];

let whiteBalls = [new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D()];

let coloredBalls = [];

let holes = [];

let selectedStick = null, selectedBall = null;

let rotate = [0, 0];

let limits = [0,0,0,0];

let clock = new THREE.Clock();

let shot = 0;

let possibleColours = ["0xffff00", "0xff00ff", "0x00ffff", "0x0000ff", "0xff0000", "0x00ff00"];

let aspectRatio = window.innerHeight/window.innerWidth;

let orthographic = true;

const cameraSize = 256;

const ballRadius = 4.5;

let tableLength = 245;
let tableHeight = 5;
let tableWidth = 135;

let followingCamera = false;


function createBox(l, h, w) {
    'use strict';

    geometry = new THREE.CubeGeometry(l, h, w);
    material = new THREE.MeshBasicMaterial({color: 0x6e524b, wireframe: false});
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    return mesh;
}

function createCylinder(l) {
    'use strict';

	geometry = new THREE.CylinderGeometry(1, 3, l, 64);
	geometry.translate(0, -l/2 - l/10, 0);
    material = new THREE.MeshBasicMaterial({color: 0x948160, wireframe: true});
    mesh = new THREE.Mesh(geometry, material);	
    mesh.position.set(0, 0, 0);
	return mesh;
}

function createHole(l, h ,w){
    let geometry = new THREE.CylinderGeometry(w/20, w/20, h, 64);
    let material = new THREE.MeshBasicMaterial({color: 0x000000, wireframe: false});
    let mesh = new THREE.Mesh(geometry, material);	
    mesh.position.set(0, 0.01, 0);
    let obj = new THREE.Object3D();
    obj.add(mesh);
    return obj;
}

function createBall(r) {
    'use strict';

    geometry = new THREE.SphereGeometry(r, 8, 8);
    material = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
    mesh = new THREE.Mesh(geometry, material);	
    mesh.position.set(0, 0, 0);
	return mesh;
}

function createColoredBall(l, w){
    let obj = new THREE.Object3D();
    let ball = createBall(ballRadius);
    let randomColour = possibleColours[Math.floor(Math.random() * 6)];
    ball.material.color.setHex(randomColour);
    obj.add(ball);
    let x = (Math.random() * l/3) - l/6;
    let z = (Math.random() * w/3) - w/6;
    obj.position.set(x, ballRadius + tableHeight/2, z);
    obj.userData.velocity = new THREE.Vector3(Math.random()*100 - 50, 0, Math.random()*100 - 50);
    obj.userData.acceleration = 0;
    return obj;
}

function selectStick(stick) {
	for(let i = 0; i <= 5; i++) {
		if (i == stick) {
			sticks[i].children[0].material.color.setHex(0x00ff00);
            selectedStick = sticks[i];
            selectedBall = whiteBalls[i];
		}
		else {
			sticks[i].children[0].material.color.setHex(0x948160);
		}
	}
}


function createTable(l, h ,w) {
    'use strict';

    table = new THREE.Object3D();
    const leg_size = 40;
    const wall_width = h;

    let table_top = createBox(l, h, w);
    let leg1 = createBox(l/leg_size, l/4, l/leg_size);
    let leg2 = createBox(l/leg_size, l/4, l/leg_size);
    let leg3 = createBox(l/leg_size, l/4, l/leg_size);
    let leg4 = createBox(l/leg_size, l/4, l/leg_size);
    let wall1 = createBox(l, 12, wall_width);
    let wall2 = createBox(l, 12, wall_width);
    let wall3 = createBox(wall_width, 12, w);
    let wall4 = createBox(wall_width, 12, w);

    leg1.position.set(l/2-l/(leg_size*2), -l/8, w/2-l/(leg_size*2));
    leg2.position.set(-l/2+l/(leg_size*2), -l/8, w/2-l/(leg_size*2));
    leg3.position.set(l/2-l/(leg_size*2), -l/8, -w/2+l/(leg_size*2));
    leg4.position.set(-l/2+l/(leg_size*2), -l/8, -w/2+l/(leg_size*2));
    wall1.position.set(0, 0, w/2-(wall_width/2));
    wall2.position.set(0, 0, -w/2+(wall_width/2));
    wall3.position.set(l/2-(wall_width/2), 0, 0);
    wall4.position.set(-l/2+(wall_width/2), 0, 0);

    table.add(table_top);
    table_top.material.color.setHex(0x4a6d59)
    table.add(leg1);
    table.add(leg2);
    table.add(leg3);
    table.add(leg4);
    table.add(wall1);
    table.add(wall2);
    table.add(wall3);
    table.add(wall4);

    scene.add(table);

	//add sticks to the table

    let s1 = sticks[0];
	let s2 = sticks[1];
	let s3 = sticks[2];
	let s4 = sticks[3];
	let s5 = sticks[4];
    let s6 = sticks[5];
    
    for(let i = 0; i < 6; i++) {
        sticks[i].userData = {rotation: 0};
    }
	
	s1.add(createCylinder(w));
	s2.add(createCylinder(w));
	s3.add(createCylinder(w));
	s4.add(createCylinder(w));
	s5.add(createCylinder(w));
	s6.add(createCylinder(w));
	
    scene.add(s1);
	scene.add(s2);
    scene.add(s3);
    scene.add(s4);
    scene.add(s5);
    scene.add(s6);

    const adjustment = h * 2 + 2;

	s3.position.set(l/4, 0, w/2 - adjustment);
	s3.rotateX(-Math.PI / 2);

	s2.position.set(-l/4, 0, w/2 - adjustment);
	s2.rotateX(-Math.PI / 2);

	s5.position.set(l/4, 0, -w/2 + adjustment);
	s5.rotateX(Math.PI / 2);

	s6.position.set(-l/4, 0, -w/2 + adjustment);
	s6.rotateX(Math.PI / 2);

	s4.position.set(l/2 - adjustment, 0, 0);
	s4.rotateX(Math.PI / 2);
    s4.rotateZ(Math.PI / 2);

	s1.position.set(-l/2 + adjustment , 0, 0);
    s1.rotateX(-Math.PI / 2);
    s1.rotateZ(-Math.PI / 2);

    let h1 = createHole(l, h, w);
    let h2 = createHole(l, h, w);
    let h3 = createHole(l, h, w);
    let h4 = createHole(l, h, w);
    let h5 = createHole(l, h, w);
    let h6 = createHole(l, h, w);
    h1.position.x = l/2 -  w/20 - wall_width;
    h1.position.z = w/2 - w/20 - wall_width;
    h2.position.x = l/2 -  w/20 - wall_width;
    h2.position.z = -w/2 + w/20 + wall_width;
    h3.position.z = w/2 - w/20 - wall_width;
    h4.position.z = -w/2 + w/20 + wall_width;
    h5.position.x = - l/2 +  w/20 + wall_width;
    h5.position.z = w/2 - w/20 - wall_width;
    h6.position.x = - l/2 +  w/20 + wall_width;
    h6.position.z = -w/2 + w/20 + wall_width;

    holes.push(h1);
    holes.push(h2);
    holes.push(h3);
    holes.push(h4);
    holes.push(h5);
    holes.push(h6);
    
    scene.add(h1);
    scene.add(h2);
    scene.add(h3);
    scene.add(h4);
    scene.add(h5);
    scene.add(h6);

    // add balls

    let b1 = whiteBalls[0];
	let b2 = whiteBalls[1];
	let b3 = whiteBalls[2];
	let b4 = whiteBalls[3];
	let b5 = whiteBalls[4];
    let b6 = whiteBalls[5];

    for(let i = 0; i < 6; i++) {
        whiteBalls[i].userData.velocity = new THREE.Vector3(0,0,0);
        whiteBalls[i].userData.acceleration = 0;
        whiteBalls[i].userData.shot = false;
        whiteBalls[i].userData.falling = false;
	}
	
	b1.userData.correction = 0;
	b2.userData.correction = Math.PI / 2;;
	b3.userData.correction = Math.PI / 2;
	b4.userData.correction = Math.PI;
	b5.userData.correction = Math.PI / 2;
	b6.userData.correction = Math.PI / 2;

    b1.add(createBall(ballRadius));
	b2.add(createBall(ballRadius));
	b3.add(createBall(ballRadius));
	b4.add(createBall(ballRadius));
	b5.add(createBall(ballRadius));
    b6.add(createBall(ballRadius));
    
    scene.add(b1);
	scene.add(b2);
    scene.add(b3);
    scene.add(b4);
    scene.add(b5);
	scene.add(b6);
	
	b3.position.set(l/4, ballRadius + h/2, w/2 - adjustment);

	b2.position.set(-l/4, ballRadius + h/2, w/2 - adjustment);

	b5.position.set(l/4, ballRadius + h/2, -w/2 + adjustment);

	b6.position.set(-l/4, ballRadius + h/2, -w/2 + adjustment);

	b4.position.set(l/2 - adjustment, ballRadius + h/2, 0);

	b1.position.set(-l/2 + adjustment, ballRadius + h/2, 0);

	let N = 25;
	for(let i = 0; i <= N; i++) {
        let ball = createColoredBall(l, w);
        ball.userData.falling = false;
        coloredBalls.push(ball);
		scene.add(ball);
	}
}	


function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(100));

    limits = [tableLength/2 - tableHeight, -tableLength/2 + tableHeight, tableWidth/2 - tableHeight, -tableWidth/2 + tableHeight];

    createTable(tableLength, tableHeight, tableWidth);
}

function createCamera() {
	'use strict';
	
    camera = new THREE.OrthographicCamera(-cameraSize, cameraSize, cameraSize*aspectRatio, -cameraSize*aspectRatio, 1, 1000);
    camera.position.x = 0;
    camera.position.y = 500;
    camera.position.z = 0;
    camera.lookAt(scene.position);
}

function onResize() {
    'use strict';

	renderer.setSize(window.innerWidth, window.innerHeight);
	
	if(orthographic) {
		aspectRatio = window.innerHeight / window.innerWidth;
		camera.top = cameraSize * aspectRatio;
		camera.bottom = cameraSize * - aspectRatio;
		camera.updateProjectionMatrix();
	}
	else {
		if (window.innerHeight > 0 && window.innerWidth > 0) {
			camera.aspect = window.innerHeight/window.innerWidth;
			camera.updateProjectionMatrix();
		}
	}
}

function onKeyUp(e) {
	'use strict';

	switch(e.keyCode) {
    case 32:	// Space
		shot = 0;
		break;
    case 37:
        rotate[0] = 0;
        break;
    case 39:
        rotate[1] = 0;
        break;
	}
}

function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {
    case 32:	// Space
		shot = 1;
		break;
	case 37:	// <-
		rotate[0] = 1;
		break;
	case 39: 	// ->
		rotate[1] = 1;
		break;
	case 49:	// 1
   		camera = new THREE.OrthographicCamera(-cameraSize, cameraSize, cameraSize*aspectRatio, -cameraSize*aspectRatio, 1, 1000);
		camera.position.x = 0;
		camera.position.y = 10;
		camera.position.z = 0;
		orthographic = true;
		followingCamera = false;
		camera.lookAt(new THREE.Vector3(0,-11.5,0));
		break;
	case 50:	// 2
		camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);		
		camera.position.x = 200;
		camera.position.y = 200;
		camera.position.z = 200;
		camera.lookAt(scene.position);
		orthographic = false;
		followingCamera = false;
		break;
	case 51:	// 3
		if(selectedBall && selectedBall.userData.velocity.length() != 0 ) {
			camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
			followingCamera = true;
			orthographic = false;
		}		
		break;
	case 52:	// 4
		selectStick(0);
		break;
	case 53:	// 5
		selectStick(1);
		break
	case 54:	// 6
		selectStick(2);
		break;
	case 55:	// 7
		selectStick(3);
		break
	case 56:	// 8
		selectStick(4);
		break;
	case 57:	// 9
		selectStick(5);
		break
    case 69:  	//E
    case 101: 	//e
        scene.traverse(function (node) {
            if (node instanceof THREE.AxisHelper) {
                node.visible = !node.visible;
            }
        });
        break;
    }
}

function render() {
    'use strict';
    renderer.render(scene, camera);
}

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();

	render();
	
	window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}


function moveBall(ball, delta){

    direction = new THREE.Vector3 (ball.userData.velocity.x * delta, ball.userData.velocity.y * delta, ball.userData.velocity.z * delta);

    ball.position.x += direction.x;
    ball.position.y += direction.y;
    ball.position.z += direction.z;

    axis = new THREE.Vector3(0,0,0);
    ballToGround = new THREE.Vector3(0, -1, 0);
    angle = direction.length() / ballRadius;
    axis.crossVectors (direction, ballToGround);
    axis.normalize();
    
    var q1 = new THREE.Quaternion();
	q1.setFromAxisAngle(axis, angle);
	ball.quaternion.premultiply(q1);


    if(ball.userData.velocity.x < 0) {
        ball.userData.velocity.x += 0.01 * ball.userData.velocity.x * ball.userData.velocity.x * delta;
    } 
    else {
        ball.userData.velocity.x -= 0.01 * ball.userData.velocity.x * ball.userData.velocity.x * delta;
    }
    
    if(ball.userData.velocity.z < 0) {
        ball.userData.velocity.z += 0.01 * ball.userData.velocity.z * ball.userData.velocity.z * delta;
    } 
    else {
        ball.userData.velocity.z -= 0.01 * ball.userData.velocity.z * ball.userData.velocity.z * delta;
    }

    ball.userData.velocity.y -= ball.userData.acceleration * delta;

    // if ball moves too slowly, stop it
    if(Math.abs(ball.userData.velocity.x) < 5) {
        ball.userData.velocity.x = 0;
    }
    if(Math.abs(ball.userData.velocity.z) < 5) {
        ball.userData.velocity.z = 0;
    }

}

function detectHole(ball){
    ballPosition = ball.position;
    for(let i = 0; i < 6; i++){
        holePosition = new THREE.Vector3(holes[i].position.x, ballRadius + tableHeight/2, holes[i].position.z);
        if(ballPosition.distanceTo(holePosition) < tableWidth/20){
            ball.userData.acceleration = 98,25;
            ball.userData.velocity.x = holes[i].position.x - ball.position.x,
            ball.userData.velocity.z = holes[i].position.z - ball.position.z;
            ball.userData.velocity.setLength(7);
            ball.userData.falling = true;
        }
    }
}


function detectBallCollision(ball){

    let ball2 = null;

    for (let i=0; i < coloredBalls.length; i++){
        if(ball == coloredBalls[i] || coloredBalls[i].userData.falling){
            continue;
        }
        
        let distance = ball.position.clone();
        distance.sub(coloredBalls[i].position);

        if(ballRadius*2 > distance.length()){
            ball2 = coloredBalls[i];
        }
    }

    for (let i=0; i < whiteBalls.length; i++){
        if(ball == whiteBalls[i] || !whiteBalls[i].userData.shot || whiteBalls[i].userData.falling){
            continue;
        }
        
        let distance = ball.position.clone();
        distance.sub(whiteBalls[i].position);

        if(ballRadius*2 > distance.length()){
            ball2 = whiteBalls[i];
        }
    }

    if(ball2){
        let distance = ball.position.clone();
        let velocity1 = ball.userData.velocity.length();
        let velocity2 = ball2.userData.velocity.length();
        let sum = velocity1 + velocity2;
        distance.sub(ball2.position);
        let distance2 = distance.clone();
        let distance1 = distance.clone();

        distance1.setLength(ballRadius*2 - distance.length());
        distance2.setLength(ballRadius*2 - distance.length());

        distance1.multiplyScalar(-(velocity1/sum));
        distance2.multiplyScalar((velocity2/sum));

        ball.position.sub(distance1);
        ball2.position.sub(distance2);

        distance.subVectors(ball.position, ball2.position);

        velocityDifference = ball.userData.velocity.clone();
        velocityDifference.sub(ball2.userData.velocity);

        let aux = distance.clone();
        aux.multiplyScalar(distance.dot(velocityDifference)/distance.lengthSq());
        ball.userData.velocity.subVectors(ball.userData.velocity, aux);
        
        distance.negate();
        aux.copy(distance);
        velocityDifference.negate();
        aux.multiplyScalar(distance.dot(velocityDifference)/distance.lengthSq());
        ball2.userData.velocity.subVectors(ball2.userData.velocity, aux);
    }
}

function detectCollision(ball){
    if (ball.position.x + ballRadius > limits[0]){
        ball.position.z += ((ball.position.x - limits[0] + ballRadius) / ball.userData.velocity.x) * ball.userData.velocity.z
        ball.position.x = limits[0] - ballRadius
        ball.userData.velocity.x = -ball.userData.velocity.x
    }
    else if(ball.position.x - ballRadius < limits[1]){
        ball.position.z += ((ball.position.x - limits[1] - ballRadius) / ball.userData.velocity.x) * ball.userData.velocity.z
        ball.position.x = limits[1] + ballRadius
        ball.userData.velocity.x = -ball.userData.velocity.x
    }
    if (ball.position.z + ballRadius > limits[2]){
        ball.position.x += ((ball.position.z - limits[2] + ballRadius) / ball.userData.velocity.z) * ball.userData.velocity.x
        ball.position.z = limits[2] - ballRadius
        ball.userData.velocity.z = -ball.userData.velocity.z
    }
    else if(ball.position.z - ballRadius < limits[3]){
        ball.position.x += ((ball.position.z - limits[3] - ballRadius) / ball.userData.velocity.z) * ball.userData.velocity.x
        ball.position.z = limits[3] + ballRadius
        ball.userData.velocity.z = -ball.userData.velocity.z
    }
}

function animate() {
	'use strict';
    let rotationSpeed = Math.PI / 6;
	let delta = 0;

	delta = clock.getDelta();
    
	if(rotate != 0 && selectedStick && selectedStick.userData.rotation < Math.PI /3) {
        selectedStick.rotateZ(rotationSpeed * delta * rotate[1]);
        selectedStick.userData.rotation += rotationSpeed * delta * rotate[1];
    }
    if(rotate != 0 && selectedStick && selectedStick.userData.rotation > -Math.PI /3) {
        selectedStick.rotateZ(rotationSpeed * delta * -rotate[0]);
        selectedStick.userData.rotation -= rotationSpeed * delta * rotate[0];
    }

    for(let i = 0; i < 6; i++) {
        detectHole(whiteBalls[i]);
        moveBall(whiteBalls[i], delta);
        detectCollision(whiteBalls[i]);
        if(whiteBalls[i].userData.shot && !whiteBalls[i].userData.falling){
            detectBallCollision(whiteBalls[i]);
        }
    }

    for(let i = 0; i < coloredBalls.length; i++) {
        detectHole(coloredBalls[i]);
        moveBall(coloredBalls[i], delta);
        detectCollision(coloredBalls[i]);
        if(!coloredBalls[i].userData.falling){
            detectBallCollision(coloredBalls[i]);
        }
    }

    if(shot && selectedStick) {
        shot = 0;
        let direction = new THREE.Vector3( 0, 1, 0);
        direction = direction.applyEuler(selectedStick.rotation)

        selectedBall.userData.shot = true;
        selectedBall.userData.velocity.x = 400 * direction.x;
        selectedBall.userData.velocity.z = 400 * direction.z;
	}
	
	if(followingCamera && selectedBall && selectedBall.userData.velocity.length() != 0 ) {
		let v = selectedBall.userData.velocity.clone();
		v.normalize();
		camera.position.x = selectedBall.position.x - 30 * v.x;
		camera.position.y = selectedBall.position.y + 20;
		camera.position.z = selectedBall.position.z - 30 * v.z;
		camera.lookAt(selectedBall.position)
	}

    render();

    requestAnimationFrame(animate);
}
