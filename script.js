const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const itemRemoveList = document.querySelectorAll('.remove-item');
const itemFilter = document.getElementById('filter');
const items = document.querySelectorAll('#item-list li');
const clearBtn = document.getElementById('clear');
const formBtn = itemForm.querySelector('button');
const results = document.getElementById('results');     //Nova funcionalidade
let isEditMode = false;

function displayItems() {
    const itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.forEach(item => {
        addItemToDom(item);
    })
    checkUI();
}

function onItemAddSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    //Validate Input                             Nova validação
    if (itemInput.value === '' | itemInput.value.trim() === '') {
        alert('Please add an item');
        return;
    }

    //Check for edit mode
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if(checkIfItemExists(newItem)) {
            alert('That item already exists!');
            return;
        }
    }

    //Create item DOM element
    addItemToDom(newItem);

    //Add item to local storage
    addItemToStorage(newItem);

    checkUI();
    itemInput.value = '';
}

function addItemToDom(item) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item.trim()));

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    itemList.appendChild(li);
}

function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage();
    
    //Add new item to array
    itemsFromStorage.push(item);
    
    //Convert to JSON string and set to local storage
    localStorage.setItem("items", JSON.stringify(itemsFromStorage))
}

function getItemsFromStorage() {
    let itemsFromStorage;
    if(localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    } else if (e.target.classList.contains('items')){
        return;
    }
    else {
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item){
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
    isEditMode = true;

    itemList.querySelectorAll('li').forEach(i => {
        i.classList.remove('edit-mode');
    })
    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>    Update item';
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent.trim();

    //Nova funcionalidade
    document.getElementById("item-input").focus();
}

function removeItem(item) {
    if(confirm('Are you sure?')) {
        //Remove from dom
        item.remove();
        
        //Remove from localStorage
        removeItemFromStorage(item.textContent);

        checkUI();
    }
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    //Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
    console.log(itemsFromStorage);

    //Re-set to localstorage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems(e) {
    const items = document.querySelectorAll('#item-list li');
    items.forEach(index => {
        itemList.removeChild(index);
    })
    // Exemplo do curso, mais performático
    // while (itemList.firstChild) {
    //     itemList.removeChild(itemList.firstChild)
    // }


    //Clear from local storage
    localStorage.removeItem('items')

    checkUI();
}

function filterItems(e) {
    const items = document.querySelectorAll('#item-list li');
    const text = e.target.value.toLowerCase();
    var count = 0;

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if(itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
            count = count + 1;
        } else {
            item.style.display = 'none';
        }
    })

    results.innerHTML=`${count} Result(s)`;           //Nova Funcionalidade
}

function checkUI() {
    itemInput.value = "";

    const items = document.querySelectorAll('#item-list li');
    if (items.length === 0) {
        clearBtn.style.display = 'none';
        filter.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        filter.style.display = 'block';
    }

    items.forEach(item => {
        item.classList.remove('edit-mode')
    })

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i>   Add Item';
    formBtn.style.backgroundColor = "#333";

    isEditMode = false;

    results.innerHTML=`${items.length} Result(s)`;      //Nova funcionalidade
}

// Initialize app
function init(){
    itemForm.addEventListener('submit', onItemAddSubmit);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);
    document.addEventListener('keyup', checkUI);        //Nova funcionalidade

    checkUI();
}
init();