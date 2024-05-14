//  обработка столкновений (взрыв на той же канве)
class Car
{
    constructor(image, x, y,name,speed,scale){
		this.dead = false;
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = image;
        this.name = name
        this.speed = speed
        this.scle = scale
    }
 
    Update(){
        this.y += this.speed;
		
		if(this.y > canvas.height + 50)
		{
			this.dead = true;
		}
		
    }

    Move(v, d) 
    {
        if(v == "x") //Перемещение по оси X
        {
            this.x += d; //Смещение
 
            //Если при смещении объект выходит за края холста, то изменения откатываются
            if(this.x + this.image.width * scale > canvas.width)
            {
                this.x -= d; 
            }
    
            if(this.x < 0)
            {
                this.x = 0;
            }
        }
        else //Перемещение по оси Y
        {
            this.y += d;
 
            if(this.y + this.image.height * scale > canvas.height)
            {
                this.y -= d;
            }
 
            if(this.y < 0)
            {
                this.y = 0;
            }
        }
        
    }

    Collide(car){
        var hit = false;
        var obj; // по кому попала
        try{
            if(this.y < car.y + car.image.height * scale && this.y + this.image.height * scale > car.y) //Если объекты находятся на одной линии по горизонтали
            {
                if(this.x < car.x + car.image.width * scale && this.x + this.image.width * scale > car.x ) //Если объекты находятся на одной линии по вертикали
                {
                    hit = true
                    obj = car.name
                }
            }
        return {"hit":hit,"obj":obj};
        } catch(e){
            console.log(car)
            console.log(objects)
            console.log(e)
        }
    }
}

class Bulet extends Car{
    constructor(image, x, y,name,speed,borntime,scale){
		super()
        this.dead = false;
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = image;
        this.name = name
        this.speed = speed
        this.borntime = borntime
        this.scale = scale
    }

}

class Enemy extends Car{
    constructor(image, x, y,name,speed,scale){
        super()
		this.dead = false;
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = image;
        this.name = name
        this.speed = speed
        this.scale = scale
    }
}

class Civilian extends Car{
    constructor(image, x, y,name,speed,scale ){
        super()
        this.dead = false;
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = image;
        this.name = name
        this.speed = speed
        this.scale = scale
    }
}

class Player extends Car{
    constructor(image, x, y,name,speed,scale){
        super()
		this.dead = false;
		this.keyPresses = {};
        this.keyShoot = true;
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = image;
        this.name = name
        this.speed = speed
        this.scale = scale
    }

    moveLoop() {  
        if (this.keyPresses.KeyA) {
            this.moveCharacter(-this.speed, 0);
            
        } else if (this.keyPresses.KeyD) {
            this.moveCharacter(this.speed, 0);
        }

        if (this.keyPresses.KeyW) {
            this.moveCharacter(0, -this.speed);
            
        } else if (this.keyPresses.KeyS) {
            this.moveCharacter(0, this.speed);
        }
        if (this.keyShoot){
            this.Shoot()
        }

    }// moveLoop

    moveCharacter(deltaX, deltaY) {
        if (this.x + deltaX > 0 && this.x + this.image.width*scale + deltaX < canvas.width) {
            this.x += deltaX;
        }
        if (this.y + deltaY > 0 && this.y + this.image.height*scale + deltaY < canvas.height) {
            this.y += deltaY;
        }
    }

    Shoot(){
        if (time - lastshoot < 30){
            return 
        } 
        lastshoot = time
        bullets.push(new Bulet("images/shoot.png", this.x + 17, this.y-55, "bullet",speed-10,time,2.65))
    }
    
}

class Road
{
    constructor(image, y) {
        this.x = 0;
        this.y = y;
        
        this.image = new Image();
        
        this.image.src = image;
    }
 
    Update(road) {
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
// добавить
let gifOptions = {
    src: ["images/1_1.png", 
        "images/1_2.png",
        "images/1_3.png", 
        "images/1_4.png",
        "images/1_5.png", 
        "images/1_6.png",
        "images/1_7.png", 
        "images/1_8.png",
        "images/1_7.png", 
        "images/1_6.png",
        "images/1_5.png",
        "images/1_4.png",
        "images/1_3.png",
        "images/1_2.png",
        "images/1_1.png"
    ],
    frames: 16,
    numFrame: 0,
};

let time_bum = [];

const canvas = document.getElementById("canvas"); 
//Получение холста из DOM
const ctx = canvas.getContext("2d"); 

const scale = 0.7; //Масштаб машин
const speed = 5; //скорость игорька
let streak = 0.0 // количество убийств
let score = 0.0; // количество спасённых человек
let lastshoot = 0; // время последнего выстрела 
let time = 0; // время игры 
Resize(); // При загрузке страницы задаётся размер холста

window.addEventListener("resize", Resize); //При изменении размеров окна будут меняться размеры холста
window.addEventListener('keydown', keyDownListener);
window.addEventListener('keyup',keyUpListener);
window.addEventListener("click", Start); //Получение нажатий с клавиатуры 

let objects = []; //Массив игровых объектов
let bullets = []; // Массив с пулями


let roads = [

    new  Road("images/road.png", 0),
    new  Road("images/road.png", canvas.height)

]; 
 
//Объект, которым управляет игрок
let player = new  Player("images/player.png", canvas.width / 2, canvas.height / 2, "player",speed ,scale);

function Start() {
	window.removeEventListener("click", Start); //удаление нажатий с клавиатуры 
    timer = setInterval(Update, 1000 / 60); //Состояние игры будет обновляться 60 раз в секунду — при такой частоте обновление происходящего будет казаться очень плавным
}

function Stop() {
	window.removeEventListener("click", Start); //удаление нажатий с клавиатуры 
	window.removeEventListener("keydown", function (e) { KeyDown(e); }, false);
    objects = []
    clearInterval(timer); //Остановка обновления
}

 
function Update() {
	time += 1
	roads[0].Update(roads[1]);
    roads[1].Update(roads[0]);
	
	player.moveLoop();
	if(RandomInteger(0, 10000) > 9800) { //создание новых кораблей
		objects.push(new  Enemy("images/enemy.png", RandomInteger(30, canvas.width - 50), RandomInteger(250, 400) * -1, "enemy",speed+1.5+RandomInteger(0.1,0.4),scale));
	}
	
    if(RandomInteger(0, 10000) > 9990) { //создание новых кораблей
		objects.push(new  Civilian("images/civilian.png", RandomInteger(30, canvas.width - 50), RandomInteger(250, 400) * -1,"civilian",speed+0.5,scale));
	}

	for(var i = 0; i < objects.length; i++){
		objects[i].Update();
	}
    for(var i = 0; i < bullets.length; i++){
		bullets[i].Update();
	}


	objects = objects.filter(function (n) {
      return !n.dead
    })

    bullets = bullets.filter(function (n) {
        return !n.dead
      })
	
    objects.forEach(obj => {
        ans = player.Collide(obj);
        if (ans["hit"]) {
            if (ans["obj"] == "enemy"){
                Stop();
                time_bum.push(setInterval(bum, 50));
                player.dead = true;
            } else { 
                score += 1;
                obj.dead = true;
            }
        }
        
        bullets.forEach(bullet => {
            if (time - bullet.borntime > 180 ){
                bullet.dead = true
            }
            ans = bullet.Collide(obj);
            if (ans["hit"]) {
                if (ans["obj"]=="enemy"){
                    time_bum.push(setInterval(bum, 50,obj));
                    streak += 1;
                } else{
                    alert("Не стреляй по гражданским");
                }
                obj.dead = true;
                bullet.dead = true;
            }
        })
    })
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

function bum(obj) {
	if (gifOptions.numFrame<gifOptions.src.length) {
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		Draw();
		let img=new Image();
		img.src = gifOptions.src[gifOptions.numFrame];
		img.onload = function() {
            ctx.drawImage(img, obj.x-img.width/2, obj.y-img.height/2);
            gifOptions.numFrame++;
		}
		
	} else {
        clearInterval(time_bum[0]);
        time_bum.reverse().pop();
        time_bum.reverse();
        gifOptions.numFrame = 0; 
    }
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
	
	for(var i = 0; i < roads.length; i++)
    {
        ctx.drawImage
        (
            roads[i].image, //Изображение для отрисовки
            0, //Начальное положение по оси X на изображении
            0, //Начальное положение по оси Y на изображении
            roads[i].image.width, //Ширина изображения
            roads[i].image.height, //Высота изображения
            roads[i].x, //Положение по оси X на холсте
            roads[i].y, //Положение по оси Y на холсте
            canvas.width, //Ширина изображения на холсте
            window.innerHeight //высота
        );
    }
	
	DrawCar(player);
	
	objects.forEach(obj => {DrawCar(obj)}); // отрисовка всех обьектов 
    bullets.forEach(obj => {DrawCar(obj)}); // отрисовка всех пуль 
}

function DrawCar(car) {  // отрисовка автомобиля
	let dscale = car.scale // динамический scale
	ctx.drawImage
	(
		car.image, 
		0, 
		0, 
		car.image.width, 
		car.image.height, 
		car.x, 
		car.y, 
		car.image.width * dscale, 
		car.image.height * dscale 
	);
}

function RandomInteger(min, max) 
{
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

function drawScore() {
    ctx.font = "36px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Спасенно: " + score, 8, 40);
}

function drawStreak() {
    ctx.font = "36px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Сбито: " + streak, 8, 80);
}
function Draw0() //Кнопка старт
{
	Draw();
	
	let start = new Image();
    start.src = "images/start.png";
    start.onload = function() {
        ctx.drawImage(start, canvas.width/3, canvas.height/5);
        drawScore()
        drawStreak()
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
// добавить звуки NO
// меню NO 
// после смерти менюшка NO 