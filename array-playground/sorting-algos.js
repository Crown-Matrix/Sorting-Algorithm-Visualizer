    function bubbleSort(arr) {
        let len = arr.length
        while (true) { //iterate until sorted
            let sorted = true
            for (let i = 1; i < len; i++) { //iteration
                if (arr[i-1] > arr[i]) { //if previous element of iteration is bigger
                    sorted = false
                    [arr[i-1],arr[i]] = [arr[i],arr[i-1]] // swap
                }
            }
            if (sorted) break; // if no swaps were made, array is sorted
            len--; //reduce length of next iteration since last element is sorted
        }
        return arr;
    }


    function optimizedBubbleSort(arr) {
        let len = arr.length
        while (len > 0) { //loop until unsorted portion has len 0
            let lastSwapped = 0;    
            for (let i = 1; i < len; i++) { //iteration
                if (arr[i-1] > arr[i]) { //if previous element of iteration is bigger
                    lastSwapped = i;
                    [arr[i-1],arr[i]] = [arr[i],arr[i-1]]; // swap
                }
            }
            len = lastSwapped;
        }
        return arr;
    }


    function selectionSort(arr) {
        const len = arr.length
        let sortedArrIndex = 0
        
        while (sortedArrIndex < len) {
            let minimumIndex = sortedArrIndex
            let minimumValue = arr[sortedArrIndex]
            for (let i = sortedArrIndex + 1; i < len; i++) {
                if (arr[i] < minimumValue) {
                    minimumValue = arr[i]
                    minimumIndex = i
                }
            }
            [arr[sortedArrIndex],arr[minimumIndex]] = [arr[minimumIndex],arr[sortedArrIndex]]
            sortedArrIndex++
        }
        return arr;
    }

    function insertionSort(arr) {
    const len = arr.length;

    for (let i = 1; i < len; i++) {
        let target = arr[i];
        let j = i - 1; //last index of sorted portion

        while (j >= 0 && arr[j] > target) { //shift elements to the right to make space
            arr[j + 1] = arr[j];
            j--; //move left in sorted portion to prepare for the +1 in next line
        }
        arr[j + 1] = target; //insert target element in correct position
    }
    return arr;
}


    function quickSort(arr) {
        if (arr.length <= 1) {
            return arr;
        }
        const pivotIndex = Math.floor(arr.length / 2);
        const pivot = arr[pivotIndex];
        const left = [];
        const right = [];
        for (let i = 0; i < arr.length; i++) {
            if (i === pivotIndex) continue;
            if (arr[i] < pivot) {
                left.push(arr[i]);
            } else {
                right.push(arr[i]);
            }
        }
        arr = [...quickSort(left), pivot, ...quickSort(right)];
        return arr;
    }


    




function radixSort(arr) {
    
    const maxDigitCount = mostDigits(arr);
    
    for (let k = 0; k < maxDigitCount; k++) {
        // Create buckets for each digit (0-9)
        let digitBuckets = Array.from({ length: 10 }, () => []);
        
        for (let i = 0; i < arr.length; i++) {
            const digit = getDigit(arr[i], k);
            digitBuckets[digit].push(arr[i]);
        }

        // Flatten the buckets back into the array
        arr = [].concat(...digitBuckets);
    }

    return arr;
}




function countingSort(arr, maxValue=Math.max(...arr)) {
        if (arr.length === 0) return [];
        const count = new Array(maxValue + 1).fill(0);
        const sortedIndexArr = [];

        for (let i = 0; i < arr.length; i++) {
            count[arr[i]]++;
        }

        for (let i = 0; i < count.length; i++) {
            while (count[i] > 0) {
                sortedIndexArr.push(i);
                count[i]--;
            }
        }
        return sortedIndexArr;   
    }




async function optimizedBubbleSort(arr) {
        let len = arr.length
        const max_len = len;
        while (len > 0) { //loop until unsorted portion has len 0
            let lastSwapped = 0;
            for (let i = len; i < max_len; i++) {
                document.getElementById(i).classList.add('sorted');
            }
            for (let i = 1; i < len; i++) { //iteration
                document.getElementById(i-1).classList.add('selected');
                document.getElementById(i).classList.add('selected');
                if (!skipSort) {await wait();}
                increaseComparisonCount();
                if (arr[i-1] > arr[i]) { //if previous element of iteration is bigger
                    lastSwapped = i;
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
            len = lastSwapped;
        }
        renderArray(arr);
        for (let i = 0; i < max_len; i++) {
            document.getElementById(i).classList.add('sorted');
        }
        return arr;
    }