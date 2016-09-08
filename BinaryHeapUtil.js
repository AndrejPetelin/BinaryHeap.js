const BinaryHeap = require('./BinaryHeap');

module.exports = {
    heapify: function(arr, compareFunc = null) {
        var ret = new BinaryHeap(compareFunc);
        ret.pushArray(arr);
        return ret;
    },

    heapsort: function(data) {
        var heap = this.heapify(data);
        var ret = [];
        for (var i = 0; i < data.length; ++i) {
            ret.push(heap.pop());
        }
        return ret;
    }
};
