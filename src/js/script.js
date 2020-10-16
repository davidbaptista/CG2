/*global THREE, requestAnimationFrame, console*/

let camera, scene, renderer;

let geometry, material, mesh;

let table;

let sticks = [new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D()];

let selectedStick = null;

let rotate = 0;

function createBox(l, h, w) {
    'use strict';

    geometry = new THREE.CubeGeometry(l, h, w);
    material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    return mesh;
}

function createCylinder(l) {
    'use strict'

	geometry = new THREE.CylinderGeometry(1, 3, l, 64);
	geometry.translate(0, -l/2, 0);
    	material = new THREE.MeshBasicMaterial({color: 0x948160, wireframe: true});
    	mesh = new THREE.Mesh(geometry, material);	
	mesh.position.set(0, 0, 0);
	return mesh;
}

function selectStick(stick) {
	for(let i = 0; i <= 5; i++) {
		if (i == stick) {
			sticks[i].children[0].material.color.setHex(0x00ff00);
			selectedStick = sticks[i];
		}
		else {
			sticks[i].children[0].material.color.setHex(0x948160);
		}
	}
}


function createTable(l, h ,w) {
    'use strict';

    table = new THREE.Object3D();
    let leg_size = 40;
    let wall_width = 6;

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

	s3.position.set(l/4, 0, w/2 );
	s3.rotateX(-Math.PI / 2);
	s3.rotateZ(Math.PI / 4);


	s2.position.set(-l/4, 0, w/2);
	s2.rotateX(-Math.PI / 2);

	s5.position.set(l/4, 0, -w/2 );
	s5.rotateX(Math.PI / 2);

	s6.position.set(-l/4, 0, -w/2);
	s6.rotateX(Math.PI / 2);

	s4.position.set(l/2 , 0, 0);
	s4.rotateZ(Math.PI / 2);

	s1.position.set(-l/2 , 0, 0);
	s1.rotateZ(-Math.PI / 2);
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
    camera.position.x = 250;
    camera.position.y = 250;
    camera.position.z = 250;
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
	'use strict'

	switch(e.keyCode) {
		case 37:
		case 39:
			rotate = 0
			break;
	}
}

function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {
	case 37:	// <-
		rotate = -1;
		break;
	case 39: 	// ->
		rotate = 1;
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

	window.addEventListener("keyUp", onKeyUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}

function animate() {
	'use strict';
	
	if(rotate == -1 && selectedStick) {
	}

    render();

    requestAnimationFrame(animate);
}
