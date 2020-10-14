/*global THREE, requestAnimationFrame, console*/

let camera, scene, renderer;

let geometry, material, mesh;

let table, s1, s2, s3, s4, s5, s6;

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
    material = new THREE.MeshBasicMaterial({color: 0xffff00, wireframe: true});
    mesh = new THREE.Mesh(geometry, material);	
	mesh.position.set(0, 0, 0);
	return mesh;
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

    s1 = new THREE.Object3D();
    let s = createCylinder(w);

    s1.add(s)

    s2 = new THREE.Object3D();
    s = createCylinder(w);
    s2.add(s)

    s3 = new THREE.Object3D();
    s = createCylinder(w);
    s3.add(s)

    s4 = new THREE.Object3D();
    s = createCylinder(w);
    s4.add(s)

    s5 = new THREE.Object3D();
    s = createCylinder(w);
    s5.add(s)

    s6 = new THREE.Object3D();
    s = createCylinder(w);
    s6.add(s)

    scene.add(s1);
    scene.add(s2);
    scene.add(s3);
    scene.add(s4);
    scene.add(s5);
    scene.add(s6);
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
    camera.position.x = 200;
    camera.position.y = 200;
    camera.position.z = 200;
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

function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {
    case 69:  //E
    case 101: //e
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

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}

function animate() {
    'use strict';

    render();

    requestAnimationFrame(animate);
}
