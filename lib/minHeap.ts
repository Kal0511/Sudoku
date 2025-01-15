export class MinHeap<T> {
    public heap: Array<T>;

    constructor() {
        this.heap = new Array<T>()
    }

    push(data: T) {
        this.heap.push(data)
        let curr = this.heap.length - 1
        let parent = Math.floor((curr - 1) / 2)
        while (curr > 0 && this.heap[parent] > this.heap[curr]) {
            const temp = this.heap[curr]
            this.heap[curr] = this.heap[parent]
            this.heap[parent] = temp
            curr = parent
            parent = Math.floor((curr - 1) / 2)
        }
    }

    pop(): T | undefined {
        if (this.heap.length === 0) {
            return undefined
        }
        if (this.heap.length === 1) {
            return this.heap.pop()
        }
        const min = this.heap[0]
        this.heap[0] = this.heap.pop() as T
        this.heapify(this.heap.length, 0);
        return min
    }

    size(): number {
        return this.heap.length
    }

    print() {
        for (let i = 0; i < this.heap.length; i++) {
            console.log(this.heap.map(value => value.validIndexList.size).join(' '))
        }
    }

    sort() {
        if (this.heap.length == 0) {
            return
        }
        let n = this.heap.length
        for (let i = n / 2 - 1; i >= 0; i--) {
            this.heapify(n, i);
        }

        for (let i = n - 1; i > 0; i--) {

            let temp = this.heap[0];
            this.heap[0] = this.heap[i];
            this.heap[i] = temp;

            this.heapify(i, 0);
        }
    }

    // To heapify a subtree rooted with node i which is
    // an index in arr[]. n is size of heap
    heapify(n: number, i: number) {
        let largest = i;        // Initialize largest as root
        let l = 2 * i + 1;      // left = 2*i + 1
        let r = 2 * i + 2;      // right = 2*i + 2

        // If left child is larger than root
        if (l < n && this.heap[l] > this.heap[largest])
            largest = l;

        // If right child is larger than largest so far
        if (r < n && this.heap[r] > this.heap[largest])
            largest = r;

        // If largest is not root
        if (largest != i) {
            let swap = this.heap[i];
            this.heap[i] = this.heap[largest];
            this.heap[largest] = swap;

            // Recursively heapify the affected sub-tree
            this.heapify(n, largest);
        }
    }
}