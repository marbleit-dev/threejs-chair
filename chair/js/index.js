let scene, camera, renderer, controls;

let modelUrl = 'models/chair.gltf';
let planeTextureUrl = 'textures/carpet.jpg';
let dracoPath = '../js/draco/';

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 3, 50);
    camera.position.set(15, 15, 15);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;
    renderer.setClearColor(0xe5e5e5);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.update = false;
    renderer.sortObjects = false;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.autoClear = true;
    document.body.appendChild(renderer.domElement);
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableKeys = false;
    controls.enablePan = false;
    controls.maxDistance = 30;
    controls.minDistance = 20;
    controls.enableDamping = true;

    let light = new THREE.PointLight(0xFFFFFF, 1, 1000);
    light.position.set(2, 20, 2);
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 10;
    light.shadow.camera.far = 30;
    scene.add(light);

    light = new THREE.AmbientLight(0xFFFFFF, .35);
    scene.add(light);

    let geometry = new THREE.BoxBufferGeometry(23, .1, 23, 100, 100);
    let texture = new THREE.TextureLoader().load(planeTextureUrl);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat = new THREE.Vector2(10, 10);
    let material = new THREE.MeshPhysicalMaterial( {
        map: texture,
        roughness: .95,
        reflectivity: 0
    });
    let plane = new THREE.Mesh(geometry, material);
    plane.receiveShadow = true;
    plane.matrixAutoUpdate = false;
    scene.add(plane);

    let gltfLoader = new THREE.GLTFLoader();

    let dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath(dracoPath);
    gltfLoader.setDRACOLoader(dracoLoader);
    
    gltfLoader.load(modelUrl, gltf => {
        for (child in gltf.scene.children)
            gltf.scene.children[child].castShadow = true;
        gltf.scene.scale.set(17, 17, 17);
        scene.add(gltf.scene);
    });

    let renderPass = new THREE.RenderPass(scene, camera);
    
    let composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderPass);
    
    renderPass.renderToScreen = true;

    animate();

    function animate() {
        requestAnimationFrame(animate);

        controls.update();

        composer.render();
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

init();