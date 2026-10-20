import { type Todo } from "./types/Todo";

const generateElement = (tagName: string, options: {} = {}) => {
    return Object.assign(document.createElement(tagName), options);
};

const handleRemoveTodo = (todo: HTMLElement, id: string) => {
    const todoElement = todo.closest("li");
    todos = todos.filter((t) => t.id !== id);
    localStorage.setItem("todos", JSON.stringify(todos));
    todoElement?.remove();
};

const handleToggleIsDone = (id: string) => {
    const tarTodo = todos.find((t) => t.id === id);
    if (!tarTodo) return;
    tarTodo.isDone = !tarTodo.isDone;
    localStorage.setItem("todos", JSON.stringify(todos));
};

const handleClick = (e: MouseEvent) => {
    const todoElement = e.target as HTMLElement;
    const id = todoElement.closest("li")?.dataset.id as string;
    if (todoElement.closest("input[type='checkbox']")) handleToggleIsDone(id);
    if (todoElement.closest("button")) handleRemoveTodo(todoElement, id);
};

const renderTodo = (todo: Todo) => {
    const { id, title, isDone } = todo;
    const articleElement = generateElement("li");
    articleElement.dataset.id = id;
    const titleElement = generateElement("h2", { textContent: title });
    const isDoneElement = generateElement("input", {
        type: "checkbox",
        checked: isDone,
    });
    const removeTodoBtn = generateElement("button", { textContent: "Remove" });
    articleElement.append(isDoneElement, titleElement, removeTodoBtn);
    return articleElement;
};

const generateForm = () => {
    const formElement = generateElement("form", {
        id: "titleForm",
        onsubmit: handleAddTodo,
    });
    const inputLabelElement = generateElement("label", {
        textContent: "Enter the title:",
    });
    const inputElement = generateElement("input", {
        id: "titleInput",
    }) as HTMLInputElement;
    inputElement.autofocus = true;
    const submitBtnElement = generateElement("button", {
        type: "submit",
        textContent: "Submit",
    });

    formElement.append(inputLabelElement, inputElement, submitBtnElement);
    return formElement;
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

const todosText = localStorage.getItem("todos") || "[]";
let todos: Todo[] = JSON.parse(todosText);

const rootElement = document.getElementById("app");
rootElement?.appendChild(generateForm());
const listTodosElement = generateElement("ul");
listTodosElement.addEventListener("click", handleClick);
listTodosElement.append(...todos.map(renderTodo));
rootElement?.appendChild(listTodosElement);
