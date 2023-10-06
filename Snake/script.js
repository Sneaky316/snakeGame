
const scoreElement = document.querySelector(".score") // Запись поинтов игрока 
const highScoreElement = document.querySelector(".high-score")
let highScore = localStorage.getItem('High Score')
let score = 0;
highScoreElement.innerText = `High-Score: ${localStorage.getItem('High Score')}`



class Field{ 
    #containers = document.querySelectorAll('.container-field_paths') // ищем все контейнеры

    fieldMarking(){
        this.#containers.forEach((container,containerIndex) => { 
            const points = container.querySelectorAll('.field_point ') // в каждом контейнере ищем дочерний элемент
            container.setAttribute('crdntY','' + containerIndex) // получаем координату по высоте
            
            points.forEach((point,pointIndex) => {
                point.setAttribute('crdntX','' + pointIndex) // присваиваем координату по длине
                point.setAttribute('crdntY',`${container.getAttribute('crdntY')}`) // присваиваем координату по высоте
            })
        })

    }
}
const f = new Field // Разметка поля
f.fieldMarking()

class Food{
    
    #foodX = 0
    #foodY = 0
    #food = document.querySelector(`[crdntX="${this.#foodX}"][crdntY="${this.#foodY}"]`) //координата еды

     changeFoodPosition(){ //смена позиции еды
        this.#food.classList.remove('food')
        this.#foodX = Math.round(Math.random()*9)
        this.#foodY = Math.round(Math.random()*9)
        this.eats = {valueX: this.#foodX, valueY: this.#foodY} // вызов сеттера смены еды 
        if (this.foodMap.classList.contains('tale' || 'head')) {this.changeFoodPosition()} // проверкка позиции еды, чтобы она не попадала на змейку       
        this.#food.classList.add('food')
    }
    foodScore(){ // при косании пищи + поинт
        score++
        scoreElement.innerText = `Score: ${score}`
        highScoreElement.innerText = `High-Score: ${localStorage.getItem('High Score')}`
    } 
        
  
    set eats({valueX,valueY}) {
        return this.#food = document.querySelector(`[crdntX="${valueX}"][crdntY="${valueY}"]`) // сеттер смены еды 
    }
    get foodMap(){
        return this.#food
    }
    
}


class Head extends Food{

    constructor(x,y){
        super()
        this.positionX = x
        this.positionY = y
        this._headPosition = document.querySelector(`[crdntX="${this.positionX}"][crdntY="${this.positionY}"]`)
        this._bodyPosition = null
        this.interval = null // интервал функции
        this.direction = null
        this.body=[] // будущий массив для хвостов
        

    }

    Move(){
        this.interval = "STARTED" // интервал функции
        if (this.bodyPosition !== null) this.bodyPosition.classList.remove('tale') // Проверка движения и чистка лишнего хвоста
        if (this.foodMap.classList.contains('tale' || 'head')) {this.changeFoodPosition()} // проверкка позиции еды, чтобы она не попадала на змейку       
        
        this.headPosition.classList.remove('head')       
        this.body[0]={valueX: this.positionX, valueY: this.positionY}
        this.body.forEach((position)=>{       
            if(this.eatsItem == position) this.changeFoodPosition()
            this.bodyPosition = position
            this.bodyPosition.classList.add('tale')
        })
                         
        switch (this.direction) {
            case "up":
                this.positionY -= 1
                this.newPositionY = this.positionY                                             
                break;
            case "down":
                this.positionY += 1 
                this.newPositionY = this.positionY                     
                break;
            case "left":
                this.positionX -= 1
                this.newPositionX = this.positionX                                         
                break;
            case "right":
                this.positionX += 1
                this.newPositionX = this.positionX                                          
                break;
        }   
        this.headPosition = {valueX: this.positionX, valueY: this.positionY}
        
        
        if (this._headPosition == this.foodMap) {
            this.changeFoodPosition()
            this.body.push({valueX: this.positionX, valueY: this.positionY}) 
            this.foodScore()               
        }
        if (this.headPosition.classList.contains('tale')){ // конец игры
            clearInterval(snakeIntervalId)
            alert('Игра окончена...Чтобы начать снова нажмите "OK!"')
            if (highScore <= score) {
                localStorage.setItem('High Score', `${score}`)
            }
            location.reload();
            this.interval = null
        }
        for ( let i =  this.body.length - 1; i > 0; i--){
            // Сдвигаем вперед знрачения элементов на 1, что бы они получали позицию друг друга
            this.body[i] = this.body[i - 1];
        }
        this.headPosition.classList.add('head')
        
        
        
    }
    
    set newPositionX(value){
        if (value > 9){
            this.positionX = 0;
        } else if (value < 0){
            this.positionX = 9
        } else{
            this.positionX = value
        }
    }
    
    set newPositionY(value){
        if (value > 9){
            this.positionY = 0;
        } else if (value < 0){
            this.positionY = 9
        } else{
            this.positionY = value
        }
    }

    get headPosition(){
        return this._headPosition
    }

    set headPosition({valueX,valueY}){
        return this._headPosition = document.querySelector(`[crdntX="${valueX}"][crdntY="${valueY}"]`)
    }

    get bodyPosition(){
        return this._bodyPosition
    }

    set bodyPosition({valueX,valueY}){
        return this._bodyPosition = document.querySelector(`[crdntX="${valueX}"][crdntY="${valueY}"]`)
    }
    

 
}


const snakeHead = new Head (5,5)
snakeHead.changeFoodPosition()

snakeHead.headPosition.setAttribute('position','tale')
const initGame = () => snakeHead.Move()
       document.addEventListener('keydown', (event) => {
            const key = event.key;
            if (key === "ArrowUp" && snakeHead.direction !== "down") {
                snakeHead.direction = "up";
            } else if (key === "ArrowDown" && snakeHead.direction !== "up") {
                snakeHead.direction = "down";
            } else if (key === "ArrowLeft" && snakeHead.direction !== "right") {
                snakeHead.direction = "left";
            } else if (key === "ArrowRight" && snakeHead.direction !== "left") {
                snakeHead.direction = "right";
            }
            if ( key === " " && snakeHead.interval == null) { //  пауза
                snakeIntervalId = setInterval(initGame, 500)
                snakeHead.direction = "up";
            }
            if (key === "Enter" && snakeHead.interval !== null){
                clearInterval(snakeIntervalId)
                snakeHead.interval = null
            }
            
                                 
        });
 


