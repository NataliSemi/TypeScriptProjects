interface Todo {
    text: string;
    completed: boolean;
  }
  
  class TodoList {
    private todos: Todo[] = [];
    private filter: 'all' | 'completed' | 'incomplete' = 'all';
  
    constructor() {
      this.render();
    }
  
    private addTodo(text: string) {
      const todo: Todo = {
        text,
        completed: false
      };
      this.todos.push(todo);
      this.render();
    }
  
    private completeTodo(index: number) {
      this.todos[index].completed = true;
      this.render();
    }
    
    private deleteTodo(index: number) {
        this.todos.splice(index, 1);
        this.render();
      }

    private editTodoText(index: number, newText: string) {
        this.todos[index].text = newText;
        this.render();
      }

      private filterTodos() {
        let filteredTodos: Todo[] = [];
    
        if (this.filter === 'completed') {
          filteredTodos = this.todos.filter(todo => todo.completed);
          console.log('completed', filteredTodos)
        } else if (this.filter === 'incomplete') {
          filteredTodos = this.todos.filter(todo => !todo.completed);
          console.log('no completed', filteredTodos)
        } else {
          filteredTodos = this.todos;
        }
    
        this.render(filteredTodos);
      }
    
      public setFilter(filter: 'all' | 'completed' | 'incomplete') {
        this.filter = filter;
        this.filterTodos();
      }

      private reorderTodos(event: DragEvent) {
        event.preventDefault();
        const fromIndex = Number(event.dataTransfer!.getData("text/plain"));
        const toIndex = Number((event.target as HTMLElement).getAttribute("data-index"));
      
        const elementToMove = this.todos[fromIndex];
        this.todos.splice(fromIndex, 1);
        this.todos.splice(toIndex, 0, elementToMove);
      
        this.render();
      }

      private render(todos?: Todo[]) {
        const todoList = document.getElementById("todo-list");
        if (todoList) {
          todoList.innerHTML = "";
          this.renderTodoList(todoList, todos);
          this.renderAddTodoForm(todoList);
          this.renderFilterButtons(todoList);
        }
      }
      
      private renderTodoList(todoList: HTMLElement, todos?: Todo[]) {
        const todosToRender = todos || this.todos;
        todosToRender.forEach((todo, index) => {
          const container = document.createElement("div");
          container.classList.add("todo-item-container");
          const li = document.createElement("li");
          li.innerText = todo.text;
          li.setAttribute("draggable", "true");
          li.setAttribute("data-index", index.toString());
          li.addEventListener("dragstart", (event) => {
            event.dataTransfer!.setData("text/plain", index.toString());
          });
          li.addEventListener("dragover", (event) => {
            event.preventDefault();
          });
          li.addEventListener("drop", this.reorderTodos.bind(this));

          if (todo.completed) {
            li.classList.add("completed");
          } else {
            li.classList.add("incomplete");
          }
      
          const completeButton = document.createElement("button");
          completeButton.innerText = "Complete";
          if (todo.completed) {
            completeButton.style.display = "none";
          } else {
            completeButton.addEventListener("click", () => {
              this.completeTodo(index);
              completeButton.style.display = "none";
            });
          }
          li.appendChild(completeButton);
      
          const editButton = document.createElement("button");
          editButton.innerText = "Edit";
          editButton.addEventListener("click", () => {
            this.renderEditTodoForm(li, todo, index);
          });
          li.appendChild(editButton);

          const deleteButton = document.createElement("button");
          deleteButton.innerText = "Delete";
          deleteButton.addEventListener("click", () => {
            this.deleteTodo(index);
          });
          li.appendChild(deleteButton);
      
          container.appendChild(li);
          todoList.appendChild(container);
        });
      }
      
      private renderEditTodoForm(li: HTMLLIElement, todo: Todo, index: number) {
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = todo.text;
        editInput.addEventListener("keydown", (event) => {
            if(event.key === "Enter"){
                const newText = editInput.value.trim();
                if(newText){
                    this.editTodoText(index, newText);
                }
            }
        })
        li.replaceChild(editInput, li.firstChild);
        editInput.select();
      }
      
      private renderAddTodoForm(todoList: HTMLElement) {
        const form = document.createElement("form");
        const input = document.createElement("input");
        const addButton = document.createElement("button");
      
        input.placeholder = "Add a new to-do item";
        addButton.innerText = "Add";
        addButton.addEventListener("click", (event) => {
          event.preventDefault();
          const inputValue = input.value.trim();
          if (inputValue) {
            this.addTodo(inputValue);
            input.value = "";
          }
        });
      
        form.appendChild(input);
        form.appendChild(addButton);
        todoList.appendChild(form);
      }      

      private renderFilterButtons(todoList: HTMLElement) {
        const filterButtons = document.createElement("div");
        const allButton = document.createElement("button");
        allButton.innerText = "All";
        allButton.addEventListener("click", () => {
          this.setFilter("all");
        });
        filterButtons.appendChild(allButton);

        const completedButton = document.createElement("button");
        completedButton.innerText = "Completed";
        completedButton.addEventListener("click", () => {
          this.setFilter("completed");
        });
        filterButtons.appendChild(completedButton);
    
        const incompleteButton = document.createElement("button");
        incompleteButton.innerText = "Incomplete";
        incompleteButton.addEventListener("click", () => {
          this.setFilter("incomplete");
        });
        filterButtons.appendChild(incompleteButton);
    
        todoList.appendChild(filterButtons);
      }


  }
  
  const todoList = new TodoList();
  