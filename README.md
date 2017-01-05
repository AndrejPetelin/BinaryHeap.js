A binary heap implementation using an array to store data.

- install with: npm install binary_heap

The binary heap is an efficient data structure that keeps the highest/lowest element at the top. push and pop have a time complexity of O(n*log(n)).

By default, BinaryHeap will maintain the lowest number at the "top" by default. Provide an alternate predicate/compare function to sort in different order or according to different criteria.


compareFunc should return true or false, according to how you wish the elements to be ordered, by default true is returned if x is smaller than y according to less than operator.

Functions:
 - .push(elt): insert single element into BinaryHeap.
    Asymptotic complexity O(log(n)) where n is current size of data on the heap

 - .pop(): retrieve single element from the top of the BinaryHeap.
    Asymptotic complexity O(log(n)) where n is current size of data on the heap

 - .pushArray(arr): inserts array arr one element at a time into BinaryHeap using the .push() function.
    Asymptotic complexity O(n * log(m)) where n is size of _data and m is the size of array passed as argument to function.

 - .popArray(n): retrieves n elements from the heap in order and returns them as an array. The argument n should be an integer, if it's left blank you're essentially performing heapsort as the entire heap gets returned in sorted order as an array.
    Asymptotic complexity O(n * log(m)) where n is the number of elements you're retrieving and m is the size of the heap

- .peek(): returns a deep copy of the top element of the heap. The returned element can safely be modified without affecting the stability of the binary heap.
   Asymptotic complexity O(1).
   
- .peek_unsafe(): same as peek() but does not deep-copy. Use when deep-copy doesn't work or recursion for cloning would be too deep but ensure you don't modify returned objects.

- .peekArray(n): returns an array of n deep-copied elements from the heap. The function does not affect the heap, nor does modifying the elements of the returned array.
   Asymptotic complexity O(n * log(n)) where n is the number of elements being retrieved.
   
- .peekArray_unsafe(n): same as peekArray(n) but does not deep-copy. Use when deep-copy doesn't work or recursion for cloning would be too deep but ensure you don't modify returned objects.

- .size(): returns the number of elements on the heap. Constant time.

- .empty(): returns true when the heap is empty. Constant time.

- functions starting with _ and _data should not be accessed. They're there for internal book-keeping, storing data, swaps etc.
