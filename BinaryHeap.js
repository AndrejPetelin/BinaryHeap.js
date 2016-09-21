//=============================================================================
//
// BinaryHeap.js - a binary heap implementation
// by Andrej Petelin @ MedMee
// 
// A data structure with O(log(n)) insertion and removal "from the top" that
// maintains the minimum (or maximum) element at the beginning of the array.
// By default, the smallest element is at the top of the heap. In order to keep
// maximum at the top or to compare by a certain value in a JSON list or the
// like you must provide the appropriate predicate function.
//
// compareFunc should return true or false, according to how you wish the
// elements to be ordered, by default true is returned if x is smaller than y
// according to less than operator.
//
// Functions:
//  - .push(elt): insert single element into BinaryHeap.
//      Asymptotic complexity O(log(n)) where n is current size of data on the
//      heap
//
//  - .pop(): retrieve single element from the top of the BinaryHeap.
//      Asymptotic complexity O(log(n)) where n is current size of data on the
//      heap
//
//  - .pushArray(arr): inserts array arr one element at a time into BinaryHeap
//      using the .push() function.
//      Asymptotic complexity O(n * log(m)) where n is size of _data and m is 
//      the size of array passed as argument to function.
//
//  - .popArray(n): retrieves n elements from the heap in order and returns
//      them as an array. The argument n should be an integer, if it's left
//      blank you're essentially performing heapsort as the entire heap gets
//      returned in sorted order as an array.
//      Asymptotic complexity O(n * log(m)) where n is the number of elements
//      you're retrieving and m is the size of the heap
//
// - .peek(): returns a deep copy of the top element of the heap. The returned
//      element can safely be modified without affecting the stability of the
//      binary heap.
//      Asymptotic complexity O(1).
//
// - .peekArray(n): returns an array of n deep-copied elements from the heap.
//      The function does not affect the heap, nor does modifying the elements
//      of the returned array.
//      Asymptotic complexity O(n * log(n)) where n is the number of elements
//      being retrieved.
//
// - .size(): returns the number of elements on the heap. Constant time.
//
// - .empty(): returns true when the heap is empty. Constant time.
//
// - functions starting with _ and _data should not be accessed. They're there
//      for internal book-keeping, storing data, swaps etc.
//
//=============================================================================


function BinaryHeap(compareFunc = null) {
    this._data = []; // this is where the _data goes

    // compareFunc is the function that allows determining the order of 
    if (compareFunc == null) {
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
        this._data.push(elt);
        // move up to its rightful position
        this._upHeap();
    },

    //-------------------------------------------------------------------------
    // pop(): retrieve top element from the heap
    //-------------------------------------------------------------------------
    pop: function() {
        var ret = this._data[0];
        this._downHeap();
        // return old top of the heap
        return ret;
    },

    //-------------------------------------------------------------------------
    // pushArray(arr): insert array arr into the heap
    //      convenience function, iterates through argument array calling
    //      push on each element
    //-------------------------------------------------------------------------
    pushArray: function(arr) {
        for (var i = 0, len = arr.length; i < len; ++i) {
            this.push(arr[i]);
        }
    },

    //-------------------------------------------------------------------------
    // popArray(arr): remove n elements from the heap and return as Array
    //      convenience function, iterates through argument array calling
    //      pop on each element
    //-------------------------------------------------------------------------
    popArray: function(n = null) {
        // precondition - ensure size of heap isn't exceeded
        if (n != null && n > this.size()) {
            throw "binary_heap error: BinaryHeap.popArray(n) - n: " + n.toString() +
                ", exceeds binary heap of size " + this.size();
        }

        // if argument not specified pop entire heap
        if (n == null) {
            n = this.size();
        }

        // preallocate array and essentially perform heapsort
        var ret = new Array(n);
        for (var i = 0; i < n; ++i) {
            ret[i] = this.pop();
        }
        return ret;
    },

    //-------------------------------------------------------------------------
    // size(): returns number of elements. Use this instead of _data.length 
    //-------------------------------------------------------------------------
    size: function() {
        return this._data.length;
    },

    //-------------------------------------------------------------------------
    // empty(): returns true when heap is empty, false otherwise
    //-------------------------------------------------------------------------
    empty: function() {
        return this.size() == 0
    },

    //-------------------------------------------------------------------------
    // peek(): read (deep-copy) the top element of the heap without removing or
    //      modifying the heap's data
    //-------------------------------------------------------------------------
    peek: function() {
      //  return this._clone(this._data[0]);
      // parse.stringify does actually make a deep copy and it works (i think) in all data types.
      // 
      var ret = JSON.parse(JSON.stringify(this._data[0]));
      return ret;
    },


    //-------------------------------------------------------------------------
    // peekArray(): read (deep-copy) n elements of the heap in order without
    //      removing them or modifying the heap data.
    //-------------------------------------------------------------------------
    peekArray: function(n = null) {
        // if no argument provided return entire heap in sorted order
        if (n == null) {
            n = this.size();
        }

        // precondition - ensure size of heap isn't exceeded
        if (n > this.size()) {
            throw "binary_heap error: BinaryHeap.peekArray(n) - n: " + n +
                ", exceeds binary heap of size " + this.size();
        }

        //---------------------------------------------------------------------
        // here we're essentially performing a shortest path algorithm
        // minimizing over children added to the queue. The queue (binary heap) 
        // is used for always extracting the next element, which we then add to
        // the return array.

        // quick helper function to squeeze data and ID into an object that
        // holds the data and index of an element
        function pack(data, index) { return { "data": data, "index": index }; }

        // package comparison function for use in inner BinaryHeap compareFunc
        const compF = this.compareFunc;
        // queue is a BinaryHeap returning the next smallest value as data, index pair
        var queue = new BinaryHeap(function(x, y) { return compF(x["data"], y["data"]); });

        // this is where the return values go
        var ret = new Array(n);

        // count the number of elements added to the array
        var count = 0;

        // add first element
        queue.push(pack(this._data[0], 0));

        // loop until n is reached
        while (count < n && queue.empty() == false) {
            // get currently first element and enqueue its children
            var curr = queue.pop();

            // find and add children of current node 
            var iChildren = this._findChildren(curr["index"]);
            if (iChildren[0] !== null) queue.push(pack(this._data[iChildren[0]], iChildren[0]));
            if (iChildren[1] !== null) queue.push(pack(this._data[iChildren[1]], iChildren[1]));

            // recursive deep copy of actual data element, store in return array
            ret[count] = this._clone(curr["index"]);
            count++;
        }

        return ret;
    },


    //=========================================================================
    // PRIVATE HELPER FUNCTIONS
    //=========================================================================

    //-------------------------------------------------------------------------
    // _upHeap(): moves the tail element into its rightful position
    //      called from push() after insertion of element
    //      starting with last element in _data (newly pushed element) find
    //      parent's index and compare elt with its parent. If true (by
    //      default: if _data[index] < _data[parent]) swap elements at index,
    //      parent, otherwise we're done.
    //-------------------------------------------------------------------------
    _upHeap: function() {
        var index = this.size() - 1; // last element of the heap
        const comp = this.compareFunc; // comparison function

        while (index > 0) {
            var parent = this._findParent(index);
            // swap if comparison holds
            if (comp(this._data[index], this._data[parent])) {
                this._swapAt(index, parent);
                index = parent; // move to next index
            } else break;
        }
    },


    //-------------------------------------------------------------------------
    // _downHeap(): moves the head element to the end of the heap, removes it,
    //      then proceeds to reorder the elements to maintain stability of the
    //      heap.
    //------------------------------------------------------------------------- 
    _downHeap: function() {
        var index = 0;
        const comp = this.compareFunc;

        // put top element to the end
        this._swapAt(index, this.size() - 1);
        this._data.pop();

        while (index < this.size()) {
            var child = this._findMinChild(index);

            // if _data[minChild] is smaller than _data[index] we swap,
            // if child is out of range we're done  
            if (child !== null && comp(this._data[child], this._data[index])) {
                this._swapAt(child, index);
                index = child;
            } else break;
        }
    },


    //-------------------------------------------------------------------------
    // _findParent(n): find index of parent of element at index n.
    //-------------------------------------------------------------------------
    _findParent: function(n) {
        return Math.floor((n + 1) / 2) - 1; // integer division, JS-style
    },


    //-------------------------------------------------------------------------
    // _findMinChild(n): return index of the "smaller" child of nth element.
    //      returns null on out of bounds lookup
    //-------------------------------------------------------------------------
    _findMinChild: function(n) {
        var childR = (n + 1) * 2;
        var childL = childR - 1;

        // return null on first child out of bounds
        if (childL >= this.size()) return null;

        // if second child not out of bounds and it's smaller return second child
        // otherwise return first child
        if (childR < this.size() && this.compareFunc(this._data[childR], this._data[childL])) return childR;
        return childL;
    },


    //-------------------------------------------------------------------------
    // _findChildren(n): return indices of the children of nth element.
    //      returns null on out of bounds lookup
    //-------------------------------------------------------------------------
    _findChildren: function(n) {
        var childR = (n + 1) * 2;
        var childL = childR - 1;

        // set any child out of range of _data to null
        if (childR >= this.size()) childR = null;
        if (childL >= this.size()) childL = null;
        return [childL, childR];
    },


    //-------------------------------------------------------------------------
    // _swapAt(x, y): swap elements at indices x and y in _data.
    //-------------------------------------------------------------------------
    _swapAt: function(x, y) {
        var temp = this._data[x];
        this._data[x] = this._data[y];
        this._data[y] = temp;
    },


    //--------------------------------------------------------------------------
    // _clone(n): returns a deep copy of element at position n of _data.
    //      Used by peek() and peekArray() 
    //--------------------------------------------------------------------------
    _clone: function(n) {
        // if object doesn't exist
        if (this._data[n] == null) return this._data[n];

        //-------------------------------------------------
        // nested recursive clone function
        //-------------------------------------------------
        function clone(x) {
            // non-objects can just be returned
            if (typeof x != "object") return x;

            // create new instance of object ([], {})
            var ret = new x.constructor;

            // recursive calls in a loop
            for (var i in x) {
                ret[i] = clone(x[i]);
            }
            return ret;
        }
        //-------------------------------------------------

        // if the element is an object call clone function 
        // otherwise just return it
        if (this._data[n] != null && typeof(this._data[n]) == "object") {
            return clone(this._data[n]);
        } else {
            return this._data[n];
        }
    }
};

module.exports = BinaryHeap;
