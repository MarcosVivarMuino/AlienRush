var MenuSinConexion = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "MenuSinConexion" });
    },
    
    init: function (data) {
        sceneName = data.sceneName;
    },
    
    preload: function () {
        this.load.image('botonRecargar', 'assets/SinConex/BotonRecargar.png');
        this.load.image('fondoError', 'assets/SinConex/fondoError.png');
    },

    create: function () {
        /************************* FONDO *************************/
        this.add.image(875, 440, 'fondoError');
       
        /************************* BOTONES *************************/
        //Reconexion
        botonRecargar.on('pointerdown', () => {
			let local = this;
			$.ajax({
        	method: "GET",
        	url: "/conexion",
        	success: function () {
            	local.scene.resume(sceneName);
            	local.scene.get(sceneName).onResume();
            	local.scene.stop('MenuSinConexion');
        	},
    		});
        });
        botonRecargar.on("pointerover", () => { botonRecargar.setScale(1.2); });
        botonRecargar.on("pointerout", () => { botonRecargar.setScale(1); });

    }
});