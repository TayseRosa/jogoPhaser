(function(){
	//Dimensao da tela | Tecnologia de renderização (canvas ou Webgl) | div onde o jogo vai estar | estado ou fase do jogo
	var game = new Phaser.Game(800,600, Phaser.AUTO, null,{preload:preload,create: create,update: update});
	var platforms;
	var player;
	var keys;
	var stars;
	var txtScore;//string
	var score = 0//pontuaçãp
	
	//Carregar os recursos que vai usar no jogo
	function preload(){
		game.load.image('sky', 'img/sky.png');//carrega o arquivo para a memoria do dispositivo
		game.load.image('platform', 'img/platform.png');
		game.load.image('star', 'img/star.png');

		//carregando o sprite do personagem para a memoria do dispositivo
		game.load.spritesheet('dude', 'img/dude.png', 32,48);
	}

	//Cria os elementos que vai usar no jogo 
	function create(){
		//movimentos do boneco
		keys = game.input.keyboard.createCursorKeys();

		//start do jogo (sistema de fisica)
		game.physics.startSystem(Phaser.Physics.ARCADE);

		game.add.sprite(0,0, 'sky');//coordenadas x,y do cenario do céu
		platforms = game.add.group();
		platforms.enableBody = true;
		var platform = platforms.create(0,game.world.height-64,'platform');//Plataforma verde
		platform.scale.setTo(2,2);
		
		//plataforma fixa
		platform.body.immovable = true;

		//Criando outra plataforma
		platform=platforms.create(400,400,'platform');
		platform.body.immovable = true;

		//Criando mais uma plataforma
		platform=platforms.create(-150,250,'platform');
		platform.body.immovable = true;

		//grupo de estrelas
		stars = game.add.group();//cria o grupo de estrelas
		stars.enableBody = true;//ativa a mecanica de física

		//criar estrelas automaticamente
		for (var i = 0; i < 12; i++) {
			var star = stars.create(i * 70, 0, 'star');//x | y | imagem que vou usar			
			//add a gravidade nas estrelas
			star.body.gravity.y = 300;
			//estrela quicando
			star.body.bounce.y = 0.7 + (Math.random()*0.2);
		}
		
		

		//Criar o personagem
		player = game.add.sprite(50, game.world.height-150, 'dude');//coordenadas | sprite referente ao personagem | nome dado ao personagem
		
		//corpo com simulação fiasica
		game.physics.arcade.enable(player);
		player.body.gravity.y = 300;
		
		//Personagem quica ao colidir
		player.body.bounce.y = 0.2;
		
		//Manter o personagem dentro da tela de jogo
		player.body.collideWorldBounds = true;

		//orientação|array do sprite | velocidade|repetira a animação ou vai parar
		player.animations.add('left', [0,1,2,3], 10, true);
		//orientação|array do sprite | velocidade|repetira a animação ou vai parar
		player.animations.add('right', [5,6,7,8], 10, true);

		//Exibir Pontuação do jogo na tela
		txtScore = game.add.text(16,16,'SCORE', {fontSize:32, fill:'#fff'} );//posição x,y, | textp | conffiguração visual

	}

	//Logica do jogo que sera verificada a cada loop do jogo
	function update(){
		//verifica se o personagem colide com a plataforma
		game.physics.arcade.collide(player, platforms);
		//verifica se as estrelas colidem com a plataforma
		game.physics.arcade.collide(stars, platforms);

		//verifica se os corpos estao colidindo, porem nao bloqueia
		game.physics.arcade.overlap(player, stars, collectStar);//3º função o que vai acontecer ao colidir

		player.body.velocity.x = 0;		
		if(keys.left.isDown){
			player.body.velocity.x = -150;
			player.animations.play('left');
		}else if(keys.right.isDown){
			player.body.velocity.x = 150;
			player.animations.play('right');
		}else if(keys.up.isDown && player.body.touching.down){
			player.body.velocity.y = -350;
		}else{
			player.animations.stop();
			player.frame = 4;
		}
	}

	//Personagem vai colher as estrelas
	function collectStar(player,star){
		star.kill();//kill elimina um sprite do jogo
		score+= 10;
		txtScore.text = 'SCORE: '+ score;
	}


}());