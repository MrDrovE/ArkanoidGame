class GameObject {
    constructor(image, x, y,name,speed,scale){
        this.dead = false;
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = image;
        this.name = name;
        this.speed = speed;
        this.scale = scale;
    }
 
    update(){
        this.y += this.speed;
		
		if(this.y > canvas.height + 50)
		{
			this.dead = true;
		}
		
    }

    move(v, d) {
        if(v == "x") //Перемещение по оси X
        {
            this.x += d; //Смещение
            //Если при смещении объект выходит за края холста, то изменения откатываются
            if(this.x + this.image.width * this.scale > canvas.width) {
                this.x -= d; 
            }
            if(this.x < 0) {
                this.x = 0;
            }
        }
        else //Перемещение по оси Y
        {
            this.y += d;
 
            if(this.y + this.image.height * this.scale > canvas.height) {
                this.y -= d;
            }
 
            if(this.y < 0) {
                this.y = 0;
            }
        }
    }

    collide(car){
        var hit = false;
        var obj; // по кому попала
        try{
            if(this.y < car.y + car.image.height * car.scale && this.y + this.image.height * this.scale > car.y) //Если объекты находятся на одной линии по горизонтали
            {
                if(this.x < car.x + car.image.width * car.scale && this.x + this.image.width * this.scale > car.x ) //Если объекты находятся на одной линии по вертикали
                {
                    hit = true
                    obj = car.name
                }
            }
        return { hit,obj };
        } catch(e){
            console.error(car, objects, e);
        }
    }
}

class Bulet extends GameObject {
    constructor(image, x, y,name,speed,borntime,scale){
        super(image, x, y, name, speed, scale);
        this.borntime = borntime;
    }

    update() {
        this.y -= this.speed;
        if (this.y < -50) {
            this.dead = true;
        }
    }
}

class Enemy extends GameObject {}

class Civilian extends GameObject {}

class CaptureZone {
    constructor(x,y,image,name,scale){
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = image;
        this.name = name;   
        this.scale = scale;     
    }
}

class Player extends GameObject {
    constructor(image, x, y,name,speed,scale){
        super(image, x, y, name, speed, scale);
        this.keyPresses = {};
        this.keyShoot = false;
    }

    moveLoop() {  
        if (this.keyPresses.KeyA) {
            this.moveCharacter(-this.speed, 0);
        } 
        if (this.keyPresses.KeyD) {
            this.moveCharacter(this.speed, 0);
        }
        if (this.keyPresses.KeyW) {
            this.moveCharacter(0, -this.speed);            
        } 
        if (this.keyPresses.KeyS) {
            this.moveCharacter(0, this.speed);
        }
        if (this.keyShoot){
            this.shoot()
        }

    }// moveLoop

    moveCharacter(deltaX, deltaY) {
        if (this.x + deltaX > 0 && this.x + this.image.width*this.scale + deltaX < canvas.width) {
            this.x += deltaX;
        }
        if (this.y + deltaY > 0 && this.y + this.image.height*this.scale + deltaY < canvas.height) {
            this.y += deltaY;
        }
    }

    shoot(){
        if (time - lastshoot < 30){
            return 
        } 
        lastshoot = time
        bullets.push(new Bulet("images/shoot.png", this.x + 17, this.y-55, "bullet",speed+10,time,2.15))
        playSound(shootSound);
    }
    
}

class Road {
    constructor(image, y) {
        this.x = 0;
        this.y = y;
        this.image = new Image();
        this.image.src = image;
    }
 
    update(road) {
        this.y += speed; //При обновлении изображение смещается вниз
 
        if(this.y > window.innerHeight) //Если изображение ушло за край холста, то меняем положение
        {
            this.y = road.y - canvas.height + speed; //Новое положение указывается с учётом второго фона
        }
    }
}
//
//
//
//
//
//
//
//
//
// 
//
//
//
//
//
//
//
//
const canvas = document.getElementById("canvas"); //Получение холста из DOM
const ctx = canvas.getContext("2d"); 
const scale = 0.7; //Масштаб машин
const speed = 5; //скорость игорька
const shootSound = new Audio("sounds/shoot.mp3");
const explosionSound = new Audio("sounds/explosion.mp3");
const scoreSound = new Audio("sounds/score.mp3");
const startSound = new Audio("sounds/start.mp3");
const gameOverSound = new Audio("sounds/gameover.mp3");
const gifOptions = {
    src: ["images/exp1.png", "images/exp2.png", "images/exp3.png", "images/exp4.png", "images/exp5.png","images/exp6.png","images/exp7.png","images/exp8.png"],
    frame: 0
};
let streak = 0.0 // количество убийств
let score = 0.0; // количество спасённых человек
let lastshoot = 0; // время последнего выстрела 
let time = 0; // время игры 
let shoptime = 10 * 60;
let pause = false; // пауза 
let timer;
Resize(); // При загрузке страницы задаётся размер холста

window.addEventListener("resize", Resize); //При изменении размеров окна будут меняться размеры холста
window.addEventListener('keydown', keyDownListener);
window.addEventListener('keyup',keyUpListener);
window.addEventListener("click", Start); //Получение нажатий с клавиатуры 

let objects = []; //Массив игровых объектов
let bullets = []; // Массив с пулями

let player = new  Player("images/player.png", canvas.width / 2, canvas.height / 2, "player",speed ,scale);
let roads = [new  Road("images/road.png", 0),new  Road("images/road.png", canvas.height)]; 

function Start() {
	window.removeEventListener("click", Start); //удаление нажатий с клавиатуры 
    timer = setInterval(Update, 1000 / 60); //Состояние игры будет обновляться 60 раз в секунду — при такой частоте обновление происходящего будет казаться очень плавным
    playSound(startSound);
    player.dead = false;
    score = 0;
    streak = 0;

}

function Stop() {
    objects = []
    clearInterval(timer); //Остановка обновления
    playSound(gameOverSound);
    const rebutton = document.getElementById("rebutton");
    rebutton.style.zIndex = 0;
    
}

function Regame(){
    const rebutton = document.getElementById("rebutton");
    rebutton.style.zIndex = -1;
    Draw0();    
    window.addEventListener("click", Start); //Получение нажатий с клавиатуры 
} 
function Update() {
	time += 1
	roads[0].update(roads[1]);
    roads[1].update(roads[0]);
	player.moveLoop();

    if (time >= shoptime){
        shoptime = time + RandomInteger(90,100) * 60;
        shop(objects)
    }
    if (!pause){
        if(RandomInteger(0, 10000) > 9800) { //создание новых кораблей
            objects.push(new Enemy("images/enemy.png", RandomInteger(30, canvas.width - 50), RandomInteger(250, 400) * -1, "enemy",speed + 1.5 + RandomInteger(0.1,0.4),scale));
        }
        
        if(RandomInteger(0, 10000) > 9990) { //создание новых кораблей
            objects.push(new Civilian("images/civilian.png", RandomInteger(30, canvas.width - 50), RandomInteger(250, 400) * -1,"civilian",speed + 0.5,scale));
        }
        objects.forEach(obj => obj.update()); // смещение по y имитация движения 
        bullets.forEach(bullet => bullet.update());
    
    
        objects = objects.filter(n => !n.dead);
        bullets = bullets.filter(n => !n.dead);
    }
	
	
    objects.forEach(obj => {
        const collision = player.collide(obj);
        if (collision.hit) {
            if (collision.obj === "enemy"){
                Stop();
                startExplosion(obj);
                player.dead = true;
            } else { 
                score += 1;
                obj.dead = true;
                playSound(scoreSound);
            }
        }
        
        bullets.forEach(bullet => {
            if (time - bullet.borntime > 180 ){
                bullet.dead = true
            }
            const bulletCollision = bullet.collide(obj);
            if (bulletCollision.hit) {
                if (bulletCollision.obj == "enemy"){
                    startExplosion(obj);
                    streak += 1;
                    playSound(explosionSound);
                } else{
                    alert("Не стреляй по гражданским");
                }
                obj.dead = true;
                bullet.dead = true;
            }
        });
    });
	// for(let i = 0; i < objects.length; i++)
	// {
        //console.log(objects[i].y,objects[i].name)
        // for (let b = 0; i<bullets.length;i++){
        // }
    // }

    Draw();
    drawScore();
    drawStreak();
}

function startExplosion(obj) {
    const explosionImages = gifOptions.src.map(src => {
        const img = new Image();
        img.src = src;
        return img;
    });
    let frame = 0;
    const explosionInterval = setInterval(() => {
        if (frame < explosionImages.length) {
            ctx.clearRect(obj.x, obj.y, 200, 200);
            ctx.drawImage(explosionImages[frame], obj.x, obj.y, 200, 200);
            frame ++;
        } else {
            clearInterval(explosionInterval);
        }
    }, 50);
}

function keyDownListener(event) {
    player.keyShoot = false;
    switch (event.code){
        case "KeyA":
            player.keyPresses[event.code] = true;
            break;
        case "KeyD":
            player.keyPresses[event.code] = true;
            break;
        case "KeyW":
            player.keyPresses[event.code] = true;
            break;
        case "KeyS":
            player.keyPresses[event.code] = true;
            break;
        case "Space":
            player.keyShoot = true;
            break;
    }
}

function keyUpListener(event){
    switch (event.code){
        case "KeyA":
            player.keyPresses[event.code] = false;
            break;
        case "KeyD":
            player.keyPresses[event.code] = false;
            break;
        case "KeyW":
            player.keyPresses[event.code] = false;
            break;
        case "KeyS":
            player.keyPresses[event.code] = false;
            break;
        case "Space":
            player.keyShoot = false;
            break;
    }
    
}

function Resize()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function Draw() //Работа с графикой
{
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Очистка холста от предыдущего кадра
	
	roads.forEach(road => {
        ctx.drawImage
        (
            road.image, //Изображение для отрисовки
            0, //Начальное положение по оси X на изображении
            0, //Начальное положение по оси Y на изображении
            road.image.width, //Ширина изображения
            road.image.height, //Высота изображения
            road.x, //Положение по оси X на холсте
            road.y, //Положение по оси Y на холсте
            canvas.width, //Ширина изображения на холсте
            window.innerHeight //высота
        );
    });
	
	DrawCar(player);
	objects.forEach(obj => {DrawCar(obj)}); // отрисовка всех обьектов 
    bullets.forEach(obj => {DrawCar(obj)}); // отрисовка всех пуль 
}

function DrawCar(car) {  // отрисовка автомобиля
	ctx.drawImage
	(
		car.image, 
		0, 
		0, 
		car.image.width, 
		car.image.height, 
		car.x, 
		car.y, 
		car.image.width * car.scale, 
		car.image.height * car.scale 
	);
}

function RandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

function drawScore() {
    ctx.font = "36px Keleti";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Спасенно: " + score, 8, 40);
}

function drawStreak() {
    ctx.font = "36px Keleti";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Сбито: " + streak, 8, 80);
}

function shop(objs){
    objects = []
    objects.push(new CaptureZone(0,0,"images/exp8","capture"));
    pause = true;
    
}

function Draw0() //Кнопка старт
{
	//Draw();
	
	let start = new Image();
    start.src = "images/start.png";
    start.onload = function() {
        ctx.drawImage(start, canvas.width*0.2, canvas.height*0.2,canvas.width*0.6,canvas.height*0.6);
	}
}


window.onload = Draw0; 


// значит так сделать так чтоб когда кнопка нажат можно 2 было нажать  YES
// пулька должна быть одна , быть с норм размером  YES

// счёт растёт  YES
// кол-ва спасёных экипажей растёт  YES
// вывод счёт куда-то  YES
// вывод кол-ва спасёных экипажей YES

// когда пулька попадает чел исчезает YES с анимацеией взрыва  YES
// анимация есть , но на мобе а не на игроке YES

// что то сделать чтоб небыло взрыва в воздухе YES
// анимация многоразовая YES пофиксить баг с set_interval YES

// сделать остновки  NO
// мб сделать магазинчик NO
// // таблица рекордов со сременем жизни NO
// добавить звуки YES
// меню NO 
// после смерти менюшка YES