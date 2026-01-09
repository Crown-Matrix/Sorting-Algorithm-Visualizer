

// Initialize array and other variables
var array = [];
var currentSorting = false;
var skipSort = false;
var brandNewArray = true;






document.addEventListener('DOMContentLoaded', (event) => {
        // get selected algorithim from url ? parameter
        const urlParams = new URLSearchParams(window.location.search);
        const algorithm = urlParams.get('algorithm');

        const hoverNames = {
            "bubble":"Bubble Sort",
            "selection":"Selection Sort",
            "insertion":"Insertion Sort",
            "quick":"Quick Sort",
            "radix":"Radix Sort",
            "counting":"Counting Sort"
        }

        const hoverDescriptions = {
            "bubble":"Iterates through list repeatedly, swapping adjacent elements that are out of order.",
            "selection":"Iterates through list, selecting the smallest element and moving it to end of the sorted portion.",
            "insertion":"Iterates through list, taking one element at a time and inserting it into its correct position in the sorted portion.",
            "quick":"Chooses a 'pivot' element and sorts the other elements into two parts according to whether they are less than or greater than the pivot.\n\nIts a recursive function so the visualization may be hard to follow",
            "radix":"Orders numbers by checking individual digits, starting from the ones place digit working itself up to the biggest digit.",
            "counting":"Counts the number of occurrences of each value, then places the frequency of each value in the sorted array."
        }

            const complexityInfo = {
            "bubble":{
                "best-time":"O(n)",
                "avg-time":"O(n^2)",
                "worst-time":"O(n^2)",
                "space-complexity":"O(1)"
            },
            "selection":{
                "best-time":"O(n^2)",
                "avg-time":"O(n^2)",
                "worst-time":"O(n^2)",
                "space-complexity":"O(1)"
            },
            "insertion":{
                "best-time":"O(n)",
                "avg-time":"O(n^2)",
                "worst-time":"O(n^2)",
                "space-complexity":"O(1)"
            },
            "quick":{
                "best-time":"O(n log n)",
                "avg-time":"O(n log n)",
                "worst-time":"O(n^2)",
                "space-complexity":"O(log n)"
            },
            "radix":{
                "best-time":"O(d*(n + k))",
                "avg-time":"O(d*(n + k))",
                "worst-time":"O(d*(n + k))",
                "space-complexity":"O(n + k)"
            },
            "counting":{
                "best-time":"O(n + k)",
                "avg-time":"O(n + k)",
                "worst-time":"O(n + k)",
                "space-complexity":"O(k)"
            }
        }

        
    

        if (!(algorithm in hoverNames)) {
            window.location.href = '/homepage/homepage.html';
        } else {
            document.getElementById('algorithm-title').innerText = hoverNames[algorithm];
            document.getElementById('algorithm-description').innerText = hoverDescriptions[algorithm];
        }

        if (algorithm === 'counting' || algorithm === 'radix') {
            document.getElementById('comparison-text').innerText = 'Memory Operations: ';
        }

        document.getElementById('array-size').addEventListener('input', function() {
            document.getElementById('array-size-value').innerText = this.value;
        });

        document.getElementById('array-input').addEventListener('input', function() {
            if (currentSorting) return; // prevent generating new array while sorting
            resetComparisonCount();
            document.getElementById('sort-array').disabled = false; // enable sort button
            const inputArray = parseArrayInput(this.value);
            document.getElementById('array-size').value = inputArray.length;
            document.getElementById('array-size-value').innerText = document.getElementById('array-size').value;
            if (!inputArray) { return;}
            if (inputArray.length > 0 && inputArray.length <= 40) {
                array = inputArray;
            } else if (inputArray.length > 40) {
                alert("Please enter an array with 40 or fewer elements.");
                return;
            } else {
                alert("Please enter a valid array.");
                return;
            }
            renderArray(array);
            brandNewArray = true;
        });
        

        // this is the function that gets called when the generate array button is clicked
        document.getElementById('generate-array').addEventListener('click', function() {
            if (currentSorting) return; // prevent generating new array while sorting
            resetComparisonCount();
            
            document.getElementById('sort-array').disabled = false; // enable sort button
            const arraySize = parseInt(document.getElementById('array-size').value);
            array = [];
            if (arraySize <= 40 && arraySize > 0) {
                // valid size
                array = randomArray(arraySize, 0, 101);
            } else {
                array = randomArray(40, 0, 101);
            }
            renderArray(array);
            document.getElementById('array-input').value = array.join(','); // allow custom editing
            brandNewArray = true;
            
        });

        var currentSorting = false;
        document.getElementById('sort-array').addEventListener('click', async function() {
            if (array.length === 0) {
                // no array generated yet
                alert("Please generate an array first.");
                return;
            }

            if (currentSorting || !brandNewArray) return; // prevent multiple sorts at once or re-sorting the already sorted array
            
            this.disabled = true; // prevent multiple clicks
            document.getElementById('array-size').disabled = true;
            document.getElementById('lockpad-span').hidden = false;
            document.getElementById('generate-array').disabled = true;
            document.getElementById('skip-sort').disabled = false;
            currentSorting = true;


            switch (algorithm) {
                case 'bubble':
                    await bubbleSort(array);
                    break;
                // Future cases for other algorithms can be added here
                case 'selection':
                    await selectionSort(array);
                    break;
                case 'insertion':
                    await insertionSort(array);
                    break;
                case 'quick':
                    await quickSort(array);
                    renderArray(array); // final render to show sorted array
                    for (let i = 0; i < array.length; i++) {
                        document.getElementById(i).classList.add('sorted');
                    }
                    break
                case 'radix':
                    await radixSort(array);
                    break;
                case 'counting':
                    await countingSort(array);
                    break;
                default:
                    alert("Sorting algorithm not implemented yet.");
            }
            document.getElementById('count-container').innerHTML = ''; // clear counting sort container after sorting
            this.disabled = true; // re-enable button after sorting
            document.getElementById('generate-array').disabled = false;
            currentSorting = false;
            skipSort = false;
            brandNewArray = false;
            document.getElementById('skip-sort').disabled = true;
            
            document.getElementById('array-size').disabled = false;
            document.getElementById('lockpad-span').hidden = true;
        });


        document.getElementById('skip-sort').addEventListener('click', () => {
            if (currentSorting) {skipSort = true;}
            
        });

        document.getElementById('best-time').innerText = complexityInfo[algorithm]["best-time"];
        document.getElementById('avg-time').innerText = complexityInfo[algorithm]["avg-time"];
        document.getElementById('worst-time').innerText = complexityInfo[algorithm]["worst-time"];
        document.getElementById('space-complexity').innerText = complexityInfo[algorithm]["space-complexity"];

        if (algorithm === 'counting' || algorithm === 'radix') {
            document.querySelectorAll(`.${algorithm}`).forEach(elem => {
                elem.hidden = false;
            });
        }

});

function randomArray(len, min=0, max=101) {
    min = Math.ceil(min);
    max = Math.floor(max);

    function getRandomIntInclusive(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min; // The maximum is inclusive and the minimum is inclusive
    }

    let return_array = []
    for (let i = 0; i < len; i++) {
        return_array.push(getRandomIntInclusive(min, max));
    }
    return return_array;
}

function renderArray(arr) {
    const container = document.getElementById('array-container');
    const container_width = (container.clientWidth) * 0.95
    const arr_length = arr.length
    const max_arr = Math.max(...arr)
    const min_arr = Math.min(...arr)
    container.innerHTML = ''; // Clear previous content
    for (let i = 0; i < arr_length; i++) {
        const bar = document.createElement('div')
        bar.id = i //set id to index for future reference
        let bar_width = (container_width)/arr_length //proportional width based on number of bars
        bar.style.width = bar_width + "px" //divide horizontally evenly around container div
        bar.style.height = ((arr[i]-min_arr)/(max_arr-min_arr)) * 300 + 20 + "px" //proportional scaling to max
        
        if (arr[i/(max_arr-min_arr)] < 0.1) {
            bar.style.height = "30px" //minimum height for visibility
        }
        bar.classList.add('array-bar')
        bar.textContent = arr[i]
        container.appendChild(bar)
    }
}


function wait() {
    let speed = document.getElementById('speed-range').value;
    speed = 1 - speed; // invert speed for wait time
    ms = calculateWaitIndex(speed);
    return new Promise(resolve => setTimeout(resolve, ms));
}

function calculateWaitIndex(index) {


    // 0 <= index <= 1
    // 0.05 <= wait time <= 1000

    //linear scaling
    /*const maxWait = 1000; // default milliseconds
    return index * maxWait + (0.05 * index);*/

    //exponential scaling
    const minWait = 2.5; // milliseconds
    const maxWait = 750; // milliseconds
    const expScale = 5; // adjust this value to change the curve steepness
    const scaledValue = (Math.exp(index * expScale) - 1) / (Math.exp(expScale) - 1); // scales between 0 and 1 exponentially
    return Math.floor(scaledValue * (maxWait - minWait) + minWait);



    
    
}



async function bubbleSort(arr) {
    let len = arr.length;
    const max_len = arr.length;
    while (true) { //iterate until sorted
        for (let i = len; i < max_len; i++) {
            document.getElementById(i).classList.add('sorted');
        }
        let sorted = true;
        for (let i = 1; i < len; i++) { //iteration
            document.getElementById(i-1).classList.add('selected');
            document.getElementById(i).classList.add('selected');
            if (!skipSort) {await wait();}
            increaseComparisonCount();
            if (arr[i-1] > arr[i]) { //if previous element of iteration is bigger                
                sorted = false;
                [arr[i-1],arr[i]] = [arr[i],arr[i-1]]; // swap
                renderArray(arr);
                for (let i = len; i < max_len; i++) {
                    document.getElementById(i).classList.add('sorted');
                }
            }
            
            document.getElementById(i-1).classList.remove('selected');
            document.getElementById(i).classList.remove('selected');
            if (!skipSort) {await wait();}

        }
        if (sorted) break; // if no swaps were made, array is sorted
        len--; // reduce len after each pass since largest element is in place
    }
    renderArray(arr);
    for (let i = 0; i < max_len; i++) {
            document.getElementById(i).classList.add('sorted');
        }
    return arr;
}


async function selectionSort(arr) {
        const len = arr.length
        let sortedArrIndex = 0
        
        while (sortedArrIndex < len) {


            for (let i = 0; i < sortedArrIndex; i++) {
                document.getElementById(i).classList.add('sorted');
            }

            if (!skipSort) {await wait();}
            let minimumIndex = sortedArrIndex
            let minimumValue = arr[sortedArrIndex]
            for (let i = sortedArrIndex + 1; i < len; i++) {
                document.getElementById(minimumIndex).classList.add('selected-2');
                document.getElementById(i).classList.add('selected');
                if (!skipSort) {await wait();}
                increaseComparisonCount();
                if (arr[i] < minimumValue) {
                    document.getElementById(minimumIndex).classList.remove('selected-2');
                    minimumValue = arr[i]
                    minimumIndex = i
                }
                document.getElementById(i).classList.remove('selected');
            }
            [arr[sortedArrIndex],arr[minimumIndex]] = [arr[minimumIndex],arr[sortedArrIndex]]
            renderArray(arr);
            sortedArrIndex++
        }
        for (let i = 0; i < len; i++) {
            document.getElementById(i).classList.add('sorted');
        }
        return arr;
    }

async function insertionSort(arr) {
    const len = arr.length;
    for (let i = 1; i < len; i++) {
        let target = arr[i];
        renderArray(arr);
        for (let k = 0; k < i; k++) {
            document.getElementById(k).classList.add('sorted');
        }
        document.getElementById(i).classList.add('selected');
        if (!skipSort) {await wait();}
        let j = i - 1; //last index of sorted portion
        while (j >= 0 && arr[j] > target) { //shift elements to the right to make space
            increaseComparisonCount();
            arr[j + 1] = arr[j];
            
            
            swapArr = [...arr] //create copy for rendering
            swapArr[j] = target; //show target in its currently-being-tested position
            renderArray(swapArr);
            for (let k = 0; k <= j; k++) {
                document.getElementById(k).classList.add('sorted');
            }
            document.getElementById(j).classList.add('selected-2');
            document.getElementById(j).classList.remove('sorted');
            for (let k = j + 1; k < i + 1; k++) {
                document.getElementById(k).classList.add('sorted');
                document.getElementById(k).classList.remove('selected');
            }
            if (!skipSort) {await wait();}
            document.getElementById(j).classList.remove('selected-2');
            document.getElementById(j).classList.add('sorted');

            j--; //move left in sorted portion to prepare for the +1 in next line
        }
        arr[j + 1] = target; //insert target element in correct position
    }
    return arr;
}




async function quickSort(arr, start = 0, end = arr.length - 1) {
    function swap(arr, i, j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    if (start >= end) {return;}

    const pivotIndex = Math.floor((start + end) / 2);
    const pivot = arr[pivotIndex];

    // Highlight pivot in middle
    document.getElementById(pivotIndex).classList.add('selected-2');
    if (!skipSort) await wait();

    let left = start;
    let right = end;

    while (left <= right) {
        // Move left pointer to find value >= pivot
        while (arr[left] < pivot) {
            increaseComparisonCount();
            document.getElementById(left).classList.add('selected');
            if (!skipSort) await wait();
            document.getElementById(left).classList.remove('selected');
            left++;
        }

        // Move right pointer to find value <= pivot
        while (arr[right] > pivot) {
            increaseComparisonCount();
            document.getElementById(right).classList.add('selected');
            if (!skipSort) await wait();
            document.getElementById(right).classList.remove('selected');
            right--;
        }
        increaseComparisonCount();
        if (left <= right) {
            // Swap elements
            swap(arr, left, right);
            renderArray(arr);
            if (!skipSort) await wait();

            left++;
            right--;
        }
    }

    // Remove pivot highlight
    document.getElementById(pivotIndex).classList.remove('selected-2');

    // Recursively sort left and right partitions
    await quickSort(arr, start, right);
    await quickSort(arr, left, end);

    // Mark sorted elements (optional: only mark end elements)
    increaseComparisonCount();
    increaseComparisonCount();
    if (start === 0 && end === arr.length - 1) {
        for (let i = 0; i < arr.length; i++) {
            document.getElementById(i).classList.add('sorted');
        }
    }
}


// ---------- RADIX SORT (VISUALIZED) ----------
async function radixSort(arr) {

    // Helpers (scoped inside radixSort)
    const getDigit = (num, place) =>
        Math.floor(num / Math.pow(10, place)) % 10;

    const digitCount = (num) =>
        num === 0 ? 1 : Math.floor(Math.log10(num)) + 1;

    const mostDigits = (arr) => {
        let max = 0;
        for (let num of arr) {
            max = Math.max(max, digitCount(num));
        }
        return max;
    };

    const maxDigitCount = mostDigits(arr);

    for (let k = 0; k < maxDigitCount; k++) {
        // Create digit buckets (0–9)
        let buckets = Array.from({ length: 10 }, () => []);

        for (let i = 0; i < 10; i++) { //for each digit bucket
            increaseComparisonCount();
        }

        // ---- DISTRIBUTION PHASE ----
        for (let i = 0; i < arr.length; i++) {
            document.getElementById(i).classList.add('selected');
            if (!skipSort) await wait();

            const digit = getDigit(arr[i], k);
            buckets[digit].push(arr[i]);
            increaseComparisonCount();


            document.getElementById(i).classList.remove('selected');
        }

        // ---- COLLECTION PHASE ----
        let index = 0;
        for (let d = 0; d < 10; d++) {
            for (let value of buckets[d]) {
                arr[index] = value;
                increaseComparisonCount();
                renderArray(arr);
                document.getElementById(index).classList.add('selected-2');
                if (!skipSort) await wait();
                document.getElementById(index).classList.remove('selected-2');

                index++;
            }
        }
    }

    // Mark array as fully sorted
    for (let i = 0; i < arr.length; i++) {
        document.getElementById(i).classList.add('sorted');
    }

    return arr;
}



async function countingSort(arr) {
    const MAX = 101;
    const count = new Array(MAX + 1).fill(0);
    for (let i = 0; i < MAX + 1; i++) {
        increaseComparisonCount();
    }

    renderCount(count);

    // ---------- COUNTING PHASE ----------
    for (let i = 0; i < arr.length; i++) {
        document.getElementById(i).classList.add('selected');
        const value = arr[i];

        const countBar = document.querySelector(
            `.count-bar[data-index="${value}"]`
        );
        countBar.classList.add('selected');

        if (!skipSort) await wait();

        count[value]++;
        increaseComparisonCount();
        renderCount(count);

        document.getElementById(i).classList.remove('selected');
        countBar.classList.remove('selected');
    }

    // ---------- RECONSTRUCTION PHASE ----------
    let index = 0;
    for (let value = 0; value <= MAX; value++) {
        while (count[value] > 0) {
            arr[index] = value;
            document.getElementById(index).classList.add('sorted');
            renderArray(arr);

            //fill all previous blocks with sorted class
            for (let k = 0; k < index; k++) {
                document.getElementById(k).classList.add('sorted');
            }

            const countBar = document.querySelector(
                `.count-bar[data-index="${value}"]`
            );
            countBar.classList.add('active');

            document.getElementById(index).classList.add('selected-2');
            if (!skipSort) await wait();

            document.getElementById(index).classList.remove('selected-2');
            document.getElementById(index).classList.add('sorted');

            count[value]--;
            increaseComparisonCount();
            renderCount(count);

            countBar.classList.remove('active');
            index++;
        }
    }
    return arr;
}


function renderCount(count) {
    const container = document.getElementById('count-container');
    container.innerHTML = '';

    for (let value = 0; value < count.length; value++) {
    const wrapper = document.createElement('div');
    wrapper.className = 'count-wrapper';

    const bar = document.createElement('div');
    bar.className = 'count-bar';
    bar.style.height = `${count[value] * 10 + 4}px`;
    bar.textContent = count[value];
    bar.dataset.index = value;
    if (value === 0) {
        bar.style.color = 'black';
    }
    bar.style.color = 'white';


    const label = document.createElement('div');
    label.className = 'count-label';
    label.textContent = value;
    label.style.color = 'black';

    wrapper.appendChild(bar);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
}}


function increaseComparisonCount() {
    document.getElementById('comparison-int').innerText = parseInt(document.getElementById('comparison-int').innerText) + 1;
}

function resetComparisonCount() {
    document.getElementById('comparison-int').innerText = '0';
}


function parseArrayInput(input) {
    //split input by non-numeric characters
    //return false if no valid numbers found
    //reject values above 101 or negative numbers
    //seperate only by ; , : space(of any length) tabs or slashes

    const strValues = input.split(/[\s\\/,\;:]+/);

    const numValues = strValues.map(s => parseInt(s, 10)).filter(n => !isNaN(n));
    if (numValues.length === 0) { return false; }
    for (let n of numValues) {
        if (n < 0 || n > 101) {
            return false;
        }
    }
    return numValues;
    //ex:
    // "5,3,8,1,2" -> [5,3,8,1,2]
    // "10 20 30" -> [10,20,30]
    // "4; 1; 7; 3" -> [4,1,7,3]
}