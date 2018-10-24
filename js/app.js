const COLORS = {
    green: "#00ff00",
    white: "#FFFFFF",
    orange: "#ffd0b5",
    grey: "#61635e",
};

function createLight() {
    const light = new THREE.SpotLight(COLORS.white, 0.9, 1000, 180, 0, 0);
    light.position.x = width / 2;
    light.position.z = 1330;
    light.position.y = height / 1;
    scene.add(light);
    const ambientLight = new THREE.AmbientLight(COLORS.white, 0.3);
    scene.add(ambientLight);
}

function createCamera() {
    const camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
    // const camera = new THREE.PerspectiveCamera( 0, width, 0, height, 1, 100);
    camera.position.z = 2.2;
    scene.add(camera);
    return camera;
}

function addRenderPass() {
    var renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);
    return renderPass;
}

function addGlitchPass() {
    var glitchPass = new THREE.GlitchPass(0);
    composer.addPass(glitchPass);
    return glitchPass;
}

function addAfterImagePass() {
    var afterImagePass = new THREE.AfterimagePass(0.98);
    composer.addPass(afterImagePass);
    return afterImagePass;
}

/**
 * Post Processes to play with:
 * - Unreal / bloom
 * - dof / blur
 * - pixelation
 * - glitch DONE
 * - After image (motion blur) DONE
 */

/** Setup **/
const scene = new THREE.Scene();

const width = window.innerWidth;
const height = window.innerHeight;

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(COLORS.grey);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// createLight();
const camera = createCamera();

// Shapes
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshLambertMaterial({color: COLORS.green, transparent: false, opacity: 1});

const cube = new THREE.Mesh( geometry, material );
const edges = new THREE.EdgesHelper(cube, COLORS.white );
edges.material.linewidth = 5;
scene.add( edges );
// scene.add( cube );

/******/
// Post Processing
const DO_GLITCH_PASS = 0;
const DO_AFTERIMAGE_PASS = 1;

const composer = new THREE.EffectComposer(renderer);

let pass = addRenderPass();
if (DO_GLITCH_PASS) pass = addGlitchPass();
if (DO_AFTERIMAGE_PASS) pass = addAfterImagePass();
pass.renderToScreen = true;


/******/
// Animation

function animate(objectToAnimate) {
    objectToAnimate.rotation.x += 0.005;
    objectToAnimate.rotation.y += 0.005;

    if (DO_AFTERIMAGE_PASS) {
        afterimagePass.uniforms[ "damp" ], 'value', 0, 1);
    }

    if (typeof composer !== 'undefined') {
        composer.render();
    } else {
        renderer.render( scene, camera );
    }

    requestAnimationFrame( () => animate(objectToAnimate) );
}
animate(edges);
