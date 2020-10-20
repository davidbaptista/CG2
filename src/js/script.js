/*global THREE, requestAnimationFrame, console*/

let camera, scene, renderer;

let geometry, material, mesh;

let table;

let sticks = [new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D()];

let whiteBalls = [new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D()];

let balls = [];

let selectedStick = null, selectedBall = null;

let rotate = [0, 0];

let clock = new THREE.Clock();

let shot = 0;

let possibleColours = ["0xffff00", "0xff00ff", "0x00ffff", "0x0000ff", "0xff0000", "0x00ff00"];



function createBox(l, h, w) {
    'use strict';

    geometry = new THREE.CubeGeometry(l, h, w);
    material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
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

function createBall(r) {
    'use strict';

    geometry = new THREE.SphereGeometry(r, 32, 32);
    material = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
    mesh = new THREE.Mesh(geometry, material);	
    mesh.position.set(0, 0, 0);
	return mesh;
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

    // add balls

    let b1 = whiteBalls[0];
	let b2 = whiteBalls[1];
	let b3 = whiteBalls[2];
	let b4 = whiteBalls[3];
	let b5 = whiteBalls[4];
    let b6 = whiteBalls[5];

    for(let i = 0; i < 6; i++) {
		whiteBalls[i].userData.velocity = new THREE.Vector3(0,0,0);
		whiteBalls[i].userData.orientation = i <= 2 ? -1 : 1;
	}
	
	b1.userData.correction = 0;
	b2.userData.correction = Math.PI / 2;;
	b3.userData.correction = Math.PI / 2;
	b4.userData.correction = Math.PI;
	b5.userData.correction = Math.PI / 2;
	b6.userData.correction = Math.PI / 2;

    const ballRadius = w/30;

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
	
	b3.position.set(l/4, ballRadius, w/2 - adjustment);

	b2.position.set(-l/4, ballRadius, w/2 - adjustment);

	b5.position.set(l/4, ballRadius, -w/2 + adjustment);

	b6.position.set(-l/4, ballRadius, -w/2 + adjustment);

	b4.position.set(l/2 - adjustment, ballRadius, 0);

	b1.position.set(-l/2 + adjustment, ballRadius, 0);

	let N = 14;
	for(let i = 0; i <= N; i++) {
		let obj = new THREE.Object3D();
		let ball = createBall(ballRadius);
		let randomColour = possibleColours[Math.floor(Math.random() * 6)];
		ball.material.color.setHex(randomColour);
		obj.add(ball);
		let x = (Math.random() * l/3) * 2 - l/3;
		let z = (Math.random() * w/3) * 2 - w/3;
		obj.position.set(x , 0, z);
		scene.add(obj);
	}
}	

function createScene() {
    'use strict';

    scene = new THREE.Scene();


    scene.add(new THREE.AxisHelper(10));

    createTable(245, 5, 135);
}

function createCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    //camera.position.x = 250;
    camera.position.y = 250;
    //camera.position.z = 250;
    camera.lookAt(scene.position);
}

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
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
	case 52:	// 1
		selectStick(0);
		break;
	case 53:	// 2
		selectStick(1);
		break
	case 54:	// 3
		selectStick(2);
		break;
	case 55:	// 4
		selectStick(3);
		break
	case 56:	// 5
		selectStick(4);
		break;
	case 57:	// 6
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
        whiteBalls[i].position.x += whiteBalls[i].userData.velocity.x * delta;
        whiteBalls[i].position.y += whiteBalls[i].userData.velocity.y * delta;
        whiteBalls[i].position.z += whiteBalls[i].userData.velocity.z * delta;

        if(whiteBalls[i].userData.velocity.x < 0) {
			whiteBalls[i].userData.velocity.x += 0.01 * whiteBalls[i].userData.velocity.x * whiteBalls[i].userData.velocity.x * delta;
		} 
		else {
			whiteBalls[i].userData.velocity.x -= 0.01 * whiteBalls[i].userData.velocity.x * whiteBalls[i].userData.velocity.x * delta;
		}
		
        if(whiteBalls[i].userData.velocity.z < 0) {
			whiteBalls[i].userData.velocity.z += 0.01 * whiteBalls[i].userData.velocity.z * whiteBalls[i].userData.velocity.z * delta;
		} 
		else {
			whiteBalls[i].userData.velocity.z -= 0.01 * whiteBalls[i].userData.velocity.z * whiteBalls[i].userData.velocity.z * delta;
        }

		// if ball moves too slowly, stop it
        if(Math.abs(whiteBalls[i].userData.velocity.x) < 5) {
            whiteBalls[i].userData.velocity.x = 0;
        }
        if(Math.abs(whiteBalls[i].userData.velocity.z) < 5) {
            whiteBalls[i].userData.velocity.z = 0;
        }
    }

    if(shot && selectedStick) {
        shot = 0;
        let angle = selectedStick.userData.rotation
        selectedBall.userData.velocity.x = 100 * Math.cos(angle + selectedBall.userData.correction);
        selectedBall.userData.velocity.z = 100 * Math.sin((angle + selectedBall.userData.correction) * selectedBall.userData.orientation);
        console.log(angle);
    }

    render();

    requestAnimationFrame(animate);
}
