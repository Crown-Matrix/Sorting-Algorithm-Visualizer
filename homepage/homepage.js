const hoverDescriptions = {
    "bubble":"Iterates through list repeatedly, swapping adjacent elements that are out of order.",
    "selection":"Iterates through list, selecting the smallest element and moving it to the end of the sorted portion.",
    "insertion":"Iterates through list, taking one element at a time and inserting it into its correct position in the sorted portion.",
    "quick":"Chooses a 'pivot' element and sorts the other elements into two parts according to whether they are less than or greater than the pivot.",
    "radix":"Orders numbers by checking individual digits, starting from the ones place digit working itself up to the biggest digit.",
    "counting":"Counts the number of occurrences of each value, then places the frequency of each value in the sorted array."
}

const hoverNames = {
    "bubble":"Bubble Sort",
    "selection":"Selection Sort",
    "insertion":"Insertion Sort",
    "quick":"Quick Sort",
    "radix":"Radix Sort",
    "counting":"Counting Sort"
}

document.addEventListener('mouseover', function(event) {
    const target = event.target;
    const targetDescription = hoverDescriptions[target.id];
    if (targetDescription) {
        target.innerText = targetDescription;
        target.style.fontSize = "100%";
    }
});


document.addEventListener('mouseout', function(event) {
    const target = event.target;
    if (hoverDescriptions[target.id]) {
        const originalText = hoverNames[target.id];
        target.innerText = originalText;
        target.style.fontSize = "1.5em";
    }
});


document.addEventListener('click', function(event) {
    const target = event.target;
    if (hoverDescriptions[target.id]) {
        const algorithm = target.id;
        window.location.href = `/array-playground/array-playground.html?algorithm=${algorithm}`;
    }
});