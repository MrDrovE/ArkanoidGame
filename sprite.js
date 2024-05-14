 
 class Sprite 
{
  constructor (sp_options, img)
  {
    this.dead = false;
    this.SCALE = sp_options.scale;  //коэффициент увеличения
    this.WIDTH = sp_options.width;   // ширина кадра
    this.HEIGHT = sp_options.height;  //высота кадра
    this.SCALED_WIDTH = sp_options.scale * sp_options.width; // ширина увеличенного кадра (для отрисовки)
    this.SCALED_HEIGHT = sp_options.scale * sp_options.height;  //высота увеличенного кадра 
    this.C_LOOP = sp_options.c_loop;  // порядок отрисовки кадров
    this.FACING_DOWN = sp_options.facing_down;  // номер строки кадров при движении вниз
    this.FACING_UP = sp_options.facing_up;      // номер строки кадров при движении вверх
    this.FACING_LEFT = sp_options.facing_left;   // номер строки кадров при движении влево
    this.FACING_RIGHT = sp_options.facing_right;   // номер строки кадров при движении вправо
    this.FRAME_LIMIT = sp_options.frame_limit;     // общее количество кадров
    this.MOVEMENT_SPEED = sp_options.movement_speed;  //скорость 
    this.currentDirection = sp_options.facing_down;
    this.currentLoopIndex = 0;
    this.frameCount = 0;
    this.sx = sp_options.sx;
    this.sy = sp_options.sy;
    this.img = new Image();
    this.img.src = img;
  }
    
  Update(){
    this.sy += speed/5;
    if(this.sy > canvas.height + 50)
      {
        this.dead = true;
      }
  }
    
  drawFrame(){
    ctx.drawImage(this.img,
                  this.C_LOOP[this.currentLoopIndex] * this.WIDTH, 
                  this.currentDirection * this.HEIGHT, 
                  this.WIDTH, 
                  this.HEIGHT,
                  this.sx, 
                  this.sy, 
                  this.SCALED_WIDTH, 
                  this.SCALED_HEIGHT);
  }

  moveit(dx, dy, direction) {
    if (this.sx + dx > 0 && this.sx + this.SCALED_WIDTH + dx < canvas.width) {
      this.sx += dx;
    }
    if (this.sy + dy > 0 && this.sy + this.SCALED_HEIGHT + dy < canvas.height) {
      this.sy += dy;
    }
      
    this.currentDirection = direction;
    
  }
    
  moveLoop() {
    let hasMoved = false;
  
    this.moveit(this.MOVEMENT_SPEED, 0, this.FACING_RIGHT);
  
    this.frameCount++;
    if (this.frameCount >= this.FRAME_LIMIT) {
      this.frameCount = 0;
      this.currentLoopIndex++;
      if (this.currentLoopIndex >= this.C_LOOP.length) {
        this.currentLoopIndex = 0;
      }
    }
  }

}  //sprite

let rovers=[];

let sp_options = {
  scale: 2,
  width: 16,
  height: 18,
  c_loop: [0, 1, 0, 2], 
  facing_down: 0,
  facing_up: 1,
  facing_left: 2,
  facing_right: 3,
  frame_limit: RandomInteger(3, 12),
  movement_speed: RandomInteger(1, 5),
  sx: 10,
  sy: RandomInteger(0, canvas.height/4)

};
	
rovers.push(new Sprite(sp_options,'images/gc.png'));
 
 