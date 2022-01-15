FresnelShader = {

	uniforms: {},
	vertexShader: [

		"varying vec3 vPositionW;",
		"varying vec3 vNormalW;",

		"void main() {",

		"	vPositionW = vec3( vec4( position, 1.0 ) * modelMatrix);",
		" vNormalW = normalize( vec3( vec4( normal, 0.0 ) * modelMatrix ) );",

		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"varying vec3 vPositionW;",
		"varying vec3 vNormalW;",

		"void main() {",

		"	vec3 color = vec3(1., 1., 1.);",
		"	vec3 viewDirectionW = normalize(cameraPosition - vPositionW);",
		"	float fresnelTerm = dot(viewDirectionW, vNormalW);",
		"	fresnelTerm = clamp(1.0 - fresnelTerm, 0., 1.);",

		"	gl_FragColor = vec4( color * fresnelTerm, 1.);",

		"}"

	].join("\n")

};


var camera, scene, renderer;
var geometry, material, mesh;

init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
	camera.position.z = 5;

	scene = new THREE.Scene();

	geometry = new THREE.TorusKnotBufferGeometry(1, 0.3, 128, 16);
	material = new THREE.ShaderMaterial({
		vertexShader: THREE.FresnelShader.vertexShader,
		fragmentShader: THREE.FresnelShader.fragmentShader
	});

	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	var controls = new THREE.OrbitControls(camera, renderer.domElement);

}

function animate() {

	requestAnimationFrame(animate);

	renderer.render(scene, camera);

}











var geometry = new THREE.TorusKnotBufferGeometry(1, 0.3, 128, 16);


// https://github.com/Fyrestar/THREE.extendMaterial

var material = THREE.extendMaterial(THREE.MeshStandardMaterial, {


  // Will be prepended to vertex and fragment code

  header: 'varying vec3 vNN; varying vec3 vEye;',
  fragmentHeader: 'uniform vec3 fresnelColor;',


  // Insert code lines by hinting at a existing

  vertex: {
    // Inserts the line after #include <fog_vertex>
    '#include <fog_vertex>': `


          mat4 LM = modelMatrix;
          LM[2][3] = 0.0;
          LM[3][0] = 0.0;
          LM[3][1] = 0.0;
          LM[3][2] = 0.0;

          vec4 GN = LM * vec4(objectNormal.xyz, 1.0);
          vNN = normalize(GN.xyz);
          vEye = normalize(GN.xyz-cameraPosition);` },

  fragment: {
    'gl_FragColor = vec4( outgoingLight, diffuseColor.a );': `

gl_FragColor.rgb +=  ( 1.0 - -min(dot(vEye, normalize(vNN) ), 0.0) ) * fresnelColor;

` },



  // Uniforms (will be applied to existing or added)

  uniforms: {
    diffuse: new THREE.Color('black'),
    fresnelColor: new THREE.Color('blue') } });






// mesh
mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);



function animate() {

  mesh.rotateY(0.02);

  requestAnimationFrame(animate);

  renderer.render(scene, camera);

}
