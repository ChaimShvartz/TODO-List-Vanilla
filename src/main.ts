import { type Todo } from "./types/Todo";

const generateElement = (tagName: string, options: {} = {}) => {
    return Object.assign(document.createElement(tagName), options);
};

const handleRemoveTodo = (todoElement: HTMLElement, id: string) => {
    todos = todos.filter((t) => t.id !== id);
    localStorage.setItem("todos", JSON.stringify(todos));
    todoElement?.remove();
};

const handleToggleIsDone = (todoElement: HTMLElement, id: string) => {
    const tarTodo = todos.find((t) => t.id === id);
    if (!tarTodo) return;
    tarTodo.isDone = !tarTodo.isDone;
    todoElement.classList.toggle("done");
    localStorage.setItem("todos", JSON.stringify(todos));
};

const openEditPopup = (id: string) => {
    const tarTodo = todos.find((t) => t.id === id);
    if (!tarTodo) return;
    const popUpElement = generateElement("dialog") as HTMLDialogElement;
    const editTodoFormElement = generateElement("form");
    const labelElement = generateElement("label", {
        textContent: "Enter the title: ",
    });
    const inputElement = generateElement("input", {
        type: "text",
        value: tarTodo.title,
    }) as HTMLInputElement;
    const submitBtnElement = generateElement("button", {
        type: "submit",
        textContent: "Submit",
    });
    editTodoFormElement.append(labelElement, inputElement, submitBtnElement);
    popUpElement.appendChild(editTodoFormElement);
    editTodoFormElement.onsubmit = (e) => {
        e.preventDefault();
        const { value } = inputElement;
        todos = todos.map((t) => (t.id !== id ? t : { ...t, title: value }));
        localStorage.setItem("todos", JSON.stringify(todos));
        const titleElement = document.getElementById(
            `title-todo-${id}`,
        ) as HTMLElement;
        titleElement.textContent = value;
        popUpElement.close();
    };
    popUpElement.addEventListener("keydown", (e) => {
        if(e.key !== 'Escape') return
        popUpElement.remove();
        popUpElement.close()
    });
    rootElement?.appendChild(popUpElement);
    popUpElement.showModal();
};

const handleClick = (e: MouseEvent) => {
    const element = e.target as HTMLElement;
    const todoElement = element.closest("li");
    if (!todoElement) return;
    const id = todoElement.dataset.id as string;
    if (element.closest("input[type='checkbox']"))
        handleToggleIsDone(todoElement, id);
    if (element.closest("button")) handleRemoveTodo(todoElement, id);
    if (element.closest("h2")) openEditPopup(id);
};

const renderTodo = (todo: Todo) => {
    const { id, title, isDone } = todo;
    const articleElement = generateElement("li");
    if (isDone) articleElement.classList.add("done");
    articleElement.dataset.id = id;
    const titleElement = generateElement("h2", {
        id: `title-todo-${id}`,
        className: "title-todo",
        textContent: title,
    });
    const labelIsDoneElement = generateElement("label", {
        textContent: "Done",
    });
    const isDoneElement = generateElement("input", {
        type: "checkbox",
        checked: isDone,
    });
    labelIsDoneElement.appendChild(isDoneElement);
    const removeTodoBtn = generateElement("button", { textContent: "Remove" });
    articleElement.append(labelIsDoneElement, titleElement, removeTodoBtn);
    return articleElement;
};

const handleAddTodo = (e: SubmitEvent) => {
    e.preventDefault();
    const titleInputElement = document.getElementById(
        "titleInput",
    ) as HTMLInputElement;
    const formElement = e.currentTarget as HTMLFormElement;

    const id = String(Math.max(...todos.map((t) => +t.id), 0) + 1);
    const todo = { id, title: titleInputElement.value, isDone: false };
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
    listTodosElement?.appendChild(renderTodo(todo));
    formElement.reset();
    titleInputElement.focus();
};

const handleRemoveAllTodos = () => {
    localStorage.removeItem("todos");
    listTodosElement.textContent = "";
};
const handleRemoveDoneTodos = () => {
    todos = todos.filter((t) => !t.isDone);
    localStorage.setItem("todos", JSON.stringify(todos));
    Array.from(document.getElementsByClassName("done")).forEach((e) =>
        e.remove(),
    );
};

const todosText = localStorage.getItem("todos") || "[]";
let todos: Todo[] = JSON.parse(todosText);
todos = todos.sort((a) => +a.isDone - 1);

const rootElement = document.getElementById("app");
const formElement = document.getElementById("titleForm") as HTMLElement;
formElement.onsubmit = handleAddTodo;
const removeAllTodosElement = document.getElementById(
    "removeAllTodos",
) as HTMLElement;
const removeDoneTodosElement = document.getElementById(
    "removeDoneTodos",
) as HTMLElement;
removeAllTodosElement.onclick = handleRemoveAllTodos;
removeDoneTodosElement.onclick = handleRemoveDoneTodos;

const listTodosElement = generateElement("ul");
listTodosElement.addEventListener("click", handleClick);
listTodosElement.append(...todos.map(renderTodo));
rootElement?.appendChild(listTodosElement);
