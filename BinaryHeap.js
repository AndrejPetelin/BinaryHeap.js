//=============================================================================
//
// PriorityQueue.js - a priority queue/binary heap implementation
// by Andrej Petelin @ MedMee
// 
// A data structure with O(log(n)) insertion and removal "from the top" that
// maintains the minimum (or maximum) element at the beginning of the array.
// By default, the smallest element is at the top of the heap. In order to keep
// maximum at the top or to compare by a certain value in a JSON list or the
// like you must provide the appropriate predicate function. 
//
//=============================================================================


function BinaryHeap(compareFunc) {
    this.data = []; // this is where the data goes

    // compareFunc is the function that allows determining the order of 
    if (!compareFunc) {
        // default comparison function
        this.compareFunc = function(x, y) {
            return x < y
        };
    } else this.compareFunc = compareFunc; // user defined comparison function
};

BinaryHeap.prototype = {

    //=========================================================================
    // INTERFACE FUNCTIONS
    //=========================================================================

    //-------------------------------------------------------------------------
    // push(): insert element elt into heap
    //-------------------------------------------------------------------------
    push: function(elt) {
        // add elt to the back
        this.data.push(elt);
        // move up to its rightful position
        this.upHeap();
    },

    //-------------------------------------------------------------------------
    // pop(): retrieve top element from the heap
    //-------------------------------------------------------------------------
    pop: function() {
        var ret = this.data[0];
        this.downHeap();
        // return old top of the heap
        return ret;
    },

    //-------------------------------------------------------------------------
    // pushArray(arr): insert array arr into the heap
    //      convenience function, iterates through argument array calling
    //      push on each element
    //-------------------------------------------------------------------------
    pushArray: function(arr) {
        for (i in arr) {
            this.push(arr[i]);
        }
    },


    //-------------------------------------------------------------------------
    // size(): returns number of elements. Use this instead of data.length 
    //-------------------------------------------------------------------------
    size: function() {
        return this.data.length;
    },


    //=========================================================================
    // HELPER FUNCTIONS
    //=========================================================================

    //-------------------------------------------------------------------------
    // upHeap(): moves the tail element into its rightful position
    //      called from push() after insertion of element
    //      starting with last element in data (newly pushed element) find
    //      parent's index and compare elt with its parent. If true (by
    //      default: if data[index] < data[parent]) swap elements at index,
    //      parent, otherwise we're done.
    //-------------------------------------------------------------------------
    upHeap: function() {
        var index = this.size() - 1; // last element of the heap
        var comp = this.compareFunc; // comparison function

        while (index > 0) {
            var parent = this.findParent(index);
            // swap if comparison holds
            if (comp(this.data[index], this.data[parent])) {
                this.swapAt(index, parent);
                index = parent; // move to next index
            } else break;
        }
    },

    downHeap: function() {
        var index = 0;
        var comp = this.compareFunc;

        // put top element to the end
        this.swapAt(index, this.size() - 1);
        this.data.pop();

        while (index < this.size()) {
            var child = this.findMinChild(index);

            // if data[minChild] is smaller than data[index] we swap,
            // otherwise we're done 
            if (comp(this.data[child], this.data[index])) {
                this.swapAt(child, index);
                index = child;
            } else break;
        }
    },


    //-------------------------------------------------------------------------
    // findParent(n): find index of parent of element at index n.
    //-------------------------------------------------------------------------
    findParent: function(n) {
        return Math.floor((n + 1) / 2) - 1; // integer division, JS-style
    },


    //-------------------------------------------------------------------------
    // findChildren(n): return index of the "smaller" child of nth element.
    //-------------------------------------------------------------------------
    findMinChild: function(n) {
        var childR = (n + 1) * 2;
        var childL = childR - 1;
        if (this.compareFunc(this.data[childR], this.data[childL])) return childR;
        return childL;
    },

    //-------------------------------------------------------------------------
    // swapAt(x, y): swap elements at indices x and y in data.
    //-------------------------------------------------------------------------
    swapAt: function(x, y) {
        var temp = this.data[x];
        this.data[x] = this.data[y];
        this.data[y] = temp;
    },

};

module.exports = BinaryHeap;