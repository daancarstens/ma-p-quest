const imageLocation = document.getElementById('imageLocation');
const myInput = document.getElementById('myInput');
const myOptions = document.getElementById('possibilities');
const inv = document.getElementById('inv');
const ErrorMSG = document.getElementById("error");
const DescMSG = document.getElementById("beschrijving");


let inventory = [];

setInterval(update, 1)

class room {
    constructor(options, imagePath, items, requiredItem, description = "") {
        this.options = options;
        this.image = imagePath;
        this.items = items;
        this.requiredItem = requiredItem;
        this.beschrijving = description;
    }
}


// 3d array
let grid = [
    [
        ["1", "2", "3"],
        ["4", "5", "6"], // Floor 0
        ["7", "8", "9"]
    ],
    [
        ["10", "11", "12"],
        ["13", "14", "15"],  // FLoor 1
        ["16", "17", "18"]
    ],
];

let rooms = [];

rooms[1] = new room(["down", "right"], "media/Gibraltar.jpg", [], "", "je zit in kamer 1");
rooms[2] = new room(["left", "right", "down"], "media/Busan.jpg", ["key"], "", "je zit in kamer 2 er is hier een sleutel!");
rooms[3] = new room(["left", "down"], "media/Eichenwalde.jpg", [], "key", "je zit in kamer 3");
rooms[4] = new room(["up", "down", "right"], "media/Horizon.jpg", [], "", "je zit in kamer 4");
rooms[5] = new room(["left", "down", "right", "up"], "media/Kings.jpg", [], "", "je zit in kamer 5");
rooms[6] = new room(["left", "down", "up"], "media/Lijiang.jpg", [], "", "je zit in kamer 6");
rooms[7] = new room(["up", "right"], "media/Numbani.jpg", [], "", "je zit in kamer 7");
rooms[8] = new room(["left", "right", "up"], "media/Oasis.jpg", [], "", "je zit in kamer 8");
rooms[9] = new room(["left", "up", "floorup"], "media/Paris.jpg", [], "", "je zit in kamer 9");

let currentX = 0;
let currentY = 0;
let currentZ = 0;

function getPlayerRoom() {
    return grid[currentX][currentY][currentZ];
}

function update() {
    //update the image
    imageLocation.src = rooms[getPlayerRoom()].image;

    // update options text
    let optionsMSG = "";
    for (let i = 0; i < rooms[getPlayerRoom()].options.length; i++) {
        optionsMSG += "<li>" + rooms[getPlayerRoom()].options[i] + "</li>"
    }

    if (rooms[getPlayerRoom()].items.length != 0) {
        optionsMSG += "pickup ";
    }

    DescMSG.innerHTML = rooms[getPlayerRoom()].beschrijving;

    myOptions.innerHTML = optionsMSG;

    // update inventory
    let items = "";
    for (let i = 0; i < inventory.length; i++) {
        items += "<li>" + inventory[i] + "</li>";
        if (i + 1 < inventory.length) {
            items += " - "
        }
    }

    inv.innerHTML = items;
}

myInput.addEventListener('keydown', getInput, false);

function getInput(e) {
    if (e.key == "Enter") {
        let inputArray = myInput.value.split(" ");

        let isOption = false;
        for (let i = 0; i < rooms[getPlayerRoom()].options.length; i++) {
            if (rooms[getPlayerRoom()].options[i] == inputArray[0]) {
                isOption = true;
            }
        }

        if (rooms[getPlayerRoom()].items.length != 0) {
            if (inputArray[0] === "pickup") {
                isOption = true;
            }
        }

        let newY = currentY;
        let newX = currentX;
        let newZ = currentZ;

        if (isOption) {
            console.log("true")
            switch (inputArray[0]) {
                case "down":
                    newY += 1;
                    break;
                case "right":
                    newZ += 1;
                    break;
                case "left":
                    newZ -= 1;
                    break;
                case "up":
                    newY -= 1;
                    break;
                case "floordown":
                    newX -= 1;
                    break;
                case "floorup":
                    newX += 1;
                    break;
                case "pickup":
                    let item = Math.floor(Math.random() * rooms[getPlayerRoom()].items.length);
                    inventory.push(rooms[getPlayerRoom()].items[item]);
                    rooms[getPlayerRoom()].items = rooms[getPlayerRoom()].items.filter(el => el !== rooms[getPlayerRoom()].items[item]);
                    break;
            }
        } else {
            errorMSG("is dit wel een movement optie?");
        }

        if (rooms[grid[newX][newY][newZ]].requiredItem != "") {
            if (!(inventory.includes(rooms[grid[newX][newY][newZ]].requiredItem))) {
                errorMSG("u heeft niet de juiste items om deze kamer in te gaan.\nNodig: " + rooms[grid[newX][newY][newZ]].requiredItem);
                update();
                myInput.value = "";
                return;
            } else {
                inventory = inventory.filter(el => el !== rooms[getPlayerRoom()].requiredItem);
            }
        }
        currentX = newX;
        currentY = newY;
        currentZ = newZ;

        update();
        myInput.value = "";
    }
}


let errorMSG = function (msg) {
    ErrorMSG.innerHTML = msg;

    setTimeout(function () {
        if (ErrorMSG.innerHTML == msg) {
            ErrorMSG.innerHTML = "";
        }
    }, 3000);
}
