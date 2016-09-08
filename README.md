# BinaryHeap.js
A JavaScript binary heap module.

A binary heap implementation using an array.
The binary heap is an efficient data structure that keeps the highest/lowest element at the top. push and pop have a time complexity of O(n*log(n)).

By default, BinaryHeap will maintain the lowest number at the "top" by default. Provide an alternate predicate/compare function to sort in different order or according to different criteria.


BinaryHeapUtil.js is a module containing two functions.

heapify() takes an array as argument and creates a new binary heap from it.
heapsort() takes an array as argument, uses heapify() to create a binary heap, then loops through the heap, popping off elements one at a time and storing them in the array it then returns.
