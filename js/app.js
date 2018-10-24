const COLORS = {
    green: "#00ff00",
    white: "#FFFFFF",
    orange: "#ffd0b5",
};

function animate() {
    requestAnimationFrame( animate );
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;
    // edges.rotation.x += 0.005;
    // edges.rotation.y += 0.005;
    renderer.render( scene, camera );
}

/** Setup **/
const scene = new THREE.Scene();

const width = window.innerWidth;
const height = window.innerHeight;
const camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
// const camera = new THREE.PerspectiveCamera( 0, width, 0, height, 1, 100);
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(COLORS.orange);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Shapes
// const light = new THREE.DirectionalLight(COLORS.white, 1);
// const light = new THREE.DirectionalLight(COLORS.white, 1);
const light = new THREE.SpotLight(COLORS.white, 0.9, 1000, 180, 0, 0);
light.position.x = width / 2;
light.position.z = 1330;
light.position.y = height / 1;
scene.add(light);
const ambientLight = new THREE.AmbientLight(COLORS.white, 0.3);
scene.add(ambientLight);

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshLambertMaterial({color: COLORS.green, transparent: false, opacity: 1});

const cube = new THREE.Mesh( geometry, material );
// const edges = new THREE.EdgesHelper(cube, COLORS.white );
// edges.material.linewidth = 5;
// scene.add( edges );
scene.add( cube );

camera.position.z = 3;
animate();
