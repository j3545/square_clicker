let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let volume = document.querySelector("#volume-control");

let balloons = [];
let balloon_max = 3;

let particles = [];

let mouse = {
    x:0,
    y:0
}


let music = new Audio("music.mp3")



let player_score = 0;



//declare time variables
let last = new Date().getTime();
let dt = 1000/60;

let now,passed;
let accumulator = 0;



let BALLOON_SIZE = 100;
let START_POS_Y = -300;

//colors
let color_palette = [
    ["f9ed69", "f08a5d", "b83b5e", "6a2c70"],
    ["f38181", "fce38a", "eaffd0", "95e1d3"],
    ["e3fdfd", "cbf1f5", "a6e3e9", "71c9ce"],
    ["a8d8ea", "aa96da", "fcbad3", "ffffd2"],
    ["e23e57", "88304e", "522546", "311d3f"],
    ["f67280", "c06c84", "6c5b7b", "355c7d"],
    ["3ec1d3","f6f7d7", "ff9a00", "ff165d"]
]

let selected_palette;
let selected_palette_index = 0;

function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function render(){
    
    

    //draw player score
    ctx.font = "20px Verdana";
    ctx.fillStyle="black"
    ctx.fillText("Score: " + player_score, 50, 50);    
    // ctx.fillStyle="black"
    ctx.fillText("Palette: " + selected_palette_index, 50, 80);
    //mini palette
    let i = 0;
    color_palette[selected_palette_index].forEach(element => {
        ctx.beginPath();
        ctx.fillStyle = "#"+ element;
        ctx.rect(20*i + 50,90,20,20);
        ctx.fill(); 
        ctx.strokeStyle="#000"
        ctx.lineWidth = 1; 
        ctx.stroke();
        i++;
    });
    

    balloons.forEach(balloon => {
        ctx.beginPath();
        ctx.fillStyle = balloon.color;
        ctx.rect(balloon.x,balloon.y,balloon.size,balloon.size);
        ctx.fill(); 
        ctx.strokeStyle="#000"
        ctx.lineWidth = 2; 
        ctx.stroke();
    });

    
    particles.forEach(particle => {
        ctx.beginPath();
        ctx.fillStyle = particle.color;
        ctx.rect(particle.x,particle.y,particle.size,particle.size);
        
        ctx.fill(); 
        ctx.strokeStyle="#000"
        ctx.lineWidth = 1; 
        ctx.stroke();
    });
}

function update(dt){
    balloons.forEach(balloon => {
        balloon.y += balloon.dy * dt;
        if(balloon.y > canvas.height){
            balloons.splice(balloons.indexOf(balloon), 1)
            
        }
    });

    particles.forEach(particle => {
        particle.y += particle.dy * dt;
        particle.x += particle.dx * dt;
        particle.size-=1;
        if(particle.size < 3){
            particles.splice(particles.indexOf(particle), 1)
        }
    });
}

function checkCollision(){
    
    balloons.forEach(balloon => {
        if(mouse.x > balloon.x &&
            mouse.x < balloon.x + balloon.size &&
            mouse.y > balloon.y &&
            mouse.y < balloon.y + balloon.size){
                explosion(balloon.x, balloon.y, balloon.color)
                balloons.splice(balloons.indexOf(balloon), 1)
        }
    });
}

function explosion(mouseX, mouseY, color){  
    let audio = new Audio("pop.ogg");
    player_score++;
    audio.play()
    if(player_score  % 10 == 0){
            console.log('change palette');
            if(selected_palette_index == color_palette.length){
                selected_palette_index = 0;
            }else{
                selected_palette_index++;
            }
        
    }
    if(player_score % 25 == 0){
        celebrate();
    }
    let x,y,dx,dy;
    x = mouseX;
    y = mouseY;
    for(let i = 0; i < 15; i++){
        dx = (Math.random() < 0.5 ? -1 : 1) * Math.random() * 0.5;
        dy = (Math.random() < 0.5 ? -1 : 1) * Math.random() * 0.5;
        particles.push(new Particle(x, y, dx, dy, color));
        
        
    }
}

function celebrate(){

}

function start(){

    selected_palette = color_palette[Math.floor(Math.random() * color_palette.length)];
    selected_palette_index = Math.floor(Math.random() * color_palette.length)
    setInterval(function(){
        let x = Math.random() * (canvas.width - BALLOON_SIZE * 2) + BALLOON_SIZE;
        let y = START_POS_Y;
        let type = "normal"
        let dx = 0;
        let dy = Math.random() * (0.15 - 0.09) + 0.09;
        
        
        let tmp = color_palette[selected_palette_index];
        let random_color = tmp[Math.floor(Math.random() * tmp.length)];
                
        let color = "#"+random_color;

        //increment
        //random color red green or blue is incremented by a positive or negative each new interval
        
        
        let balloon = new Balloon(x,y,BALLOON_SIZE,dx,dy,color);
        
        balloons.push(balloon);
    }, 1100)
    resize();
    animate();
}



function animate(){


    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "rgba(100,100,100,0.1)"
    ctx.fillRect(0,0,canvas.width,canvas.height);

    
    
    //update dt
    now = new Date().getTime();
    passed = now - last;
    last = now;
    accumulator += passed;
    while(accumulator >= dt){
        update(dt)
        accumulator -= dt;
    }
    render();


        
    requestAnimationFrame(animate);
}    

start();

window.addEventListener('resize', function(e){
    resize();
})

document.addEventListener('mousedown', function(e){
    mouse.x = e.x;
    mouse.y = e.y;

    checkCollision();
})

volume.addEventListener("change", function(e) {
    music.volume = e.currentTarget.value / 100;
})