const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');
const glslify = require('glslify');
import { getRandomCloud } from './components/cloud';
import initSky from './components/sky';

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');

const settings = {
    // Make the loop animated
    animate: true,
    // Get a WebGL canvas rather than 2D
    context: 'webgl',
    // Turn on MSAA
    attributes: { antialias: true },
};

const sketch = ({ context }) => {
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({
        context
    });

    // WebGL background color
    renderer.setClearColor('hsl(200, 100%, 50%)', 1);

    // Setup a camera
    const camera = new THREE.PerspectiveCamera(114, 1, 0.01, 100);
    camera.position.set(0, 0, 0);
    camera.lookAt(new THREE.Vector3(0, 1, 0));

    // Setup your scene
    const scene = new THREE.Scene();

    const { sky, sunSphere } = initSky();
    scene.add(sky);
    scene.add(sunSphere);

    const clouds = [];
    const numClouds = random.range(6, 30);
    for (let i = 0; i < numClouds; i++) {
        clouds.push(getRandomCloud());
    }
    clouds.forEach((cloud) => cloud.forEach(mesh => scene.add(mesh)));

    scene.add(new THREE.AmbientLight('hsl(0, 0%, 40%)'));

    const light = new THREE.DirectionalLight('white', 1);
    light.position.set(2, 2, 4);
    scene.add(light);


    // draw each frame
    return {
        // Handle resize events here
        resize ({ pixelRatio, viewportWidth, viewportHeight }) {
            renderer.setPixelRatio(pixelRatio);
            renderer.setSize(viewportWidth, viewportHeight);
            const aspect = viewportWidth / viewportHeight;

            // Update the camera
            camera.updateProjectionMatrix();
        },
        // Update & render your scene here
        render ({ time }) {
            renderer.render(scene, camera);

            clouds.forEach((cloud) => {
                cloud.forEach((mesh) => {
                    mesh.material.uniforms.time.value = time;
                    const oldPosition = mesh.position;
                    mesh.position.set(oldPosition.x + mesh.direction[0], oldPosition.y + mesh.direction[1], oldPosition.z + mesh.direction[2]);
                })
            });

        },
        // Dispose of events & renderer for cleaner hot-reloading
        unload () {
            renderer.dispose();
        }
    };
};

canvasSketch(sketch, settings);
