function changeColor() {
    const colors = ["yellow", "blue"]; // Allowed colors
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.documentElement.style.setProperty("--randomcolor", randomColor);
}

// Change color immediately and then every 15 seconds
changeColor();
setInterval(changeColor, 5000);

function changeColor2() {
    const colors2 = ["pink", "red"]; // Allowed colors
    const randomColor2 = colors2[Math.floor(Math.random() * colors2.length)];
    document.documentElement.style.setProperty("--randomcolor2", randomColor2);
}

// Change color immediately and then every 15 seconds
changeColor2();
setInterval(changeColor2, 5000);


/////////////////////////////////////////////////////////////////////////////////////////////////////////

function generateRandomColor() {
    var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    if (randomColor.length != 7) { // In any case, the color code is invalid
        randomColor = generateRandomColor();
    }
    return randomColor;
    // The random color will be freshly served
}
document.body.style.backgroundColor = generateRandomColor() // -> #E1AC94



var sizer = window.matchMedia("(min-width: 950px)");
var mouseTarget = document.getElementById('mouseTarget');
// var mouseTarget2 = document.getElementById('social_elements'); //

const collection = document.getElementsByClassName("figure.project-index");
let numb = document.getElementsByClassName("figure.project-index").length;

mouseTarget.addEventListener('mouseenter', function() {
    if (sizer.matches) {
        document.getElementById("bodyid").style.background = "var(--secondcolor)";
        for (let i = 0; i < collection.length; i++) {
            collection[i].style.border = "solid 2px pink";
        }
    } else {
        document.getElementById("bodyid").style.background = '';
        for (let i = 0; i < collection.length; i++) {
            collection[i].style.border = "solid 2px pink";
        }
    }
});

mouseTarget.addEventListener('mouseleave', function() {
    if (sizer.matches) {
        document.getElementById("bodyid").style.background = "";
        for (let i = 0; i < collection.length; i++) {
            collection[i].style.border = "solid 2px pink";
        }
    } else {
        document.getElementById("bodyid").style.background = "";
        for (let i = 0; i < collection.length; i++) {
            collection[i].style.border = "solid 2px pink";
        }
    }
});


mouseTarget2.addEventListener('mouseenter', function() {
    if (sizer.matches) {
        document.getElementById("bodyid").style.background = "var(--secondcolor)";
        for (let i = 0; i < collection.length; i++) {
            collection[i].style.border = "solid 2px pink";
        }
    } else {
        document.getElementById("bodyid").style.background = '';
        for (let i = 0; i < collection.length; i++) {
            collection[i].style.border = "solid 2px pink";
        }
    }
});

mouseTarget2.addEventListener('mouseleave', function() {
    if (sizer.matches) {
        document.getElementById("bodyid").style.background = "";
        for (let i = 0; i < collection.length; i++) {
            collection[i].style.border = "solid 2px pink";
        }
    } else {
        document.getElementById("bodyid").style.background = "";
        for (let i = 0; i < collection.length; i++) {
            collection[i].style.border = "solid 2px pink";
        }
    }
});