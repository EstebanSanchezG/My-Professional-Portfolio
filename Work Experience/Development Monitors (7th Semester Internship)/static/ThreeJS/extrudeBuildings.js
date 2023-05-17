// const scene = new THREE.Scene();
// //geoJSON file to load
// fetch('assets/taiz_city_2.geojson')
//     .then((response) => response.json())
//     .then(data);
    
// //create a function that takes the json data from the file as input   
    
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );

// const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);
// camera.position.set(440220,135859,50);
// camera.up.set(0,0,1);
// scene.add(camera);

// const controls = new OrbitControls(camera, renderer.domElement); 
// controls.enableDamping = true;
// controls.dampingFactor = 0.05;
// controls.maxPolarAngle = Math.PI / 2;
// controls.zoomSpeed= 0.001; 
// controls.panSpeed = 0.00001;
// controls.rotateSpeed=0.001; 
// console.log(controls);


// controls.update();

    
// function animate() {
//     requestAnimationFrame( animate );
//     controls.update();
//     renderer.render( scene, camera );
    
       
// }
// animate();
   
// const group = new THREE.Group();

// function data(json) {
//     //creating the scene
    
    
//     for (let i = 0; i < json.features.length; i++) {
//         var building =json.features[i].geometry.coordinates;

//         if(building[0].length>4){

        
//         var californiaPts = [];
//         californiaPts.push( new THREE.Vector2 ( (building[0][0][0])*10000, (building[0][0][1])*10000 ) );
//         californiaPts.push( new THREE.Vector2 ( (building[0][1][0])*10000, (building[0][1][1])*10000) );
//         californiaPts.push( new THREE.Vector2 ( (building[0][2][0])*10000, (building[0][2][1])*10000 ) );
//         californiaPts.push( new THREE.Vector2 ( (building[0][3][0])*10000, (building[0][3][1])*10000) );
//         }
       
//         var shapesquare = new THREE.Shape(californiaPts);
//         var extrudeSettings = { amount: 1000000 }; // bevelSegments: 2, steps: 2 , bevelSegments: 5, bevelSize: 8, bevelThickness:5
//         var geometry = new THREE.ExtrudeGeometry(shapesquare, extrudeSettings);
        
//         const material = new THREE.MeshBasicMaterial( { color: 0xfff0 } );
//         const buildings = new THREE.Mesh( geometry, material ) ;
        
//         group.add(buildings);
        

        
      
       
       
//     }
    
//     console.log(group);
    
  

//     scene.add(group);
//     controls.target.copy(group.position);
    
//     controls.update();
// }

