<svelte:head>
    <title>Book Logger</title>
</svelte:head>

<style>
    html,
    body {
        margin: 0;
        padding: 0;
        height: 100%;
        
    }

    :root {
        font-family: Arial, Helvetica, sans-serif;
    }
    
    h1 {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        display: block;
        background-color: #f0f0f0;
        align-content: center;
        width: fit-content;
        border-radius: 3px;
        padding: 1rem;
        margin-inline: auto;
        font-weight: 400;
    }

    button {
        display: block;
        border-radius: 3px;
        border: none;
        background-color: #f0f0f0;
        font-size: 1rem;
        padding: 1rem;
        cursor: pointer;
        margin: auto;
        margin-left: auto;
    }

    button:active {
        filter: brightness(90%);
    }

    .modal {
        background-color: white;
        position: fixed;
        width: 75%;
        height: 75%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 1rem;
    }

    .form {
        display: grid;
        gap: 2.5rem;
        grid-template-columns: repeat(2, 1fr);
        width: 100%;
        min-width: 10%;
    }

    @media (max-width: 1750px) {
        .form {
            grid-template-columns: repeat(1, 1fr);
        }
        
    }

    @media (min-width: 1750px) {
        .form {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    .form > div {
        position: relative;
        width: 90%
    }

    .form > div > input {
        border: solid black 1px;
        border-radius: 3px;
        font-size: 1.5rem;
        padding: .5rem;
        inset: 0;
        width: 100%;
    }

    .form > div > label {
        position: absolute;
        top: 0;
        left: 5%;
        padding-block: 0;
        padding: 5px;
        background-color: white;
        transform: translateY(-50%);
    }

    .filtered {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: black;
        inset: 0;
        opacity: .5;
    }

    .modal-btn {
        display: inline-block;
    }

    .export-btn,
    .done {
        background-color: rgb(0, 102, 255);
        color: white;
    }

    .btn-container {
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        display: flex;
        gap: 1rem;
    }

    input::placeholder {
        font-size: 1rem;
    }
    
    .export-data {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
    }

    .export-data > div {
        background-color: #f0f0f0;
        height: 100%;
        margin: 1rem;
        border-radius: 3px;
        padding: 1rem;
        width: 100%;
        box-sizing: border-box;
        overflow: scroll;
    }
    .export-data > div > p {
        width: 100%;
        box-sizing: border-box;
        text-wrap: wrap;
        word-break: break-all;
    }
    .export-data > div > button {
        background-color: white;
        border: black .5px solid;
        aspect-ratio: 3;
        width: fit-content;
        margin-top: auto;
    }

    .import-btn {
        background-color: rgb(255, 69, 69);
        color: white;
    }

    .primary-buttons {
        display: flex;
        width: fit-content;
        gap: 1rem;
        justify-content: space-around;
        margin: auto;
    }

    .import-modal {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
    }

    .import-modal > div {
        display: flex;
        gap: 1rem;
    }

    #import-textarea {
        height: 70%;
        width: 90%;
        margin: 1rem;
        background-color: #f0f0f0;
        border-radius: 3px;

    }
</style>

<script>
    import { books } from "./global.svelte.js";
    import BookEntry from "./BookEntry.svelte";
    import { save, load } from "./localStorage.js";
    import { onMount } from "svelte";

    // load in local data
    onMount(() => {
        JSON.parse(load()).forEach(book => {
            books.push(book);
        });
    })


    let modalData = $state({
        name: "",
        segmentName: "", 
        segmentValue: "", 
        author: "", 
        websiteLink: "",
        id: books.length + 1
    });

    let modalVisible = $state(false);

    function validateNumberOnKeypress(event) {
        event.target.value = event.target.value.replace(/\D/g, "");
    }
    function newEntry() {
        const validation = validateInput();

        if (Object.values(validation).every((val, i, arr) => val === arr[0])) {
            modalVisible = false;
            modalData.id = books.length + 1;
            books.push(modalData);
            save();
        } else {
            invalidateInputs(validation);
        }
    }

    function validateInput() {
        let validation = {name: false, author: false, "segment-name": false, "segment-value": false, website: false};
        validation.name = modalData.name.length > 0;
        validation.author = true;
        if (!modalData.author) modalData.author = "Unkown Author";
        validation["segment-name"] = modalData.segmentName.length > 0;
        if (modalData.segmentValue.length > 0 && Number(modalData.segmentValue)) {
            validation["segment-value"] = true;
            modalData.segmentValue = Number(modalData.segmentValue);
        } else {
            validation["segment-value"] = false;
        }
        validation.website = true;
        try {
            Boolean(new URL(modalData.websiteLink));
        } catch {
            modalData.websiteLink = "#";
        }
        
        return validation;
    }

    function invalidateInputs(validation) {
        console.log(JSON.stringify(validation))
        for (let i in validation) {

            if (!validation[i]) {
                document.getElementById(i).style.borderColor = "rgb(255, 69, 69)";
            } 
        }   
    }

    let exportModalVisible = $state(false)  ;
    function exportStorage() {
        return load();
    }

    function copyToClipboard(string) {
        navigator.clipboard.writeText(string);
    } 
    
    let importModalVisible = $state(false);
    let importTextareaContent = $state("Your save data here");
</script>

<h1>Book Logger</h1>
<div class="primary-buttons">
    <button onclick={() => modalVisible = !modalVisible}>Add new entry</button>
    <button class="import-btn" onclick={() => importModalVisible = true}>Import</button>
    <button class="export-btn" onclick={() => exportModalVisible = true}>Export</button>
</div>


{#if modalVisible}
<div class="filtered"></div>
<div class="modal">
    <div class="form">
        <div>
            <label for="name">Book Name</label>
            <input id="name" placeholder="E.g All Quiet On The Western Front" bind:value={modalData.name} />
        </div>
        <div>
            <label for="author">Author (optional)</label>
            <input id="author" placeholder="E.g Erich Maria Remarque" bind:value={modalData.author} />
        </div>
        <div>
            <label for="segment-name">Segment Name</label>
            <input id="segment-name" placeholder="What does the author use to seperate the sections? E.g Chapter" bind:value={modalData.segmentName}/>
        </div>
        <div>
            <label for="segmnent-value">Segment Value</label>
            <input id="segment-value" onkeyup={validateNumberOnKeypress} onkeydown={validateNumberOnKeypress} placeholder="E.g 3" bind:value={modalData.segmentValue}/>
        </div>
        <div>
            <label for="website">Website URL (optional)</label>
            <input id="website" placeholder="https://linktoreadingwebsite.com" bind:value={modalData.websiteLink}/>
        </div>
    </div>
    <div class="btn-container">
        <button class="modal-btn" onclick={() => modalVisible = !modalVisible}>Cancel</button>
        <button class="modal-btn done" onclick={newEntry}>Done</button>
    </div>
</div>
{/if}
{#if exportModalVisible}
    <div class="filtered"></div>
    <div class="modal export-data">
        <h2>Export Data</h2>
        <div>
            <p id="export-data-element">{exportStorage()}</p>
            <button onclick={function() {
                copyToClipboard(exportStorage());
                const element = this;
                element.textContent = "Copied!";
                setTimeout(() => element.textContent = "Copy", 3000);
            }}>Copy</button>
        </div>
        <button onclick={() => exportModalVisible = false}>Close</button>
    </div>
{/if}
{#if importModalVisible}
    <div class="filtered"></div>
    <div class="modal import-modal">
        <textarea id="import-textarea" bind:value={importTextareaContent}></textarea>
        <div>
            <button onclick={() => importModalVisible = false}>Cancel</button>
            <button class="import-btn" onclick={() => {
                try {
                    // the following code has to be done this way since imports arent mutable via assigments
                    const textarea = JSON.parse(importTextareaContent);
                    // remove all indexes
                    books.splice(0, books.length);
                    // add new indexes
                    textarea.forEach(book => {
                        books.push(book);
                    });
                    importModalVisible = false;
                    save();
                } catch {
                    document.getElementById("import-textarea").style.border = "rgb(255, 69, 69) solid 1px";
                }    
            }}>Import</button>
        </div>
    </div>
{/if}
{#each books as Book (Book.id)}
    <BookEntry {...Book} />
{/each}