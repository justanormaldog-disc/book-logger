import { books } from "./global.svelte.js";

export function save() {
    window.localStorage.setItem("books", JSON.stringify(books));
    return books;
}

export function load() {
    let localstorage = window.localStorage.getItem("books");
    if (localstorage) {
        return localstorage;
    } else {
        return "[]";
    }

}