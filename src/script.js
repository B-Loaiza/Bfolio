import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import VertexShader from './shaders/tknot/vertex.glsl'
import FragmentShader from './shaders/tknot/fragment.glsl'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

//test
//test2
/**
 * Debug
 */
// const gui = new dat.GUI()
const debugObject = {}

const parameters = {
    materialColor: '#ffeded'
}

// gui
//     .addColor(parameters, 'materialColor')
//     .onChange(() =>
//     {
//         particlesMaterial.color.set(parameters.materialColor)
//     })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

function sectionSelector() 
{
const home = document.getElementById("firstsection").addEventListener("click", () => {
    document.getElementById("section-1").style.display="block";
    document.getElementById("section-2").style.display="none";
    document.getElementById("section-3").style.display="none";
    document.getElementById("section-4").style.display="none";

    gsap.to(camera.position, 
        {
            duration: 2,
            x: 0,
            y: 0,
            z: 60
        });
}, false);

const proj = document.getElementById("secondsection").addEventListener("click", () => {
    document.getElementById("section-1").style.display="none";
    document.getElementById("section-2").style.display="block";
    document.getElementById("section-3").style.display="none";
    document.getElementById("section-4").style.display="none";

    gsap.to(camera.position, 
        {
            duration: 4,
            x: 4,
            y: 0,
            z: 15
        });

    gsap.from(".project-wrapper", {opacity: 0, duration: 10, delay: 2, y: -50, backgroundPosition: '200px 0px', ease: 'elastic(1, 0.3)', stagger: 0.4})

}, false);

const about = document.getElementById("thirdsection").addEventListener("click", () => {
    document.getElementById("section-1").style.display="none";
    document.getElementById("section-2").style.display="none";
    document.getElementById("section-3").style.display="block";
    document.getElementById("section-4").style.display="none";
    
    gsap.to(camera.position, 
        {
            duration: 4,
            x: 20,
            y: 0,
            z: 20
        });

        gsap.from(".about-wrapper", {opacity: 0, duration: 10, delay: 1.4, x: 50, backgroundPosition: '200px 0px', ease: 'elastic(1, 0.3)', stagger: 0.4})

}, false);

const contact = document.getElementById("fourthsection").addEventListener("click", () => {
    document.getElementById("section-1").style.display="none";
    document.getElementById("section-2").style.display="none";
    document.getElementById("section-3").style.display="none";
    document.getElementById("section-4").style.display="block";
    
    gsap.to(camera.position, 
        {
            duration: 6,
            x: 15,
            y: 0,
            z: 35
        });

        gsap.from(".contact-wrapper", {opacity: 0, duration: 5, delay: 1.4, x: -100, backgroundPosition: '200px 0px'})

}, false);
}

const menu = document.querySelector(".menu");
menu.addEventListener('click', () => {
    document.querySelector('.navbar-wrapper').classList.toggle('change');
})

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
//Cloud Geometry
let cloudParticles = [];
let loader = new THREE.TextureLoader();
loader.load("../images/smoke-1.png", (texture) => {
    const cloudGeo = new THREE.PlaneBufferGeometry(20, 10);
    const cloudMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true,
        wireframe: false,
        depthWrite: false,
        color: '#111836'
    });
    for(let p = 0; p < 25; p++)
    {
        const cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
        cloud.position.set(
            0, 0, -1
        );
        cloud.rotation.x = 1.16;
        cloud.rotation.y = -0.12;
        cloud.rotation.z = Math.random() * 360;
        cloud.material.opacity = 0.4;
        cloudParticles.push(cloud);
        cloud.position.z = 45;
        scene.add(cloud);
    }
})

const objectsDistance = 10;
//Particles floating around cloud
//Geometry
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)

for(let i = 0; i< particlesCount; i++)
{
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance //* sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

//Material for particles
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.02,
})

//Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
particles.position.z = 50
scene.add(particles)


// initial Shader plane
const shaderGeometry = new THREE.TorusKnotBufferGeometry(25, 2, 100, 16);

//Shader Color
debugObject.depthColor = '#111836'
// debugObject.surfaceColor = '#99e0ff'
//Purple effect
debugObject.surfaceColor = '#603e5f'

const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: VertexShader,
    fragmentShader: FragmentShader,
    depthWrite: false,
    uniforms:
    {
        uTime: {value: 0},

        uHighVexElevate: {value: 1},
        uHighVexFreq: {value: new THREE.Vector2(5, 1.5)},
        uHighVexSpeed: {value: 0.75},

        uLowVexElevate: {value: 0.2},
        uLowVexFreq: {value: 0},
        uLowVexSpeed: {value: 0.2},
        uLowVexIterate: {value: 4},


        uDepthColor: {value: new THREE.Color(debugObject.depthColor)},
        uSurfaceColor: {value: new THREE.Color(debugObject.surfaceColor)},
        uColorOffset: {value: 0.08},
        uColorMultiplier: {value: 8}
    }
})


const shader = new THREE.Mesh(shaderGeometry, shaderMaterial)
// shader.rotation.y = Math.PI
// shader.position.set(15, 0, 10)
shader.position.set(15, 0, 0)
shader.rotation.x = Math.PI / 2
scene.add(shader)

//text geometry
const fontLoader = new FontLoader();
fontLoader.load('fonts/helvetiker_regular.typeface.json', (font) => 
{
const textgeo = new TextGeometry('Brian Loaiza', {
    size: 0.5,
    height: 0.2,
    font: font,
    curveSegments: 12,
    bevelSize: 0.02,
    bevelThickness: 0.03,
    bevelOffset: 0,
    bevelEnabled: true,
    bevelSegments: 5
});

textgeo.center();

const textMaterial = new THREE.MeshBasicMaterial({color: '#ffeded'});
const text = new THREE.Mesh(textgeo, textMaterial);
text.position.z = 50;
text.position.y = 0.2;
scene.add(text);
});

fontLoader.load('fonts/helvetiker_regular.typeface.json', (font) => 
{
const text2geo = new TextGeometry('Frontend Developer', {
    size: 0.4,
    height: 0.2,
    font: font,
    curveSegments: 12,
    bevelSize: 0.02,
    bevelThickness: 0.03,
    bevelOffset: 0,
    bevelEnabled: true,
    bevelSegments: 5
});

text2geo.center();

const text2Material = new THREE.MeshBasicMaterial({color: '#ffeded'});
const text2 = new THREE.Mesh(text2geo, text2Material);
text2.position.z = 50;
text2.position.y = -0.6;
scene.add(text2);
});


/**Lights */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 44)
scene.add(directionalLight)

const ambient = new THREE.AmbientLight(0x555555);
scene.add(ambient);
const dirlight = new THREE.DirectionalLight(0xffeedd);
dirlight.position.set(0,0,45);
scene.add(dirlight)
const flash = new THREE.PointLight(0x603e5f, 30, 500, 1.7);
flash.position.z = 45
scene.add(flash);
scene.fog = new THREE.FogExp2(0x11111f, 0.002);


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Camera
 */
//Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)


// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
const currentCamera = camera.position
// camera.position.z = 6
camera.position.z = 60
camera.position.x = 0.05
cameraGroup.add(camera)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(scene.fog.color);

//scroll
let scrollY = window.scrollY;
let currentSection = 0;

/*Cursor*/
const cursor = {}
cursor.x = 0;
cursor.y = 0;

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
})


/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    //Animate camera  allows camera to move around left to right with cursor
    camera.position.y = - scrollY / sizes.height * objectsDistance;

    const parallaxX = cursor.x * 0.5;
    const parallaxY = - cursor.y * 0.5;
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

    // shaderMaterial.uniforms.uTime.value = elapsedTime

    //particles animation
    particles.rotation.y = Math.sin((Math.PI / 3 + -Math.PI / 2.6) * 2 * elapsedTime);
    particles.rotation.x = (Math.PI / 3 + -Math.PI / 2.6) * 2 * elapsedTime;

    
    if(Math.random() > 0.93 || flash.power > 100)
    {
        if(flash.power < 100)
        {
            flash.position.set(
                Math.random(), Math.random(), Math.random()
            )
        }
        flash.power = 50 + Math.random() * 500;
    }

    // shader.rotation.z += 0.0001
    shader.rotation.z += 0.001

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();
sectionSelector();