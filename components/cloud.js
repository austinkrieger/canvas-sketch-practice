const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');
const { lerp } = require('canvas-sketch-util/math');
const glslify = require('glslify');

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');



const fragmentShader = glslify(`
      varying vec2 vUv;
      uniform vec3 color;
      uniform float time;
      uniform float rand;
      uniform float opacity;
      
      #pragma glslify: noise = require('glsl-noise/simplex/3d');
      
      void main () {
        float offset = 0.3 * noise(vec3(vUv.x * 2.0, vUv.y * 1.2, time * .05 * rand) - (rand * 0.4));
        gl_FragColor = vec4(vec3(offset), opacity);
      }
    `);

const vertexShader = glslify(`
      varying vec2 vUv;
      
      uniform float time;
      uniform float rand;
      uniform float opacity;
 
      #pragma glslify: noise = require('glsl-noise/simplex/4d');
      
      void main () {
        vUv = uv;
        vec3 pos = position.xyz;
                
        pos += .55 * normal * noise(vec4(pos.xyz * rand, time * 0.04 * rand + (rand * 2.0) ));
        pos += 0.03 * normal * noise(vec4(pos.xyz * 10.5, 0));
        pos += 0.185 * noise(vec4(pos.xyz * 1.5, 0));



        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0); 
      }
    `);


const getCloudMeshes = (
    [
        [X_MEDIAN, X_DEVIATION],
        [Y_MEDIAN, Y_DEVIATION],
        [Z_MEDIAN, Z_DEVIATION]
    ],
    [SCALE_MEDIAN, SCALE_DEVIATION],
    WIND_SPEED_MEDIAN = 3,
    WIND_SPEED_DEVIATION = 2
) => {
    const box = new THREE.SphereGeometry(1, 32, 32);
    //const box = new THREE.IcosahedronGeometry(1, 0.6);
    const meshes = [];
    const wind = [random.range(-.00005, .00005), random.range(-.00005, .00005), random.range(-.00005, .00005)];
    const meshNum = random.range(6, 32);
    const opacity = random.range(0.035, 0.1);
    for (let i = 0; i < meshNum; i++) {
        const mesh = new THREE.Mesh(
            box,
            new THREE.ShaderMaterial({
                fragmentShader,
                vertexShader,
                uniforms: {
                    rand: { value: random.range(0.5, 1) },
                    time: { value: 0 },
                    opacity: { value: opacity }
                }
            })
        );

        mesh.position.set(random.range(X_MEDIAN, X_DEVIATION), random.range(Y_MEDIAN, Y_DEVIATION), random.range(Z_MEDIAN, Z_DEVIATION));
        mesh.scale.multiplyScalar(random.range(SCALE_MEDIAN, SCALE_DEVIATION));
        const windSpeed = random.gaussian(WIND_SPEED_MEDIAN, WIND_SPEED_DEVIATION);
        mesh.direction = [wind[0] * windSpeed, wind[1] * windSpeed, wind[2] * windSpeed];
        meshes.push(mesh);
    }

    return meshes;
};

const getCloudRandomRanges = () => {
    const xMin = random.range(-4, 4);
    const xMax = lerp(xMin, xMin + 4, random.range(0, 1));
    const yMin = random.range(1, 4);
    const yMax = lerp(yMin, yMin + 3, random.range(0, 1));
    const zMin = random.range(-2, 4);
    const zMax = lerp(zMin, zMin + 2, random.range(0, 1));

    return [
        [xMin, xMax],
        [yMin, yMax],
        [zMin, zMax]
    ];
};

const getRandomCloud = () => {
    return getCloudMeshes(getCloudRandomRanges(), [random.range(0.080, 0.2), random.range(0.3, 0.45)])
};

export {
    getCloudMeshes,
    getRandomCloud
};
