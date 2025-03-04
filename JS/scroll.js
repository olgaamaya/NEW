var meinIntervall = setInterval(function() {
    document.getElementById("headline2").innerHTML = "Let's get in contact!";
}, 0); // 0 for immediate timing

// Define the scrollpage function to handle the scrolling logic
function scrollpage() {
    function f() {
        window.scrollTo(0, i);
        if (status == 0) {
            i = i + 2;
            if (i >= Height) {
                status = 1; // Stop the scroll once we reach the bottom
            }
        }

        // Set a small delay to create the effect of continuous scrolling
        setTimeout(f, 0.01);
    }
    setTimeout(f, 500); // Start scrolling after 1000ms (1 second delay)
}

var Height = document.documentElement.scrollHeight;
var i = 1,
    j = Height,
    status = 0;

// Function that applies styles and controls scrolling based on window size
function myFunction(x) {
    if (x.matches) { // If the window width is at least 1250px

        // Start the custom scrolling
        scrollpage();

        // Show headline and headline2, adjust their styles
        document.getElementById("headline").style.display = "block";
        document.getElementById("headline2").style.display = "block";

        document.getElementsByTagName("body")[0].style.overflow = "hidden"; // Disable default scroll
        document.getElementById("headline").style.margin = "10vh 0 0 0";
        document.getElementById("headline2").style.height = "5vh";
        document.getElementById("social_elements").style.margin = "0";
        document.getElementById("social_elements").style.height = "20vh";
        document.getElementsByTagName("footer")[0].style.height = "20vh";
        document.getElementById("wrap_info_id").style.height = "55vh";
    } else { // If the window width is less than 1250px

        // Hide headline and headline2 for small screens
        document.getElementById("headline").style.display = "none";
        document.getElementById("headline2").style.display = "none";
        document.getElementsByTagName("body")[0].style.overflow = "auto"; // Re-enable default scroll behavior
        document.getElementById("headline2").style.height = "";
        document.getElementById("social_elements").style.height = "";
        document.getElementsByTagName("footer")[0].style.height = "";
        document.getElementById("wrap_info_id").style.height = "";

        // After resizing, allow scrolling back up and down freely
        // Stop the custom scroll behavior if it is still active
        //if (status === 0) {
        //    status = 1; // End the custom scrolling
        //}

        // Ensure that the scroll position matches the user's current scroll position
        // i = window.scrollY; // Set the scroll position `i` to the current scroll position
    }
}

// Create a MediaQueryList object to track changes in the viewport width (min-width: 1250px)
var x = window.matchMedia("(min-width: 1250px)");

// Call the `myFunction` immediately to check if the media query matches when the page loads
myFunction(x);

// Add an event listener to the MediaQueryList object to listen for changes in the viewport width
x.addEventListener("change", function() {
    myFunction(x);
});