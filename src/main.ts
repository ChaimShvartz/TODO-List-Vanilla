import { type Todo } from "./types/Todo";

const generateElement = (tagName: string, options: {} = {}) => {
    return Object.assign(document.createElement(tagName), options);
};

const renderTodo = (todo: Todo) => {
    const { title, isDone } = todo;
    const articleElement = generateElement("article");
    const titleElement = generateElement("h2", { textContent: title });
    const isDoneElement = generateElement("input", {
        type: "checkbox",
        checked: isDone,
    });
    articleElement.append(isDoneElement, titleElement);
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

    const todo = { title: titleInputElement.value, isDone: false };
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
    rootElement?.appendChild(renderTodo(todo));
    formElement.reset();
    titleInputElement.focus();
};

const todosText = localStorage.getItem("todos") || "[]";
const todos: Todo[] = JSON.parse(todosText);

const rootElement = document.getElementById("app");
rootElement?.appendChild(generateForm());
rootElement?.append(...todos.map(renderTodo));
