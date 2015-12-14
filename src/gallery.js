const THREE = require('three');
const Stats = require('exports?Stats!../libs/stats.js');
// require('../libs/PointerLockControls');

const initStats = function() {
  const stats = new Stats();
  stats.setMode(0);

  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  document.getElementById('Stats-output').appendChild(stats.domElement);

  return stats;
};

let controlsEnabled = false;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let prevTime = performance.now();
let velocity = new THREE.Vector3();

const onKeyDown = function(event) {
  switch (event.keyCode) {
  case 38: // up
  case 87: // w
    moveForward = true;
    break;
  case 37: // left
  case 65: // a
    moveLeft = true; break;
  case 40: // down
  case 83: // s
    moveBackward = true;
    break;
  case 39: // right
  case 68: // d
    moveRight = true;
    break;
  case 32: // space
    if (canJump === true) velocity.y += 350;
    canJump = false;
    break;
  }
};

const onKeyUp = function(event) {
  switch (event.keyCode) {
  case 38: // up
  case 87: // w
    moveForward = false;
    break;
  case 37: // left
  case 65: // a
    moveLeft = false;
    break;
  case 40: // down
  case 83: // s
    moveBackward = false;
    break;
  case 39: // right
  case 68: // d
    moveRight = false;
    break;
  }
};

document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);

const clock = new THREE.Clock();
const stats = initStats();
const scene = new THREE.Scene();

const plane = new THREE.Mesh(new THREE.PlaneGeometry(50, 50, 1, 1), new THREE.MeshBasicMaterial({ color: 0xcccccc }));
plane.rotation.x = -0.5 * Math.PI;
plane.position.x = 0;
plane.position.y = 0;
plane.position.z = 0;
scene.add(plane);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 10;
camera.lookAt(new THREE.Vector3(0, 0, 0));

const webGLRenderer = new THREE.WebGLRenderer();
webGLRenderer.setClearColor(new THREE.Color(0xffffff, 1.0));
webGLRenderer.setSize(window.innerWidth, window.innerHeight);
webGLRenderer.shadowMap.enabled = true;

const controls = new THREE.PointerLockControls(camera);
// controls.enabled = true;
// controlsEnabled
scene.add(controls.getObject());


const geometry = new THREE.BoxGeometry(20, 20, 20);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
cube.position.x = 0;
cube.position.y = 10;
cube.position.z = 0;
scene.add(cube);




var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

  console.log(havePointerLock);

  if ( havePointerLock ) {
    var element = document.body;
    var pointerlockchange = function ( event ) {
      if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
        controlsEnabled = true;
        controls.enabled = true;
      } else {
        controls.enabled = false;
      }
    };

    var pointerlockerror = function ( event ) {
      console.error('pointerlockerror');
    };

    // Hook pointer lock state change events
    document.addEventListener( 'pointerlockchange', pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

    document.addEventListener( 'pointerlockerror', pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

    instructions.addEventListener( 'click', function ( event ) {
      instructions.style.display = 'none';

      // Ask the browser to lock the pointer
      element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

      if ( /Firefox/i.test( navigator.userAgent ) ) {
        var fullscreenchange = function ( event ) {
          if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
            document.removeEventListener( 'fullscreenchange', fullscreenchange );
            document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
            element.requestPointerLock();
          }
        };

        document.addEventListener( 'fullscreenchange', fullscreenchange, false );
        document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

        element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
        element.requestFullscreen();
      } else {
        element.requestPointerLock();
      }
    }, false );
  } else {
    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
  }






document.getElementById('WebGL-output').appendChild(webGLRenderer.domElement);

let step = 0;

export function render() {
  stats.update();
  const delta = clock.getDelta();

  // camControls.update(delta);
  webGLRenderer.clear();
  // requestAnimationFrame(render);
  // webGLRenderer.render(scene, camera);

  requestAnimationFrame(render);
  if (controlsEnabled) {
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    if (moveForward) {
      velocity.z -= 400.0 * delta;
    }
    if (moveBackward) {
      velocity.z += 400.0 * delta;
    }
    if (moveLeft) {
      velocity.x -= 400.0 * delta;
    }
    if (moveRight) {
      velocity.x += 400.0 * delta;
    }
    canJump = true;
  }

  controls.getObject().translateX(velocity.x * delta);
  controls.getObject().translateY(velocity.y * delta);
  controls.getObject().translateZ(velocity.z * delta);

  if (controls.getObject().position.y < 10) {
    velocity.y = 0;
    controls.getObject().position.y = 10;
    canJump = true;
  }
  webGLRenderer.render(scene, camera);
}
