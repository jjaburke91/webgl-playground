const COLORS = {
    green: "#00ff00",
    white: "#FFFFFF",
    orange: "#ffd0b5",
    grey: "#61635e",
    black: "#000000",
};

function createCamera() {
    const camera = new THREE.PerspectiveCamera(15, width / height, 0.01, 1000);
    camera.position.z = 1;
    scene.add(camera);
    return camera;
}

/*********/
/** INIT */

const loader = new THREE.TextureLoader();
loader.crossOrigin = "Anonymous";

const scene = new THREE.Scene();

const width = window.innerWidth;
const height = window.innerHeight;

const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.setClearColor(COLORS.black);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = createCamera();

/*********/
/* LIGHT */

// Add two lights in the scene
// An hemisphere light, to add different light from sky and ground
const light = new THREE.HemisphereLight( "#ffffff", "#ffffff", 1);
scene.add( light );

/************/
/* TEXTURES */

// const logoTexture = loader.load( "/3d-playground/img/fani.jpeg" );
const logoTexture = loader.load( "/3d-playground/img/jordan2.jpeg" );

/**********/
/** TUBE **/

// Define points along Z axis
var points = [];
for (var i = 0; i < 3; i += 1) {
    points.push(new THREE.Vector3(0, 0, 2.5 * (i / 4)));
}

// Create a curve based on the points
let curve = new THREE.CatmullRomCurve3(points);

let tubeGeometry = new THREE.TubeGeometry(curve, 90, 0.005, 50, false);

// Define a material for the tube with a jpg as texture instead of plain color
var tubeMaterial = new THREE.MeshStandardMaterial({
    side: THREE.BackSide, // Since the camera will be inside the tube we need to reverse the faces
    map: logoTexture,
});
// Repeat the pattern to prevent the texture being stretched
tubeMaterial.map.wrapS = THREE.RepeatWrapping;
tubeMaterial.map.wrapT = THREE.RepeatWrapping;
tubeMaterial.map.repeat.set(30, 8);

let tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
scene.add(tubeMesh);

/**********/
/* RENDER */
const SPEED = 0.01;

function updateMaterialOffset() {
    tubeMaterial.map.offset.x += SPEED;
    tubeMaterial.map.offset.y += SPEED * 1.005;
}

function updateCurve() {
    // curve.points[2].x = -this.mouse.position.x * 0.1;
    // curve.points[4].x = -this.mouse.position.x * 0.1;
    // curve.points[2].y = this.mouse.position.y * 0.1;
    // tubeGeometry.verticesNeedUpdate = true;
}

function render() {
    updateCurve();
    updateMaterialOffset();
    renderer.render( scene, camera );
    window.requestAnimationFrame(render);
}

render();
