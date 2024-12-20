<script>
    let { name = "Book", segmentName = "Chapter", segmentValue = 1, author, websiteLink = new URL("#"), id} = $props();
    import { books } from "./global.svelte.js";
    import { save } from "./localStorage.js";

    function increment() {
        books[id - 1].segmentValue = segmentValue + 1;
        save();
    }

    function decrement() {
        books[id - 1].segmentValue = segmentValue - 1;
        save();
    }

    function set(value) {
        books[id - 1].segmentValue = value;
        save();
    }
</script>

<style>
    * {
        font-family: Arial, Helvetica, sans-serif;
    }

    .container {
        background-color: transparent;
        border: solid black .5px;
        border-radius: 3px;
        margin: 1rem;
        overflow: hidden;
        padding: .5rem 1rem;
    }

    .flex {
        display: flex;
        gap: .5rem;
        align-items: center;

    }

    .between {
        justify-content: space-between;
    }

    p {
        color: #7C7C7C;
    }

    a {
        max-width: 50%;
        font-weight: bold;
        color: #0090F8;
    }

    button {
        border-radius: 3px;
        width: 40px;
        height: 40px;
        border: none;
        background-color: #f0f0f0;
        font-size: 1.5rem;
        cursor: pointer;
        margin: auto;
    }

    button:active {
        filter: brightness(90%);
    }
</style>

<div class="container">
    <div class="flex between">
        <a href = {websiteLink}>{name}</a>
        <p>{author}</p>
    </div>
    <div class="flex between">
        <p>{segmentName} {segmentValue}</p>
        <div class="buttons">
            <button onclick={increment}>+</button>
            <button onclick={decrement}>-</button>
        </div>
    </div>

</div>