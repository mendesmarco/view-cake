// Configuração inicial
let scene, camera, renderer, controls;
let model;

// Inicialização
function init() {
    // Criar cena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Criar câmera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5); // Posição inicial da câmera com ângulo

    // Criar renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('container').appendChild(renderer.domElement);

    // Adicionar controles de órbita com limitações
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Limitar rotação vertical (polar)
    controls.minPolarAngle = Math.PI / 2.2; // Limite superior (60 graus)
    controls.maxPolarAngle = Math.PI / 2.2; // Limite inferior (cerca de 82 graus)
    
    // Permitir rotação horizontal completa
    controls.enableRotate = true;
    
    // Desabilitar zoom e pan se desejar movimento mais restrito
    controls.enableZoom = true;
    controls.enablePan = false; // Desabilita arrastar o modelo

    // Adicionar luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 8, 5);
    scene.add(directionalLight);

    // Adicionar uma luz adicional para melhor iluminação
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);

    // Carregar modelo
    const loader = new THREE.GLTFLoader();
    loader.load(
        'models/bolo-3d.glb', // Substitua pelo caminho do seu arquivo GLB
        function (gltf) {
            model = gltf.scene;
            scene.add(model);

            // Centralizar modelo
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);

            // Ajustar câmera para o ângulo desejado
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            
            // Definir posição da câmera para manter o ângulo
            camera.position.set(0, maxDim * 1.2, maxDim * 1.8);
            camera.lookAt(0, 0, 0);
            
            // Atualizar controles
            controls.target.set(0, 0, 0);
            controls.update();
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% carregado');
        },
        function (error) {
            console.error('Erro ao carregar o modelo:', error);
        }
    );

    // Lidar com redimensionamento da janela
    window.addEventListener('resize', onWindowResize, false);
}

// Função para redimensionar a janela
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Loop de animação
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Iniciar a aplicação
init();
animate(); 