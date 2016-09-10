const BinaryHeap = require('./BinaryHeap');

module.exports = {
    heapify: function(arr, compareFunc = null) {
        var ret = new BinaryHeap(compareFunc);
        ret.pushArray(arr);
        return ret;
    },

    heapsort: function(data) {
        var heap = this.heapify(data);
        return heap.popArray(); // utility member function of BinaryHeap, returns a sorted array 
    }
};