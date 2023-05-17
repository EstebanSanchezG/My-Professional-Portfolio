/**
 * @author Bjorn Sandvik / http://thematicmapping.org/
 */

//Terrain Loader function initializer
 THREE.TerrainLoader = function ( manager ) {
	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
};

THREE.TerrainLoader.prototype = {

	constructor: THREE.TerrainLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;
		var request = new XMLHttpRequest();

        //Load object
		if ( onLoad !== undefined ) {
			request.addEventListener( 'load', function ( event ) {
				onLoad( new Uint16Array( event.target.response ) );
				scope.manager.itemEnd( url );
			}, false );
		}


        //Load progress message while terrain loads
		if ( onProgress !== undefined ) {
			request.addEventListener( 'progress', function ( event ) {
				onProgress( event );
			}, false );
		}


        //Error message in the event of an issue
		if ( onError !== undefined ) {
			request.addEventListener( 'error', function ( event ) {
				onError( event );
			}, false );
		}


        //Buffer terrain loader array to load bin height points.
		if ( this.crossOrigin !== undefined ) request.crossOrigin = this.crossOrigin;
		request.open( 'GET', url, true );
		request.responseType = 'arraybuffer';
		request.send( null );
		scope.manager.itemStart( url );
	},

	setCrossOrigin: function ( value ) {
		this.crossOrigin = value;
	}
};