/* global scope */ 
/*
    Project Name     : To-Do List
    Author           : Xenon
    Idea             : Elzero Web School 
*/


/********************************************************************************
                         Stack Implementation
*********************************************************************************/
class Node{
    constructor(val){
        this.val = val;
        this.next = null;
    }
}


class Stack{
    constructor(){
        this.first = null;
        this.last = null;
        this.size = 0;
    }

    // pushing a new value
    push(val){
        // create a new Node
        var newNode = new Node(val);

        // if the stack is empty
        if(this.size === 0){
            this.first = newNode;
            this.last = newNode;  //try to make it equal to this.first
        }
        // if the stack is not empty
        else{
            var temp = this.first;
            this.first = newNode;
            this.first.next = temp;
        }
        // increment the size and return it 
        return ++this.size;
    }

    // poping a value
    pop(){
        // in case of empty stack
        if(this.size === 0) return null;

        // in case of a stack of size 1
        else if(this.size === 1){
            var temp = this.first;
            this.first = null;
            this.last = null;
        }

        // in case of a stack of size bigger than 1
        else{
            var temp = this.first;
            this.first = this.first.next;
        }

        // decrement the size and return the poped value
        this.size--;
        return temp;
    }
}


var stack = new Stack();


/********************************************************************************
                         SELECT THE REQUIRED ELEMENTS
*********************************************************************************/

// select the input field
var input = document.querySelector('.todo-container .add-task #input');
 
// select the plus sign
var plus = document.querySelector('.todo-container .add-task #plus');
 
// select the tasks container
var tasksContainer = document.querySelector('.tasks-container');

// select no-tasks-to-show Element
var noTasks = document.querySelector('.tasks-container #no-tasks-message');

// select the tasks counter
var tasksCounter = document.querySelector('.tasks-status .tasks-count span');

// select the completed tasks
var tasksCompleted = document.querySelector('.tasks-status .tasks-completed span');

// select the scratch sound
var scratch = document.querySelector('#scratch');

// select the undo button
var undo = document.querySelector('.control-panel #undo');

// select the finish all button
var finishAll = document.querySelector('.control-panel #finish-all');

// select the remove all button
var removeAll = document.querySelector('.control-panel #remove-all');

// select the finish all button
var unFinishAll = document.querySelector('.control-panel #un-finish-all');



/********************************************************************************
                         CREATE THE NEEDED VARIABLES
*********************************************************************************/


// tasks counter varialble
var tasksNum = 0;


// tasks completed varialble
var completedTasksNum = 0;


// focus on the input after the page loads
window.onload = () =>{
    'use strict';

    swal('Welcome to To-Do List V1.0', "Enter a task in the input field, then click on the plus sign to add it", 'success');

    // input.focus();
}


// on focus, empty the placeholder of the input
input.onfocus = () =>{
    'use strict';
    input.placeholder = '';
}


// on blur, fill the placeholder of the input
input.onblur = () =>{
    'use strict';
    input.placeholder = 'Enter a task';
}


/********************************************************************************
                         ADDING AND REMOVING TASKS
*********************************************************************************/

// make a var that detects if plus has been clicked at least one
var plusIntro = true;


//adding a new task
plus.addEventListener('click', add) 

function add(){
    'use strict';

    // boolean variable indicating if the value is new or not
    var old = false;

    // select the tasks container
    var taskboxes = document.querySelectorAll('.tasks-container .task-box');

    for(let element of taskboxes){
        let text = element.textContent;
        text = (text.replace('Delete', '')).toLowerCase();
        
        // checking that the input is unique
        if(input.value.toLowerCase() === text) old = true;
    }

    // alert if the value is alredy added
    if(old) swal('This task is alredy added', 'Please Enter a new task.', 'warning');

    // in case of an empty task
    else if(input.value === ''){
        // using the library sweet alert to alert in case of emptiness 
        swal("This field can't be empty.", "Please enter a task.", 'error');
        // swal({
        //     title: "Good job!",
        //     text: "You clicked the button!",
        //     icon: "success",
        //   });
    }

    // if the entery is not empty
    else{

        // teach how to finish a task
        if(plusIntro) swal('click on a task to mark it as completed', 'click again to make it uncompleted', 'info');
        plusIntro = false;

        // hide the no-tasks span
        noTasks.style.display = 'none';

        // make a new span
        let newSpan = document.createElement('span');

        // add the task-box class
        newSpan.className = 'task-box';

        // create a text span
        let textSpan = document.createElement('span')

        // add the text class
        textSpan.className = 'text';

        // create a text node 
        let textNode = document.createTextNode(`${input.value}`);

        // append the text to the text span
        textSpan.appendChild(textNode);

        // append the text node to the span
        newSpan.appendChild(textSpan);

        // create a span with a delete class
        let deleteSpan = document.createElement('span');

        // add the delete class
        deleteSpan.className = 'delete';

        // make the innerHTML text = Delete
        deleteSpan.innerHTML = 'Delete';


        // make the deleteSpan function
        deleteSpan.addEventListener('click', (e) => {
            'use strict';

            // add the deleted element to the stack
            stack.push(e.target.parentNode);

            e.target.parentNode.remove();

            // decrement the number of tasks assign the value of it to the tasks counter
            tasksCounter.innerHTML = --tasksNum;

            // show the no-tasks span in the absence of tasks 
            if(tasksNum === 0) noTasks.style.display = 'block';

            // to decrement the completed tasks variable 
            completedTaskCount();

        });

        // append the delete span to the task-box
        newSpan.appendChild(deleteSpan);

        // append the newSpan to the tasksContainer
        tasksContainer.appendChild(newSpan);

        // increment the tasksNum and assign the value of it to the tasks counter
        tasksCounter.innerHTML = ++tasksNum;

        // void the input field
        input.value = '';

        // focus on the input after the adding a new task
        // input.focus();
    }
}


// finished tasks
window.addEventListener('click', (e) =>{
    if(e.target.classList.contains('text')){
        e.target.classList.toggle('finished');
        scratch.play();
        completedTaskCount();
    }
});


// completed tasks counter
var completedTasks = 0;

// completed tasks counter
function completedTaskCount(){
    'use strict';
    completedTasks = document.querySelectorAll('.finished').length; 
    tasksCompleted.innerHTML = completedTasks;
}






/********************************************************************************
                         THE FIRST THREE BUTTONS
*********************************************************************************/





// undo the last change
undo.addEventListener('click',() =>{
    'use strict';

    // create an element to hold the stack's value
    let poped = stack.pop();

    if(poped === null) swal('There are no deleted tasks.', '', 'error')
    else{

        // hide the no-tasks span
        noTasks.style.display = 'none';

        // append the append the element to the tasksContainer
        tasksContainer.appendChild(poped.val);

        // increment the tasksNum and assign the value of it to the tasks counter
        tasksCounter.innerHTML = ++tasksNum;

        // check the number of completed tasks
        completedTaskCount();
    }

});


// remove all tasks
removeAll.addEventListener('click',() =>{
    'use strict';

    // select the tasks container
    var taskboxes = document.querySelectorAll('.tasks-container .task-box');

    for(let element of taskboxes){
        stack.push(element);
        element.remove();

        // increment the tasksNum and assign the value of it to the tasks counter
        tasksCounter.innerHTML = --tasksNum;

        // show the no-tasks span in the absence of tasks 
        if(tasksNum === 0) noTasks.style.display = 'block';

        // check the number of completed tasks
        completedTaskCount();

    }

});



// finish all tasks
finishAll.addEventListener('click',() =>{
    'use strict';

    // select the tasks container
    var taskboxes = document.querySelectorAll('.tasks-container .task-box');

    for(let element of taskboxes){
        
        // check if the task is finished or not
        let isFinished = element.querySelector('.text').classList.contains('finished');
        
        // if the task is not finished toggle the finished class
        if(!isFinished){
            element.querySelector('.text').classList.toggle('finished');
            scratch.play();
        }

        // check the number of completed tasks
        completedTaskCount();

    }

});



// unfinish all tasks
unFinishAll.addEventListener('click',() =>{
    'use strict';

    // select the tasks container
    var taskboxes = document.querySelectorAll('.tasks-container .task-box');

    for(let element of taskboxes){
        
        // check if the task is finished or not
        let isFinished = element.querySelector('.text').classList.contains('finished');
        
        // if the task is not finished toggle the finished class
        if(isFinished){
            element.querySelector('.text').classList.toggle('finished');
            scratch.play();
        }

        // check the number of completed tasks
        completedTaskCount();

    }

});



// making a task by hitting input
input.onkeydown = (e) =>{
    'use strict';
    // kep the pressed key in a variable
    let key = e.key;

    if(key === "Enter") add();

};