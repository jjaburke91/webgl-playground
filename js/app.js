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

let renderPass, glitchPass, afterImagePass, bokehPass, unrealBloomPass;
function addRenderPass() {
    renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);
    return renderPass;
}

function addGlitchPass() {
    glitchPass = new THREE.GlitchPass(0);
    composer.addPass(glitchPass);
    return glitchPass;
}

function addAfterImagePass() {
    afterImagePass = new THREE.AfterimagePass(0.98);

    const MAX_DAMP = 1.01;
    const MIN_DAMP = 0.92;
    setInterval(() => {
        afterImagePass.uniforms.damp.value = Math.random() * (MAX_DAMP - MIN_DAMP) + MIN_DAMP;
    }, 1200);

    composer.addPass(afterImagePass);
    return afterImagePass;
}

function addBokehPass() {
    bokehPass = new THREE.BokehPass(scene, camera, {
        focus: 		0,
        aperture:	0.1,
        maxblur:	1,

        width: width,
        height: height
    });

    const MAX_FOCUS = 0.7;
    const MIN_FOCUS = 0.1;
    setInterval(() => {
        bokehPass.uniforms.focus.value = Math.random() * (MAX_FOCUS - MIN_FOCUS) + MIN_FOCUS;
    }, 900);

    composer.addPass(bokehPass);
    return bokehPass;
}

function addUnrealBloomPass() {
    unrealBloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2( window.innerWidth, window.innerHeight ),
        1, // strength
        0.1, // radius
        0.8 // threshold
    );

    const MAX_STRENGTH = 50;
    const MIN_STRENGTH = 1;
    setInterval(() => {
        unrealBloomPass.copyUniforms.opacity.value = Math.random() * (MAX_STRENGTH - MIN_STRENGTH) + MIN_STRENGTH;
    }, 300);

    composer.addPass(unrealBloomPass);
    return unrealBloomPass;
}

/**
 * Post Processes to play with:
 * - Unreal / Bloom DONE
 * - Dof / Blur DONE
 * - Pixelation
 * - Glitch DONE
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

createLight();
const camera = createCamera();

// Shapes
const geometry = new THREE.BoxGeometry( 1, 1, 1 );

const material = new THREE.MeshLambertMaterial({color: COLORS.green, transparent: false, opacity: 1});
const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

const edges = new THREE.EdgesHelper(cube, COLORS.orange );
edges.material.linewidth = 5;
scene.add( edges );

/******/
// Post Processing
const DO_GLITCH_PASS = 0;
const DO_AFTERIMAGE_PASS = 1;
const DO_BLUR_PASS = 0;
const DO_UNREALBLOOM_PASS = 1;

const composer = new THREE.EffectComposer(renderer);

let pass = addRenderPass();
if (DO_GLITCH_PASS) pass = addGlitchPass();
if (DO_AFTERIMAGE_PASS) pass = addAfterImagePass();
if (DO_BLUR_PASS) pass = addBokehPass();
if (DO_UNREALBLOOM_PASS) pass = addUnrealBloomPass();
pass.renderToScreen = true;

/******/
// Animation

function animate(objectToAnimate) {
    objectToAnimate.rotation.x += 0.0045;
    objectToAnimate.rotation.y += 0.005;
    objectToAnimate.rotation.z += 0.0032;

    if (typeof composer !== 'undefined') {
        composer.render();
    } else {
        renderer.render( scene, camera );
    }

    requestAnimationFrame( () => animate(objectToAnimate) );
}
animate(edges);
