require('three/examples/js/objects/Sky');

function initSky() {

    let sky, sunSphere;

    // Add Sky
    sky = new THREE.Sky();
    sky.scale.setScalar( 450000 );
    // Add Sun Helper
    sunSphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry( 20000, 16, 8 ),
        new THREE.MeshBasicMaterial( { color: 0xffffff } )
    );
    sunSphere.position.y = - 700000;
    sunSphere.visible = false;
    /// GUI
    let effectController  = {
        turbidity: 2,
        rayleigh: 2.42,
        mieCoefficient: 0.045,
        mieDirectionalG: 0.4,
        luminance: 1,
        inclination: 0.05, // elevation / inclination
        azimuth: 0.35, // Facing front,
        sun: true
    };
    let distance = 400000;
    let uniforms = sky.material.uniforms;
    uniforms.turbidity.value = effectController.turbidity;
    uniforms.rayleigh.value = effectController.rayleigh;
    uniforms.luminance.value = effectController.luminance;
    uniforms.mieCoefficient.value = effectController.mieCoefficient;
    uniforms.mieDirectionalG.value = effectController.mieDirectionalG;
    let theta = Math.PI * ( effectController.inclination - 0.5 );
    let phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );
    sunSphere.position.x = distance * Math.cos( phi );
    sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
    sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );
    sunSphere.visible = effectController.sun;
    uniforms.sunPosition.value.copy( sunSphere.position );

    return {sky, sunSphere};
}

export default initSky;