class MinHeap {
    constructor() {
        this.heap = [];
    }

    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    getLeftChildIndex(index) {
        return 2 * index + 1;
    }

    getRightChildIndex(index) {
        return 2 * index + 2;
    }

    swap(index1, index2) {
        const temp = this.heap[index1];
        this.heap[index1] = this.heap[index2];
        this.heap[index2] = temp;
    }

    insert(room) {
        this.heap.push(room);
        this.heapifyUp(this.heap.length - 1);
    }

    heapifyUp(index) {
        while (index > 0) {
            const parentIndex = this.getParentIndex(index);
            
            if (this.heap[parentIndex].lastCheckOut > this.heap[index].lastCheckOut) {
                this.swap(index, parentIndex);
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    heapifyDown(index) {
        let minIndex = index;
        const length = this.heap.length;

        while (true) {
            const leftChild = this.getLeftChildIndex(index);
            const rightChild = this.getRightChildIndex(index);

            if (leftChild < length && this.heap[leftChild].lastCheckOut < this.heap[minIndex].lastCheckOut) {
                minIndex = leftChild;
            }

            if (rightChild < length && this.heap[rightChild].lastCheckOut < this.heap[minIndex].lastCheckOut) {
                minIndex = rightChild;
            }

            if (minIndex === index) {
                break;
            }

            this.swap(index, minIndex);
            index = minIndex;
        }
    }

    peek() {
        if (this.heap.length === 0) {
            return null;
        }
        return this.heap[0];
    }

    updateRoot(newCheckOut) {
        if (this.heap.length > 0) {
            this.heap[0].lastCheckOut = newCheckOut;
            this.heapifyDown(0);
        }
    }

    size() {
        return this.heap.length;
    }
}
