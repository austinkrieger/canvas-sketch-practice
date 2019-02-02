
const explosionVertexShader = `
varying vec2 vUv;
uniform float time;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 8
float fbm (in vec2 st) {
    // Initial values
    float value = 0.008;
    float amplitude = 1.740;
    float frequency = -0.464;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 0.02;
        amplitude *= -.5;
    }
    return value;
}

void main() {
    vec2 st = gl_FragCoord.xy/vUv.xy;
    st.x *= vUv.x/vUv.y;

    vec3 color = vec3(0.0);
    color.x += 1.5 * fbm(st *  3.0);
    color.y += 0.5 * fbm(st * 10.0);
    color.z += 4.0 * fbm(st * 8.0);


    gl_FragColor = vec4(color, 0.4);
}

`;

export default explosionVertexShader;