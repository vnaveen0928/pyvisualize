// ============================================================================
// PyVisualize — Intermediate topic content
// ============================================================================

window.TOPICS_INTERMEDIATE = [
  {
    id: 'comprehensions',
    title: 'List / Dict / Set Comprehensions',
    group: 'Intermediate',
    explanation:
      "A comprehension builds a new collection in a single, readable line by describing the pattern of its items — 'give me x*x for every x in this range' — instead of a manual for-loop with .append() calls. The same bracket-based syntax works for lists [], sets {}, and dicts {k:v}, and you can tack an if onto the end to filter as you go.",
    diagram: {
      type: 'sequence',
      steps: [
        {
          mode: 'pipeline',
          items: [
            { id: '1', value: '1', tone: 'remove' },
            { id: '2', value: '2', tone: 'active' },
            { id: '3', value: '3', tone: 'remove' },
            { id: '4', value: '4', tone: 'active' },
            { id: '5', value: '5', tone: 'remove' },
          ],
          fnLabel: 'if x % 2 == 0',
          resultItems: [],
          note: 'nums = [1,2,3,4,5]. The filter "if x % 2 == 0" keeps only 2 and 4; odd numbers are dropped immediately, before any squaring happens.',
        },
        {
          mode: 'pipeline',
          items: [{ id: '2', value: '2' }, { id: '4', value: '4' }],
          fnLabel: 'x * x',
          resultItems: [{ id: 'r4', value: '4' }, { id: 'r16', value: '16' }],
          note: 'Each surviving item is transformed by x * x: 2 -> 4, 4 -> 16.',
        },
        {
          mode: 'pipeline',
          items: [{ id: '2', value: '2' }, { id: '4', value: '4' }],
          fnLabel: 'x*x for x in nums if x%2==0',
          resultItems: [{ id: 'r4', value: '4' }, { id: 'r16', value: '16' }],
          note: 'squares = [4, 16] — the entire loop-filter-transform pipeline happened in a single expression.',
        },
      ],
    },
    code: `nums = [1, 2, 3, 4, 5]

squares = [x * x for x in nums if x % 2 == 0]
print(squares)              # [4, 16]  (list comprehension)

square_map = {x: x * x for x in nums}
print(square_map)            # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}  (dict comprehension)

unique_lengths = {len(w) for w in ["hi", "bye", "yo", "ok"]}
print(unique_lengths)         # {2, 3}  (set comprehension)`,
    playgroundCode: `nums = [1, 2, 3, 4, 5]
squares = [x * x for x in nums if x % 2 == 0]
print(squares)

square_map = {x: x * x for x in nums}
print(square_map)

unique_lengths = {len(w) for w in ["hi", "bye", "yo", "ok"]}
print(unique_lengths)`,
    challenge: {
      prompt: 'Given words = ["apple", "kiwi", "fig", "banana"], build a list of only the words longer than 3 letters, in uppercase, using one list comprehension.',
      hint: 'Combine a transform (w.upper()) with a filter (if len(w) > 3).',
      solution: `words = ["apple", "kiwi", "fig", "banana"]
result = [w.upper() for w in words if len(w) > 3]
print(result)  # ['APPLE', 'KIWI', 'BANANA']`,
    },
    mistakes: [
      "Nesting comprehensions too deeply makes them harder to read than the equivalent for-loop — if it doesn't fit on one clear line, use a regular loop instead.",
      'The filter if goes at the END for filtering; a conditional EXPRESSION (ternary) goes in the middle: [x if x>0 else 0 for x in nums] is different from [x for x in nums if x>0].',
      'A comprehension builds the ENTIRE collection in memory immediately — for huge or infinite sequences, prefer a generator expression (x for x in nums) instead.',
    ],
  },

  {
    id: 'lambda',
    title: 'Lambda Functions',
    group: 'Intermediate',
    explanation:
      "A lambda is a small, anonymous function written as a single expression — useful exactly when you need a quick throwaway function to pass somewhere else, like a sort key, and don't want to bother naming it with def. lambda x: x * 2 means the same thing as a tiny function that takes x and returns x * 2 — nothing more, no statements, just one expression.",
    diagram: {
      type: 'trace',
      code: 'double = lambda x: x * 2\nresult = double(5)',
      steps: [
        { activeLine: 0, vars: {}, output: [], note: 'lambda x: x * 2 creates an unnamed function object — like a tiny def, just without a name, and the expression\'s value IS the return value.' },
        { activeLine: 0, vars: { double: '<function>' }, output: [], note: 'double now refers to that function object.' },
        { activeLine: 1, vars: { double: '<function>' }, output: [], note: 'double(5) calls it with x = 5.' },
        { activeLine: 1, vars: { double: '<function>', result: 10 }, output: [], note: 'x * 2 evaluates to 10 — that value is returned automatically, with no return keyword.' },
      ],
    },
    code: `double = lambda x: x * 2
print(double(5))               # 10

# Lambdas shine as throwaway functions passed to other functions:
pairs = [(1, "b"), (2, "a"), (3, "c")]
pairs.sort(key=lambda p: p[1])   # sort by the second element
print(pairs)                      # [(2, 'a'), (1, 'b'), (3, 'c')]`,
    playgroundCode: `double = lambda x: x * 2
print(double(5))

pairs = [(1, "b"), (2, "a"), (3, "c")]
pairs.sort(key=lambda p: p[1])
print(pairs)`,
    challenge: {
      prompt: "Sort this list of dicts by 'age' ascending using sorted() and a lambda key: people = [{'name':'Al','age':40},{'name':'Bo','age':25}]",
      hint: "sorted(people, key=lambda p: p['age'])",
      solution: `people = [{'name': 'Al', 'age': 40}, {'name': 'Bo', 'age': 25}]
result = sorted(people, key=lambda p: p['age'])
print(result)`,
    },
    mistakes: [
      'A lambda body can only be a single EXPRESSION — no assignments, no loops, no multiple statements; use a normal def function if you need those.',
      'Overusing lambdas for anything beyond a quick one-off makes code harder to read — a named def is often clearer once the logic grows past one line.',
      'Assigning a lambda to a variable (f = lambda x: x) works but goes against PEP 8 style guidance — prefer def f(x): return x when you are naming it anyway.',
    ],
  },

  {
    id: 'map-filter-reduce',
    title: 'map / filter / reduce',
    group: 'Intermediate',
    explanation:
      'map(), filter(), and reduce() are the classic functional-programming trio for working with sequences: map() transforms every item through a function, filter() keeps only the items a function approves of, and reduce() folds the whole sequence down into a single accumulated value. Comprehensions can often replace map()/filter(), but reduce() (from functools) is still the cleanest way to combine everything into one result.',
    diagram: {
      type: 'sequence',
      steps: [
        {
          mode: 'pipeline',
          items: [{ id: '1', value: '1' }, { id: '2', value: '2' }, { id: '3', value: '3' }, { id: '4', value: '4' }],
          fnLabel: 'map(lambda x: x*10, nums)',
          resultItems: [{ id: 'a', value: '10' }, { id: 'b', value: '20' }, { id: 'c', value: '30' }, { id: 'd', value: '40' }],
          note: 'map() applies the function to EVERY item, producing a new (lazy) sequence — here shown materialized as [10, 20, 30, 40].',
        },
        {
          mode: 'pipeline',
          items: [{ id: 'a', value: '10', tone: 'remove' }, { id: 'b', value: '20' }, { id: 'c', value: '30' }, { id: 'd', value: '40' }],
          fnLabel: 'filter(lambda x: x > 15, doubled)',
          resultItems: [{ id: 'b2', value: '20' }, { id: 'c2', value: '30' }, { id: 'd2', value: '40' }],
          note: 'filter() keeps only items where the function returns True; 10 fails the test and is dropped.',
        },
        {
          mode: 'pipeline',
          items: [{ id: 'b3', value: '20' }, { id: 'c3', value: '30' }, { id: 'd3', value: '40' }],
          fnLabel: 'reduce(lambda a,b: a+b, big)',
          resultItems: [{ id: 'total', value: '90' }],
          note: 'reduce() combines the sequence pairwise into a single value: (20+30)=50, then (50+40)=90.',
        },
      ],
    },
    code: `from functools import reduce

nums = [1, 2, 3, 4]

doubled = list(map(lambda x: x * 10, nums))
print(doubled)                       # [10, 20, 30, 40]

big = list(filter(lambda x: x > 15, doubled))
print(big)                            # [20, 30, 40]

total = reduce(lambda a, b: a + b, big)
print(total)                           # 90

# The comprehension equivalent of map+filter (often preferred):
same = [x for x in doubled if x > 15]
print(same)                             # [20, 30, 40]`,
    playgroundCode: `from functools import reduce

nums = [1, 2, 3, 4]
doubled = list(map(lambda x: x * 10, nums))
print(doubled)

big = list(filter(lambda x: x > 15, doubled))
print(big)

total = reduce(lambda a, b: a + b, big)
print(total)`,
    challenge: {
      prompt: 'Use map() and a lambda to convert celsius = [0, 20, 37, 100] to Fahrenheit (F = C * 9/5 + 32), then print the list.',
      hint: 'list(map(lambda c: c * 9/5 + 32, celsius))',
      solution: `celsius = [0, 20, 37, 100]
fahrenheit = list(map(lambda c: c * 9 / 5 + 32, celsius))
print(fahrenheit)`,
    },
    mistakes: [
      'map() and filter() return lazy ITERATORS in Python 3, not lists — print(map(...)) shows a <map object>; wrap it in list(...) to see the values.',
      "reduce() must be imported from functools — it isn't a builtin anymore in Python 3.",
      'For simple cases a list comprehension is usually more readable (and often faster) than map()/filter() with a lambda — reach for comprehensions first.',
    ],
  },

  {
    id: 'exception-handling',
    title: 'Exception Handling',
    group: 'Intermediate',
    explanation:
      'Exceptions are how Python signals "something went wrong here" without crashing the whole program: you wrap risky code in try, catch specific problems in except, and use finally for cleanup that must run no matter what happened. Catching exceptions lets your program recover gracefully instead of dying on the first bad input.',
    diagram: {
      type: 'flow',
      steps: [
        {
          nodes: [
            { id: 'start', label: 'safe_divide(5, 0)', x: 50, y: 6, shape: 'start' },
            { id: 'try', label: 'a / b', x: 50, y: 26, shape: 'process' },
            { id: 'check', label: 'exception raised?', x: 50, y: 46, shape: 'decision' },
            { id: 'except', label: 'except: print + None', x: 85, y: 46, shape: 'process' },
            { id: 'ok', label: '(no error)', x: 50, y: 66, shape: 'process' },
            { id: 'finally', label: 'finally: print "Done"', x: 50, y: 84, shape: 'process' },
            { id: 'end', label: 'return result', x: 50, y: 98, shape: 'end' },
          ],
          edges: [
            { from: 'start', to: 'try' },
            { from: 'try', to: 'check' },
            { from: 'check', to: 'except', label: 'raised' },
            { from: 'check', to: 'ok', label: 'no error' },
            { from: 'except', to: 'finally' },
            { from: 'ok', to: 'finally' },
            { from: 'finally', to: 'end' },
          ],
          note: 'Calling safe_divide(5, 0). Python enters the try block.',
        },
        {
          nodes: [
            { id: 'start', label: 'safe_divide(5, 0)', x: 50, y: 6, shape: 'start' },
            { id: 'try', label: 'a / b', x: 50, y: 26, shape: 'process', active: true },
            { id: 'check', label: 'exception raised?', x: 50, y: 46, shape: 'decision' },
            { id: 'except', label: 'except: print + None', x: 85, y: 46, shape: 'process' },
            { id: 'ok', label: '(no error)', x: 50, y: 66, shape: 'process' },
            { id: 'finally', label: 'finally: print "Done"', x: 50, y: 84, shape: 'process' },
            { id: 'end', label: 'return result', x: 50, y: 98, shape: 'end' },
          ],
          edges: [
            { from: 'start', to: 'try', active: true },
            { from: 'try', to: 'check' },
            { from: 'check', to: 'except', label: 'raised' },
            { from: 'check', to: 'ok', label: 'no error' },
            { from: 'except', to: 'finally' },
            { from: 'ok', to: 'finally' },
            { from: 'finally', to: 'end' },
          ],
          note: 'result = a / b runs: 5 / 0 raises a ZeroDivisionError immediately.',
        },
        {
          nodes: [
            { id: 'start', label: 'safe_divide(5, 0)', x: 50, y: 6, shape: 'start' },
            { id: 'try', label: 'a / b', x: 50, y: 26, shape: 'process' },
            { id: 'check', label: 'exception raised?', x: 50, y: 46, shape: 'decision', active: true },
            { id: 'except', label: 'except: print + None', x: 85, y: 46, shape: 'process' },
            { id: 'ok', label: '(no error)', x: 50, y: 66, shape: 'process' },
            { id: 'finally', label: 'finally: print "Done"', x: 50, y: 84, shape: 'process' },
            { id: 'end', label: 'return result', x: 50, y: 98, shape: 'end' },
          ],
          edges: [
            { from: 'start', to: 'try' },
            { from: 'try', to: 'check', active: true },
            { from: 'check', to: 'except', label: 'raised' },
            { from: 'check', to: 'ok', label: 'no error' },
            { from: 'except', to: 'finally' },
            { from: 'ok', to: 'finally' },
            { from: 'finally', to: 'end' },
          ],
          note: 'Python looks for a matching except clause — ZeroDivisionError matches exactly.',
        },
        {
          nodes: [
            { id: 'start', label: 'safe_divide(5, 0)', x: 50, y: 6, shape: 'start' },
            { id: 'try', label: 'a / b', x: 50, y: 26, shape: 'process' },
            { id: 'check', label: 'exception raised?', x: 50, y: 46, shape: 'decision' },
            { id: 'except', label: 'except: print + None', x: 85, y: 46, shape: 'process', active: true },
            { id: 'ok', label: '(no error)', x: 50, y: 66, shape: 'process' },
            { id: 'finally', label: 'finally: print "Done"', x: 50, y: 84, shape: 'process' },
            { id: 'end', label: 'return result', x: 50, y: 98, shape: 'end' },
          ],
          edges: [
            { from: 'start', to: 'try' },
            { from: 'try', to: 'check' },
            { from: 'check', to: 'except', label: 'raised', active: true },
            { from: 'check', to: 'ok', label: 'no error' },
            { from: 'except', to: 'finally' },
            { from: 'ok', to: 'finally' },
            { from: 'finally', to: 'end' },
          ],
          note: 'The except block runs: it prints a message and sets result = None. The exception is now HANDLED — the program keeps running.',
        },
        {
          nodes: [
            { id: 'start', label: 'safe_divide(5, 0)', x: 50, y: 6, shape: 'start' },
            { id: 'try', label: 'a / b', x: 50, y: 26, shape: 'process' },
            { id: 'check', label: 'exception raised?', x: 50, y: 46, shape: 'decision' },
            { id: 'except', label: 'except: print + None', x: 85, y: 46, shape: 'process' },
            { id: 'ok', label: '(no error)', x: 50, y: 66, shape: 'process' },
            { id: 'finally', label: 'finally: print "Done"', x: 50, y: 84, shape: 'process', active: true },
            { id: 'end', label: 'return result', x: 50, y: 98, shape: 'end' },
          ],
          edges: [
            { from: 'start', to: 'try' },
            { from: 'try', to: 'check' },
            { from: 'check', to: 'except', label: 'raised' },
            { from: 'check', to: 'ok', label: 'no error' },
            { from: 'except', to: 'finally', active: true },
            { from: 'ok', to: 'finally' },
            { from: 'finally', to: 'end' },
          ],
          note: 'finally always runs next, whether or not an exception happened — perfect for cleanup like closing a file.',
        },
        {
          nodes: [
            { id: 'start', label: 'safe_divide(5, 0)', x: 50, y: 6, shape: 'start' },
            { id: 'try', label: 'a / b', x: 50, y: 26, shape: 'process' },
            { id: 'check', label: 'exception raised?', x: 50, y: 46, shape: 'decision' },
            { id: 'except', label: 'except: print + None', x: 85, y: 46, shape: 'process' },
            { id: 'ok', label: '(no error)', x: 50, y: 66, shape: 'process' },
            { id: 'finally', label: 'finally: print "Done"', x: 50, y: 84, shape: 'process' },
            { id: 'end', label: 'return None', x: 50, y: 98, shape: 'end', active: true },
          ],
          edges: [
            { from: 'start', to: 'try' },
            { from: 'try', to: 'check' },
            { from: 'check', to: 'except', label: 'raised' },
            { from: 'check', to: 'ok', label: 'no error' },
            { from: 'except', to: 'finally' },
            { from: 'ok', to: 'finally' },
            { from: 'finally', to: 'end', active: true },
          ],
          note: 'return result sends back None to the caller.',
        },
      ],
    },
    code: `def safe_divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("Can't divide by zero!")
        result = None
    finally:
        print("Done attempting division.")   # ALWAYS runs
    return result

print(safe_divide(10, 2))   # 5.0
print(safe_divide(5, 0))    # prints the message, then None

# raise lets YOU trigger an exception on purpose:
def set_age(age):
    if age < 0:
        raise ValueError("age can't be negative")
    return age`,
    playgroundCode: `def safe_divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("Can't divide by zero!")
        result = None
    finally:
        print("Done attempting division.")
    return result

print(safe_divide(10, 2))
print(safe_divide(5, 0))`,
    challenge: {
      prompt: 'Write a function parse_int(text) that tries int(text) and returns -1 if a ValueError is raised.',
      hint: 'try: return int(text) / except ValueError: return -1',
      solution: `def parse_int(text):
    try:
        return int(text)
    except ValueError:
        return -1

print(parse_int("42"))
print(parse_int("abc"))`,
    },
    mistakes: [
      'A bare except: catches EVERYTHING, including typos and Ctrl+C — always catch the specific exception type(s) you actually expect.',
      "Code in an else: block (after all excepts) only runs if NO exception occurred — it's different from just placing that code after the try block.",
      'finally runs even if the try block has a return in it — but a return inside finally itself will silently swallow any exception, which usually is not what you want.',
    ],
  },

  {
    id: 'file-io',
    title: 'File I/O',
    group: 'Intermediate',
    explanation:
      "File I/O is how your program reads from and writes to files on disk, persisting data beyond the program's own runtime. You open() a file to get a handle, read or write through that handle, and — critically — close it when you're done so the operating system flushes your changes and releases the file; the with statement does that closing for you automatically.",
    diagram: {
      type: 'flow',
      steps: [
        {
          nodes: [
            { id: 'p', label: 'program', x: 4, y: 50, shape: 'start' },
            { id: 'open', label: 'open("notes.txt","w")', x: 24, y: 50, shape: 'process' },
            { id: 'handle', label: 'file handle', x: 46, y: 50, shape: 'process' },
            { id: 'write', label: 'f.write("Hi")', x: 68, y: 50, shape: 'process' },
            { id: 'close', label: 'f.close()', x: 88, y: 50, shape: 'process' },
            { id: 'disk', label: 'disk', x: 98, y: 50, shape: 'end' },
          ],
          edges: [
            { from: 'p', to: 'open' },
            { from: 'open', to: 'handle' },
            { from: 'handle', to: 'write' },
            { from: 'write', to: 'close' },
            { from: 'close', to: 'disk' },
          ],
          note: 'Your program wants to save some text to disk.',
        },
        {
          nodes: [
            { id: 'p', label: 'program', x: 4, y: 50, shape: 'start' },
            { id: 'open', label: 'open("notes.txt","w")', x: 24, y: 50, shape: 'process', active: true },
            { id: 'handle', label: 'file handle', x: 46, y: 50, shape: 'process' },
            { id: 'write', label: 'f.write("Hi")', x: 68, y: 50, shape: 'process' },
            { id: 'close', label: 'f.close()', x: 88, y: 50, shape: 'process' },
            { id: 'disk', label: 'disk', x: 98, y: 50, shape: 'end' },
          ],
          edges: [
            { from: 'p', to: 'open', active: true },
            { from: 'open', to: 'handle' },
            { from: 'handle', to: 'write' },
            { from: 'write', to: 'close' },
            { from: 'close', to: 'disk' },
          ],
          note: 'open("notes.txt", "w") asks the OS for a file handle in "write" mode — this creates the file if it does not exist yet.',
        },
        {
          nodes: [
            { id: 'p', label: 'program', x: 4, y: 50, shape: 'start' },
            { id: 'open', label: 'open("notes.txt","w")', x: 24, y: 50, shape: 'process' },
            { id: 'handle', label: 'file handle (f)', x: 46, y: 50, shape: 'process', active: true },
            { id: 'write', label: 'f.write("Hi")', x: 68, y: 50, shape: 'process' },
            { id: 'close', label: 'f.close()', x: 88, y: 50, shape: 'process' },
            { id: 'disk', label: 'disk', x: 98, y: 50, shape: 'end' },
          ],
          edges: [
            { from: 'p', to: 'open' },
            { from: 'open', to: 'handle', active: true },
            { from: 'handle', to: 'write' },
            { from: 'write', to: 'close' },
            { from: 'close', to: 'disk' },
          ],
          note: 'A file object (f) is returned — every read or write goes through this handle, not the file directly.',
        },
        {
          nodes: [
            { id: 'p', label: 'program', x: 4, y: 50, shape: 'start' },
            { id: 'open', label: 'open("notes.txt","w")', x: 24, y: 50, shape: 'process' },
            { id: 'handle', label: 'file handle (f)', x: 46, y: 50, shape: 'process' },
            { id: 'write', label: 'f.write("Hi")', x: 68, y: 50, shape: 'process', active: true },
            { id: 'close', label: 'f.close()', x: 88, y: 50, shape: 'process' },
            { id: 'disk', label: 'disk', x: 98, y: 50, shape: 'end' },
          ],
          edges: [
            { from: 'p', to: 'open' },
            { from: 'open', to: 'handle' },
            { from: 'handle', to: 'write', active: true },
            { from: 'write', to: 'close' },
            { from: 'close', to: 'disk' },
          ],
          note: 'f.write("Hi") sends text into an internal buffer tied to the handle — it may not be safely on disk yet!',
        },
        {
          nodes: [
            { id: 'p', label: 'program', x: 4, y: 50, shape: 'start' },
            { id: 'open', label: 'open("notes.txt","w")', x: 24, y: 50, shape: 'process' },
            { id: 'handle', label: 'file handle (f)', x: 46, y: 50, shape: 'process' },
            { id: 'write', label: 'f.write("Hi")', x: 68, y: 50, shape: 'process' },
            { id: 'close', label: 'f.close()', x: 88, y: 50, shape: 'process', active: true },
            { id: 'disk', label: 'disk', x: 98, y: 50, shape: 'end' },
          ],
          edges: [
            { from: 'p', to: 'open' },
            { from: 'open', to: 'handle' },
            { from: 'handle', to: 'write' },
            { from: 'write', to: 'close', active: true },
            { from: 'close', to: 'disk' },
          ],
          note: 'f.close() flushes the buffer to disk and releases the handle. Forgetting this can mean your data never actually gets saved.',
        },
        {
          nodes: [
            { id: 'p', label: 'program', x: 4, y: 50, shape: 'start' },
            { id: 'open', label: 'open("notes.txt","w")', x: 24, y: 50, shape: 'process' },
            { id: 'handle', label: 'file handle (f)', x: 46, y: 50, shape: 'process' },
            { id: 'write', label: 'f.write("Hi")', x: 68, y: 50, shape: 'process' },
            { id: 'close', label: 'f.close()', x: 88, y: 50, shape: 'process' },
            { id: 'disk', label: 'saved!', x: 98, y: 50, shape: 'end', active: true },
          ],
          edges: [
            { from: 'p', to: 'open' },
            { from: 'open', to: 'handle' },
            { from: 'handle', to: 'write' },
            { from: 'write', to: 'close' },
            { from: 'close', to: 'disk', active: true },
          ],
          note: '"with open(...) as f:" does exactly this open -> use -> close sequence for you automatically, even if an error happens in between.',
        },
      ],
    },
    code: `# Writing to a file (the "with" block auto-closes it for you):
with open("notes.txt", "w") as f:
    f.write("Hello, file!\\n")
    f.write("Second line.\\n")
# f is automatically closed here, even if an error happened above

# Reading it back:
with open("notes.txt", "r") as f:
    contents = f.read()
print(contents)

# Reading line by line is memory-friendly for big files:
with open("notes.txt", "r") as f:
    for line in f:
        print("line:", line.strip())`,
    playgroundCode: `with open("notes.txt", "w") as f:
    f.write("Hello, file!\\n")
    f.write("Second line.\\n")

with open("notes.txt", "r") as f:
    print(f.read())

with open("notes.txt", "r") as f:
    for line in f:
        print("line:", line.strip())`,
    challenge: {
      prompt: 'Write the numbers 1 to 5 to a file called nums.txt, one per line, then read it back and print the sum.',
      hint: 'Use with open(...) as f: for writing, then reopen to read and sum the lines.',
      solution: `with open("nums.txt", "w") as f:
    for n in range(1, 6):
        f.write(str(n) + "\\n")

with open("nums.txt") as f:
    total = sum(int(line) for line in f)
print(total)  # 15`,
    },
    mistakes: [
      "Forgetting to close a file (or not using with) can leave data stuck in a buffer and never written to disk, especially if the program crashes first.",
      'Opening in the wrong mode: "w" truncates (erases!) an existing file before writing; use "a" to append instead if you want to keep existing content.',
      'Reading a huge file entirely into memory with .read() when you only need it line by line — iterate with "for line in f:" instead to stay memory-efficient.',
    ],
  },

  {
    id: 'modules-packages',
    title: 'Modules & Packages',
    group: 'Intermediate',
    explanation:
      "A module is just a single .py file full of reusable code, and a package is a folder of modules grouped together. import pulls a module's names into your program so you can reuse functions and classes someone already wrote — including the huge standard library that ships with Python itself.",
    diagram: {
      type: 'tree',
      steps: [
        {
          nodes: [
            { id: 'script', label: 'your_script.py', x: 50, y: 8 },
            { id: 'pkg', label: 'myapp/ (package)', x: 50, y: 34 },
            { id: 'utils', label: 'utils.py', x: 22, y: 62, sub: 'def helper()' },
            { id: 'models', label: 'models/ (subpackage)', x: 78, y: 62 },
            { id: 'user', label: 'user.py', x: 78, y: 88, sub: 'class User' },
          ],
          edges: [
            { from: 'script', to: 'pkg' },
            { from: 'pkg', to: 'utils' },
            { from: 'pkg', to: 'models' },
            { from: 'models', to: 'user' },
          ],
          note: 'A package is just a folder of modules. myapp/ contains utils.py directly, plus a models/ subpackage with user.py inside.',
        },
        {
          nodes: [
            { id: 'script', label: 'your_script.py', x: 50, y: 8, tone: 'active' },
            { id: 'pkg', label: 'myapp/ (package)', x: 50, y: 34, tone: 'active' },
            { id: 'utils', label: 'utils.py', x: 22, y: 62, sub: 'def helper()' },
            { id: 'models', label: 'models/ (subpackage)', x: 78, y: 62 },
            { id: 'user', label: 'user.py', x: 78, y: 88, sub: 'class User' },
          ],
          edges: [
            { from: 'script', to: 'pkg', tone: 'active' },
            { from: 'pkg', to: 'utils' },
            { from: 'pkg', to: 'models' },
            { from: 'models', to: 'user' },
          ],
          note: 'your_script.py runs: "from myapp.models.user import User".',
        },
        {
          nodes: [
            { id: 'script', label: 'your_script.py', x: 50, y: 8 },
            { id: 'pkg', label: 'myapp/ (package)', x: 50, y: 34 },
            { id: 'utils', label: 'utils.py', x: 22, y: 62, sub: 'def helper()' },
            { id: 'models', label: 'models/ (subpackage)', x: 78, y: 62, tone: 'active' },
            { id: 'user', label: 'user.py', x: 78, y: 88, sub: 'class User' },
          ],
          edges: [
            { from: 'script', to: 'pkg' },
            { from: 'pkg', to: 'utils' },
            { from: 'pkg', to: 'models', tone: 'active' },
            { from: 'models', to: 'user' },
          ],
          note: 'Python walks into the models subpackage first...',
        },
        {
          nodes: [
            { id: 'script', label: 'your_script.py', x: 50, y: 8 },
            { id: 'pkg', label: 'myapp/ (package)', x: 50, y: 34 },
            { id: 'utils', label: 'utils.py', x: 22, y: 62, sub: 'def helper()' },
            { id: 'models', label: 'models/ (subpackage)', x: 78, y: 62 },
            { id: 'user', label: 'user.py', x: 78, y: 88, sub: 'class User', tone: 'active' },
          ],
          edges: [
            { from: 'script', to: 'pkg' },
            { from: 'pkg', to: 'utils' },
            { from: 'pkg', to: 'models' },
            { from: 'models', to: 'user', tone: 'active' },
          ],
          note: '...then into user.py, where it finds the User class and binds that name into your script.',
        },
        {
          nodes: [
            { id: 'script', label: 'your_script.py', x: 50, y: 8 },
            { id: 'pkg', label: 'myapp/ (package)', x: 50, y: 34 },
            { id: 'utils', label: 'utils.py', x: 22, y: 62, sub: 'def helper()', tone: 'active' },
            { id: 'models', label: 'models/ (subpackage)', x: 78, y: 62 },
            { id: 'user', label: 'user.py', x: 78, y: 88, sub: 'class User' },
          ],
          edges: [
            { from: 'script', to: 'pkg' },
            { from: 'pkg', to: 'utils', tone: 'active' },
            { from: 'pkg', to: 'models' },
            { from: 'models', to: 'user' },
          ],
          note: 'A separate import, "from myapp.utils import helper", instead walks straight to utils.py — you only pay for what you actually import.',
        },
      ],
    },
    code: `# myapp/
#   __init__.py
#   utils.py          -> def helper(): ...
#   models/
#     __init__.py
#     user.py          -> class User: ...

from myapp.utils import helper
from myapp.models.user import User

helper()
u = User()

# The standard library is full of ready-made modules:
import math
import random
from datetime import date

print(math.sqrt(16))     # 4.0
print(random.randint(1, 6))
print(date.today())`,
    playgroundCode: `import math
import random
from datetime import date

print(math.sqrt(16))
print(random.randint(1, 6))
print(date.today())`,
    challenge: {
      prompt: 'Using the standard library, import the statistics module and print the mean of [4, 8, 15, 16, 23, 42].',
      hint: 'statistics.mean(...)',
      solution: `import statistics
nums = [4, 8, 15, 16, 23, 42]
print(statistics.mean(nums))`,
    },
    mistakes: [
      "import mypackage alone does NOT automatically give you its submodules unless __init__.py imports them — you often need import mypackage.submodule explicitly.",
      'Circular imports (module A imports B, and B imports A) cause confusing ImportErrors — move shared code into a third module both can import from.',
      "from module import * pulls in everything, including names you didn't expect, and can silently overwrite names already in your namespace — prefer explicit imports.",
    ],
  },

  {
    id: 'classes-objects',
    title: 'Classes & Objects',
    group: 'Intermediate',
    explanation:
      'A class is a blueprint describing what data (attributes) and behavior (methods) its objects will have; an object (instance) is one concrete thing built from that blueprint, with its own independent copy of the attributes. The class is the cookie cutter, each object is one cookie — same shape, but each cookie is separate dough you can decorate differently.',
    diagram: {
      type: 'tree',
      steps: [
        {
          nodes: [{ id: 'cls', label: 'Dog (blueprint)', x: 50, y: 15, sub: 'name, bark()' }],
          edges: [],
          note: 'class Dog: defines the blueprint — a name attribute and a bark() method. No actual dog exists yet.',
        },
        {
          nodes: [
            { id: 'cls', label: 'Dog (blueprint)', x: 50, y: 15, sub: 'name, bark()' },
            { id: 'rex', label: 'rex\nname="Rex"', x: 28, y: 65, tone: 'active' },
          ],
          edges: [{ from: 'cls', to: 'rex', label: 'instance of' }],
          note: 'rex = Dog("Rex") stamps out a real object with its own independent name attribute set to "Rex".',
        },
        {
          nodes: [
            { id: 'cls', label: 'Dog (blueprint)', x: 50, y: 15, sub: 'name, bark()' },
            { id: 'rex', label: 'rex\nname="Rex"', x: 28, y: 65 },
            { id: 'fido', label: 'fido\nname="Fido"', x: 72, y: 65, tone: 'active' },
          ],
          edges: [
            { from: 'cls', to: 'rex', label: 'instance of' },
            { from: 'cls', to: 'fido', label: 'instance of' },
          ],
          note: 'fido = Dog("Fido") stamps out a second, completely separate object — changing fido.name never affects rex.name.',
        },
        {
          nodes: [
            { id: 'cls', label: 'Dog (blueprint)', x: 50, y: 15, sub: 'name, bark()', tone: 'active' },
            { id: 'rex', label: 'rex.bark()', x: 28, y: 65, tone: 'active' },
            { id: 'fido', label: 'fido\nname="Fido"', x: 72, y: 65 },
          ],
          edges: [
            { from: 'cls', to: 'rex', label: 'uses shared method', tone: 'active' },
            { from: 'cls', to: 'fido', label: 'instance of' },
          ],
          note: "rex.bark() runs the SHARED bark() method defined once on the class, but it acts on rex's own data via self.",
        },
      ],
    },
    code: `class Dog:
    def __init__(self, name):   # runs automatically when you create a Dog
        self.name = name        # each instance gets its OWN name attribute

    def bark(self):
        return f"{self.name} says Woof!"

rex = Dog("Rex")
fido = Dog("Fido")

print(rex.bark())    # 'Rex says Woof!'
print(fido.bark())   # 'Fido says Woof!'
print(rex.name, fido.name)  # independent: 'Rex Fido'`,
    playgroundCode: `class Dog:
    def __init__(self, name):
        self.name = name

    def bark(self):
        return f"{self.name} says Woof!"

rex = Dog("Rex")
fido = Dog("Fido")
print(rex.bark())
print(fido.bark())`,
    challenge: {
      prompt: 'Write a class Rectangle with width and height, plus a method area() that returns width*height. Create one instance and print its area.',
      hint: '__init__(self, width, height) stores both as self attributes.',
      solution: `class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

r = Rectangle(4, 5)
print(r.area())  # 20`,
    },
    mistakes: [
      'Forgetting self as the first parameter of every instance method — Python passes the instance in automatically, but you still name a parameter to catch it.',
      'Defining an attribute directly in the class body (shared by ALL instances) when you meant an instance attribute set in __init__ — mutable class-level attributes can cause surprising shared state.',
      'Confusing the class with an instance: Dog is the blueprint, rex = Dog(...) is one instance — Dog.bark(rex) and rex.bark() do the same thing under the hood.',
    ],
  },

  {
    id: 'inheritance',
    title: 'Inheritance',
    group: 'Intermediate',
    explanation:
      "Inheritance lets a new class (the child/subclass) reuse and extend the attributes and methods of an existing class (the parent/superclass), modeling an 'is-a' relationship — a Dog IS an Animal, so it gets everything Animal already knows how to do, plus whatever extra behavior you add or override.",
    diagram: {
      type: 'tree',
      steps: [
        {
          nodes: [
            { id: 'animal', label: 'Animal', x: 50, y: 15, sub: 'speak()' },
            { id: 'dog', label: 'Dog', x: 25, y: 65 },
            { id: 'cat', label: 'Cat', x: 75, y: 65 },
          ],
          edges: [{ from: 'dog', to: 'animal' }, { from: 'cat', to: 'animal' }],
          note: 'class Animal defines speak(). Dog and Cat do not exist yet.',
        },
        {
          nodes: [
            { id: 'animal', label: 'Animal', x: 50, y: 15, sub: 'speak()' },
            { id: 'dog', label: 'Dog', x: 25, y: 65, tone: 'active' },
            { id: 'cat', label: 'Cat', x: 75, y: 65 },
          ],
          edges: [{ from: 'dog', to: 'animal', tone: 'active', label: 'is-a' }, { from: 'cat', to: 'animal' }],
          note: 'class Dog(Animal): makes Dog inherit everything Animal has — attributes, methods, all of it.',
        },
        {
          nodes: [
            { id: 'animal', label: 'Animal', x: 50, y: 15, sub: 'speak()' },
            { id: 'dog', label: 'Dog', x: 25, y: 65 },
            { id: 'cat', label: 'Cat', x: 75, y: 65, tone: 'active' },
          ],
          edges: [{ from: 'dog', to: 'animal' }, { from: 'cat', to: 'animal', tone: 'active', label: 'is-a' }],
          note: "class Cat(Animal): does the same — Dog and Cat are-a Animal, but they're independent siblings, not related to each other.",
        },
        {
          nodes: [
            { id: 'animal', label: 'Animal', x: 50, y: 15, sub: 'speak()' },
            { id: 'dog', label: 'Dog (no override)', x: 25, y: 65, tone: 'active' },
            { id: 'cat', label: 'Cat', x: 75, y: 65 },
          ],
          edges: [{ from: 'dog', to: 'animal', tone: 'active', label: 'lookup climbs up' }, { from: 'cat', to: 'animal' }],
          note: "Dog('Rex').speak() — if Dog doesn't define its own speak(), Python walks UP to Animal and uses that one instead.",
        },
        {
          nodes: [
            { id: 'animal', label: 'Animal', x: 50, y: 15, sub: 'speak()' },
            { id: 'dog', label: 'Dog (overrides speak)', x: 25, y: 65, tone: 'active' },
            { id: 'cat', label: 'Cat', x: 75, y: 65 },
          ],
          edges: [{ from: 'dog', to: 'animal' }, { from: 'cat', to: 'animal' }],
          note: "If Dog DOES define its own speak(), that version is used instead — overriding is how subclasses customize inherited behavior.",
        },
      ],
    },
    code: `class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return f"{self.name} makes a sound"

class Dog(Animal):              # Dog IS-A Animal
    def speak(self):             # override: Dog has its own version
        return f"{self.name} says Woof!"

class Cat(Animal):              # Cat IS-A Animal too
    pass                          # no override -> uses Animal's speak()

print(Dog("Rex").speak())   # 'Rex says Woof!'   (overridden)
print(Cat("Tom").speak())   # 'Tom makes a sound' (inherited as-is)

# Calling the parent's version explicitly from inside the child:
class Puppy(Dog):
    def speak(self):
        return super().speak() + " (but it's more of a yip)"`,
    playgroundCode: `class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return f"{self.name} makes a sound"

class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"

class Cat(Animal):
    pass

print(Dog("Rex").speak())
print(Cat("Tom").speak())`,
    challenge: {
      prompt: "Create a base class Shape with a method describe() returning 'I am a shape'. Create a subclass Circle that overrides describe() to return 'I am a circle'. Print both.",
      hint: 'class Circle(Shape): def describe(self): ...',
      solution: `class Shape:
    def describe(self):
        return "I am a shape"

class Circle(Shape):
    def describe(self):
        return "I am a circle"

print(Shape().describe())
print(Circle().describe())`,
    },
    mistakes: [
      "Forgetting to call super().__init__(...) in a subclass's own __init__ — the parent's setup code never runs, and expected attributes may simply be missing.",
      "Confusing 'has-a' with 'is-a': a Car HAS-A Engine (composition), it is NOT an Engine — inheritance would be the wrong tool here.",
      'Overriding a method fully replaces it by default, but the parent version still exists and is reachable via super() — you can extend behavior instead of discarding it.',
    ],
  },

  {
    id: 'polymorphism',
    title: 'Polymorphism',
    group: 'Intermediate',
    explanation:
      'Polymorphism means the same method call can behave differently depending on which actual object it is called on — you write shape.area() once, and Python figures out at runtime whether that means a Circle\'s area formula or a Square\'s, without you writing a single if/elif chain to check the type yourself.',
    diagram: {
      type: 'flow',
      steps: [
        {
          nodes: [
            { id: 'list', label: 'shapes = [Circle(3), Square(4)]', x: 50, y: 10, shape: 'start' },
            { id: 'call', label: 'shape.area()', x: 22, y: 45, shape: 'process' },
            { id: 'decision', label: 'which class?', x: 50, y: 45, shape: 'decision' },
            { id: 'circle', label: 'Circle.area() -> πr²', x: 82, y: 25, shape: 'process' },
            { id: 'square', label: 'Square.area() -> s²', x: 82, y: 65, shape: 'process' },
          ],
          edges: [
            { from: 'list', to: 'call' },
            { from: 'call', to: 'decision' },
            { from: 'decision', to: 'circle', label: 'Circle' },
            { from: 'decision', to: 'square', label: 'Square' },
          ],
          note: 'shapes = [Circle(3), Square(4)] — a mixed list. We call .area() on each without checking types ourselves.',
        },
        {
          nodes: [
            { id: 'list', label: 'shapes = [Circle(3), Square(4)]', x: 50, y: 10, shape: 'start' },
            { id: 'call', label: 'shape.area()', x: 22, y: 45, shape: 'process', active: true },
            { id: 'decision', label: 'which class?', x: 50, y: 45, shape: 'decision' },
            { id: 'circle', label: 'Circle.area() -> πr²', x: 82, y: 25, shape: 'process' },
            { id: 'square', label: 'Square.area() -> s²', x: 82, y: 65, shape: 'process' },
          ],
          edges: [
            { from: 'list', to: 'call', active: true },
            { from: 'call', to: 'decision' },
            { from: 'decision', to: 'circle', label: 'Circle' },
            { from: 'decision', to: 'square', label: 'Square' },
          ],
          note: 'for shape in shapes: shape.area() — the exact same line of code, run once per shape.',
        },
        {
          nodes: [
            { id: 'list', label: 'shapes = [Circle(3), Square(4)]', x: 50, y: 10, shape: 'start' },
            { id: 'call', label: 'shape.area()', x: 22, y: 45, shape: 'process' },
            { id: 'decision', label: 'which class?', x: 50, y: 45, shape: 'decision', active: true },
            { id: 'circle', label: 'Circle.area() -> πr²', x: 82, y: 25, shape: 'process' },
            { id: 'square', label: 'Square.area() -> s²', x: 82, y: 65, shape: 'process' },
          ],
          edges: [
            { from: 'list', to: 'call' },
            { from: 'call', to: 'decision', active: true },
            { from: 'decision', to: 'circle', label: 'Circle' },
            { from: 'decision', to: 'square', label: 'Square' },
          ],
          note: "Python looks at the ACTUAL object's class to decide which area() applies — this happens automatically at runtime.",
        },
        {
          nodes: [
            { id: 'list', label: 'shapes = [Circle(3), Square(4)]', x: 50, y: 10, shape: 'start' },
            { id: 'call', label: 'shape.area()', x: 22, y: 45, shape: 'process' },
            { id: 'decision', label: 'which class?', x: 50, y: 45, shape: 'decision' },
            { id: 'circle', label: 'Circle.area() -> πr²', x: 82, y: 25, shape: 'process', active: true },
            { id: 'square', label: 'Square.area() -> s²', x: 82, y: 65, shape: 'process' },
          ],
          edges: [
            { from: 'list', to: 'call' },
            { from: 'call', to: 'decision' },
            { from: 'decision', to: 'circle', label: 'Circle', active: true },
            { from: 'decision', to: 'square', label: 'Square' },
          ],
          note: "For the Circle instance, Circle's own area() runs: πr².",
        },
        {
          nodes: [
            { id: 'list', label: 'shapes = [Circle(3), Square(4)]', x: 50, y: 10, shape: 'start' },
            { id: 'call', label: 'shape.area()', x: 22, y: 45, shape: 'process' },
            { id: 'decision', label: 'which class?', x: 50, y: 45, shape: 'decision' },
            { id: 'circle', label: 'Circle.area() -> πr²', x: 82, y: 25, shape: 'process' },
            { id: 'square', label: 'Square.area() -> s²', x: 82, y: 65, shape: 'process', active: true },
          ],
          edges: [
            { from: 'list', to: 'call' },
            { from: 'call', to: 'decision' },
            { from: 'decision', to: 'circle', label: 'Circle' },
            { from: 'decision', to: 'square', label: 'Square', active: true },
          ],
          note: "For the Square instance, the exact same calling code instead runs Square's area(): s². No type-checking code was needed anywhere.",
        },
      ],
    },
    code: `class Circle:
    def __init__(self, r): self.r = r
    def area(self): return 3.14159 * self.r ** 2

class Square:
    def __init__(self, s): self.s = s
    def area(self): return self.s ** 2

shapes = [Circle(3), Square(4)]

for shape in shapes:
    print(shape.area())   # same call, different behavior per object
# 28.27...
# 16`,
    playgroundCode: `class Circle:
    def __init__(self, r): self.r = r
    def area(self): return 3.14159 * self.r ** 2

class Square:
    def __init__(self, s): self.s = s
    def area(self): return self.s ** 2

shapes = [Circle(3), Square(4)]
for shape in shapes:
    print(shape.area())`,
    challenge: {
      prompt: 'Add a Triangle class with base and height, area() = 0.5*base*height, and include it in the shapes loop above without changing the loop code at all.',
      hint: 'As long as Triangle has an area() method with the same name, polymorphism just works.',
      solution: `class Circle:
    def __init__(self, r): self.r = r
    def area(self): return 3.14159 * self.r ** 2

class Square:
    def __init__(self, s): self.s = s
    def area(self): return self.s ** 2

class Triangle:
    def __init__(self, base, height):
        self.base = base
        self.height = height
    def area(self):
        return 0.5 * self.base * self.height

shapes = [Circle(3), Square(4), Triangle(6, 2)]
for shape in shapes:
    print(shape.area())`,
    },
    mistakes: [
      'Writing "if isinstance(shape, Circle): ... elif isinstance(shape, Square): ..." defeats the purpose — that is exactly the branching polymorphism eliminates.',
      "Polymorphism in Python relies on 'duck typing': the objects don't need a common base class, as long as they share the method name being called.",
      'Two unrelated classes sharing a method name but meaning very different things can cause silent bugs — polymorphism assumes the shared name really means the same thing.',
    ],
  },

  {
    id: 'encapsulation',
    title: 'Encapsulation',
    group: 'Intermediate',
    explanation:
      "Encapsulation means bundling an object's data with the methods that operate on it, and controlling how outside code touches that data — like a car's dashboard hiding the engine wiring behind a speedometer you can read but not rewire. Python signals privacy by convention: a single leading underscore (_x) means 'internal, please don't touch,' and a double underscore (__x) triggers name-mangling to make accidental access even harder.",
    diagram: {
      type: 'flow',
      steps: [
        {
          nodes: [
            { id: 'out', label: 'outside code', x: 6, y: 50, shape: 'start' },
            { id: 'pub', label: 'account.balance', x: 36, y: 20, shape: 'process' },
            { id: 'prot', label: 'account._pin', x: 36, y: 50, shape: 'process' },
            { id: 'priv', label: 'account.__secret_key', x: 36, y: 80, shape: 'process' },
          ],
          edges: [{ from: 'out', to: 'pub' }, { from: 'out', to: 'prot' }, { from: 'out', to: 'priv' }],
          note: 'class BankAccount has self.balance (public), self._pin (protected by convention), and self.__secret_key (name-mangled private).',
        },
        {
          nodes: [
            { id: 'out', label: 'outside code', x: 6, y: 50, shape: 'start' },
            { id: 'pub', label: 'account.balance', x: 36, y: 20, shape: 'process', active: true },
            { id: 'prot', label: 'account._pin', x: 36, y: 50, shape: 'process' },
            { id: 'priv', label: 'account.__secret_key', x: 36, y: 80, shape: 'process' },
          ],
          edges: [{ from: 'out', to: 'pub', active: true, label: 'OK' }, { from: 'out', to: 'prot' }, { from: 'out', to: 'priv' }],
          note: "account.balance works fine from outside — nothing stops you, it's genuinely public.",
        },
        {
          nodes: [
            { id: 'out', label: 'outside code', x: 6, y: 50, shape: 'start' },
            { id: 'pub', label: 'account.balance', x: 36, y: 20, shape: 'process' },
            { id: 'prot', label: 'account._pin', x: 36, y: 50, shape: 'process', active: true },
            { id: 'priv', label: 'account.__secret_key', x: 36, y: 80, shape: 'process' },
          ],
          edges: [{ from: 'out', to: 'pub' }, { from: 'out', to: 'prot', active: true, label: 'works (discouraged)' }, { from: 'out', to: 'priv' }],
          note: "account._pin ALSO works — Python doesn't truly enforce this. The underscore is a polite warning, nothing more.",
        },
        {
          nodes: [
            { id: 'out', label: 'outside code', x: 6, y: 50, shape: 'start' },
            { id: 'pub', label: 'account.balance', x: 36, y: 20, shape: 'process' },
            { id: 'prot', label: 'account._pin', x: 36, y: 50, shape: 'process' },
            { id: 'priv', label: 'account.__secret_key', x: 36, y: 80, shape: 'process', active: true },
            { id: 'err', label: 'AttributeError!', x: 70, y: 80, shape: 'end' },
          ],
          edges: [
            { from: 'out', to: 'pub' },
            { from: 'out', to: 'prot' },
            { from: 'out', to: 'priv', active: true },
            { from: 'priv', to: 'err', active: true, label: 'blocked' },
          ],
          note: 'account.__secret_key raises an AttributeError from outside! Python secretly renamed it to _BankAccount__secret_key (name mangling).',
        },
        {
          nodes: [
            { id: 'out', label: 'outside code', x: 6, y: 50, shape: 'start' },
            { id: 'pub', label: 'account.balance', x: 36, y: 20, shape: 'process' },
            { id: 'prot', label: 'account._pin', x: 36, y: 50, shape: 'process' },
            { id: 'mangled', label: 'account._BankAccount__secret_key', x: 45, y: 80, shape: 'process', active: true },
          ],
          edges: [{ from: 'out', to: 'pub' }, { from: 'out', to: 'prot' }, { from: 'out', to: 'mangled', active: true, label: 'still technically reachable' }],
          note: "It's technically still reachable via the mangled name — encapsulation in Python is discipline and convention, not an unbreakable lock.",
        },
      ],
    },
    code: `class BankAccount:
    def __init__(self, balance):
        self.balance = balance          # public
        self._pin = "1234"              # protected (convention: leave it alone)
        self.__secret_key = "xyz"       # private (name-mangled)

    def get_secret(self):               # controlled access via a method
        return self.__secret_key

acct = BankAccount(100)
print(acct.balance)          # 100 — fine, it's public
print(acct._pin)             # "1234" — works, but you're not SUPPOSED to touch it
# print(acct.__secret_key)   # AttributeError!
print(acct._BankAccount__secret_key)   # still technically reachable...
print(acct.get_secret())               # ...but this is the intended way in`,
    playgroundCode: `class BankAccount:
    def __init__(self, balance):
        self.balance = balance
        self._pin = "1234"
        self.__secret_key = "xyz"

    def get_secret(self):
        return self.__secret_key

acct = BankAccount(100)
print(acct.balance)
print(acct._pin)
print(acct._BankAccount__secret_key)
print(acct.get_secret())`,
    challenge: {
      prompt: 'Add a method deposit(amount) to BankAccount that adds to self.balance only if amount > 0, otherwise it raises a ValueError.',
      hint: 'if amount <= 0: raise ValueError(...)',
      solution: `class BankAccount:
    def __init__(self, balance):
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("deposit must be positive")
        self.balance += amount

acct = BankAccount(100)
acct.deposit(50)
print(acct.balance)  # 150`,
    },
    mistakes: [
      'Believing a single underscore (_x) actually prevents access — it is purely a naming CONVENTION; Python enforces nothing.',
      'Forgetting that double-underscore name mangling (__x -> _ClassName__x) applies to methods too, which can confuse subclass overriding.',
      'Over-encapsulating trivial attributes with getter/setter methods out of habit — plain public attributes are idiomatic in Python unless you need real validation (then reach for @property).',
    ],
  },

  {
    id: 'dunder-methods',
    title: 'Dunder / Magic Methods',
    group: 'Intermediate',
    explanation:
      "Dunder (\"double underscore\") methods like __init__, __str__, and __add__ are hooks Python calls automatically behind the scenes when you use built-in syntax on your own objects — writing a + b secretly calls a.__add__(b), and print(obj) secretly calls obj.__str__(). Defining them lets your custom classes plug into Python's own syntax instead of needing special-case methods.",
    diagram: {
      type: 'flow',
      steps: [
        {
          nodes: [
            { id: 'expr', label: 'a + b', x: 8, y: 50, shape: 'start' },
            { id: 'lookup', label: 'looks up a.__add__', x: 38, y: 50, shape: 'process' },
            { id: 'call', label: 'a.__add__(b) runs', x: 68, y: 50, shape: 'process' },
            { id: 'result', label: 'Vector(4, 6)', x: 96, y: 50, shape: 'end' },
          ],
          edges: [{ from: 'expr', to: 'lookup' }, { from: 'lookup', to: 'call' }, { from: 'call', to: 'result' }],
          note: 'a = Vector(1,2); b = Vector(3,4); then a + b is written.',
        },
        {
          nodes: [
            { id: 'expr', label: 'a + b', x: 8, y: 50, shape: 'start' },
            { id: 'lookup', label: 'looks up a.__add__', x: 38, y: 50, shape: 'process', active: true },
            { id: 'call', label: 'a.__add__(b) runs', x: 68, y: 50, shape: 'process' },
            { id: 'result', label: 'Vector(4, 6)', x: 96, y: 50, shape: 'end' },
          ],
          edges: [{ from: 'expr', to: 'lookup', active: true }, { from: 'lookup', to: 'call' }, { from: 'call', to: 'result' }],
          note: "Python doesn't know natively how to add two Vectors — it looks for the dunder hook, a.__add__.",
        },
        {
          nodes: [
            { id: 'expr', label: 'a + b', x: 8, y: 50, shape: 'start' },
            { id: 'lookup', label: 'looks up a.__add__', x: 38, y: 50, shape: 'process' },
            { id: 'call', label: 'a.__add__(b) runs', x: 68, y: 50, shape: 'process', active: true },
            { id: 'result', label: 'Vector(4, 6)', x: 96, y: 50, shape: 'end' },
          ],
          edges: [{ from: 'expr', to: 'lookup' }, { from: 'lookup', to: 'call', active: true }, { from: 'call', to: 'result' }],
          note: 'a.__add__(b) is called automatically — this is the method YOU defined inside the Vector class.',
        },
        {
          nodes: [
            { id: 'expr', label: 'a + b', x: 8, y: 50, shape: 'start' },
            { id: 'lookup', label: 'looks up a.__add__', x: 38, y: 50, shape: 'process' },
            { id: 'call', label: 'a.__add__(b) runs', x: 68, y: 50, shape: 'process' },
            { id: 'result', label: 'Vector(4, 6)', x: 96, y: 50, shape: 'end', active: true },
          ],
          edges: [{ from: 'expr', to: 'lookup' }, { from: 'lookup', to: 'call' }, { from: 'call', to: 'result', active: true }],
          note: 'Inside __add__ you returned Vector(self.x+other.x, self.y+other.y) — so a + b becomes Vector(4, 6).',
        },
      ],
    },
    code: `class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __add__(self, other):          # powers the + operator
        return Vector(self.x + other.x, self.y + other.y)

    def __str__(self):                  # powers print() / str()
        return f"Vector({self.x}, {self.y})"

    def __eq__(self, other):            # powers ==
        return self.x == other.x and self.y == other.y

a = Vector(1, 2)
b = Vector(3, 4)
print(a + b)          # Vector(4, 6)   <- uses __add__ then __str__
print(a == Vector(1, 2))   # True      <- uses __eq__`,
    playgroundCode: `class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)
    def __str__(self):
        return f"Vector({self.x}, {self.y})"
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

a = Vector(1, 2)
b = Vector(3, 4)
print(a + b)
print(a == Vector(1, 2))`,
    challenge: {
      prompt: 'Add __len__ to Vector so that len(v) returns round(sqrt(x*x + y*y)) (its rounded magnitude).',
      hint: 'import math; def __len__(self): return round(math.hypot(self.x, self.y))',
      solution: `import math

class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __len__(self):
        return round(math.hypot(self.x, self.y))

v = Vector(3, 4)
print(len(v))  # 5`,
    },
    mistakes: [
      'Defining __eq__ without considering __hash__ — once you add __eq__, Python makes your objects unhashable by default, breaking use as set members or dict keys unless you also define __hash__.',
      'Forgetting __repr__ (used by the console/debugger/repr()) and only defining __str__ (used by print()) — __repr__ is the more important, ideally unambiguous, fallback.',
      '__add__ assuming other is always the same type — a + 5 would crash with an AttributeError unless you check the type or handle it explicitly.',
    ],
  },

  {
    id: 'iterators-iterables',
    title: 'Iterators & Iterables',
    group: 'Intermediate',
    explanation:
      "An iterable is anything you can loop over (like a list); an iterator is the object that actually keeps track of *where you are* in that loop, produced by calling iter() on an iterable. Each call to next() on an iterator hands you the next value and moves the bookmark forward, until it raises StopIteration to say 'nothing left' — this exact protocol is what powers every for loop under the hood.",
    diagram: {
      type: 'pull',
      steps: [
        { produced: [], requesting: false, note: 'nums = [10, 20, 30]; it = iter(nums) creates an iterator — a bookmark pointing just before the first item.' },
        { produced: [], requesting: true, note: 'next(it) is called, asking for the next value.' },
        { produced: [10], requesting: false, note: '10 is returned, and the bookmark moves forward.' },
        { produced: [10], requesting: true, note: 'next(it) is called again.' },
        { produced: [10, 20], requesting: false, note: '20 is returned.' },
        { produced: [10, 20], requesting: true, note: 'next(it) is called a third time.' },
        { produced: [10, 20, 30], requesting: false, note: '30 is returned — the last item in the list.' },
        { produced: [10, 20, 30], requesting: true, exhausted: true, note: 'next(it) is called once more, but nothing is left — StopIteration is raised. A for loop catches this automatically and simply ends.' },
      ],
    },
    code: `nums = [10, 20, 30]
it = iter(nums)          # get an iterator from the iterable

print(next(it))            # 10
print(next(it))            # 20
print(next(it))            # 30
# print(next(it))          # StopIteration!

# a for loop does exactly this automatically:
for n in nums:
    print(n)

# You can build your own iterable/iterator pair:
class Countdown:
    def __init__(self, start):
        self.current = start
    def __iter__(self):
        return self
    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        self.current -= 1
        return self.current + 1

for n in Countdown(3):
    print(n)     # 3 2 1`,
    playgroundCode: `nums = [10, 20, 30]
it = iter(nums)
print(next(it))
print(next(it))
print(next(it))

class Countdown:
    def __init__(self, start):
        self.current = start
    def __iter__(self):
        return self
    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        self.current -= 1
        return self.current + 1

for n in Countdown(3):
    print(n)`,
    challenge: {
      prompt: 'Manually call iter() and next() on the string "abc" three times and print each character.',
      hint: 'Strings are iterable too — it = iter("abc")',
      solution: `it = iter("abc")
print(next(it))
print(next(it))
print(next(it))`,
    },
    mistakes: [
      'Calling next() on an EXHAUSTED iterator raises StopIteration every time after — iterators are single-use; call iter() again on the original iterable to start over.',
      'Confusing an iterable with an iterator — a list is iterable but is NOT itself an iterator (it has no __next__); iter(my_list) is what gives you the iterator.',
      'Forgetting __iter__ must return an object with __next__ — the two dunder methods work together to satisfy the iterator protocol.',
    ],
  },

  {
    id: 'generators-yield',
    title: 'Generators & yield',
    group: 'Intermediate',
    explanation:
      'A generator function looks like a normal function but uses yield instead of return — each call to yield pauses the function exactly where it is, hands one value back, and waits. Nothing after the first yield runs until someone specifically asks for the next value, so generators produce huge (even infinite) sequences without ever holding them all in memory at once.',
    diagram: {
      type: 'pull',
      steps: [
        { produced: [], requesting: false, note: "gen = countdown(3) — calling a generator function doesn't run any code yet! It just creates a paused generator object." },
        { produced: [], requesting: true, note: 'next(gen) is called, asking for the first value.' },
        { produced: [3], requesting: false, note: 'The function runs until "yield n" (n=3), hands back 3, and freezes right there — n is still 3, waiting.' },
        { produced: [3], requesting: true, note: 'next(gen) is called again.' },
        { produced: [3, 2], requesting: false, note: 'Execution resumes exactly where it paused: n -= 1 (now 2), loop repeats, yield 2. Frozen again.' },
        { produced: [3, 2], requesting: true, note: 'next(gen) once more.' },
        { produced: [3, 2, 1], requesting: false, note: 'n -= 1 (now 1), yield 1. Frozen again.' },
        { produced: [3, 2, 1], requesting: true, note: 'next(gen) a fourth time.' },
        { produced: [3, 2, 1], requesting: false, exhausted: true, note: 'n -= 1 (now 0), the while condition fails, the function simply ends — which raises StopIteration, just like any exhausted iterator.' },
      ],
    },
    code: `def countdown(n):
    while n > 0:
        yield n      # pause here, hand back n
        n -= 1        # resumes from exactly here on the next next()

gen = countdown(3)     # nothing has run yet!
print(next(gen))         # 3  (runs up to the first yield)
print(next(gen))         # 2
print(next(gen))         # 1
# print(next(gen))       # StopIteration

# far more common: just loop over it directly
for n in countdown(3):
    print(n)

# generator EXPRESSION — a lazy, memory-friendly comprehension:
squares = (x * x for x in range(1_000_000))   # nothing computed yet!
print(next(squares))                             # 0, computed on demand`,
    playgroundCode: `def countdown(n):
    while n > 0:
        yield n
        n -= 1

gen = countdown(3)
print(next(gen))
print(next(gen))
print(next(gen))

for n in countdown(3):
    print(n)

squares = (x * x for x in range(10))
print(next(squares))
print(next(squares))`,
    challenge: {
      prompt: 'Write a generator function evens(limit) that yields even numbers from 0 up to (not including) limit, then collect its output into a list with list(...).',
      hint: 'yield n inside a for loop that checks n % 2 == 0',
      solution: `def evens(limit):
    for n in range(limit):
        if n % 2 == 0:
            yield n

print(list(evens(10)))  # [0, 2, 4, 6, 8]`,
    },
    mistakes: [
      "Treating a generator like a list — you can only iterate over it ONCE; after exhaustion, looping again yields nothing (call the generator function again for a fresh one).",
      "Calling the generator function itself and expecting it to run immediately — it doesn't; you get a paused generator object back, and code only executes as you pull values.",
      'Mixing return and yield carelessly — a bare return inside a generator just stops it early (raises StopIteration); it does not behave like a normal return value.',
    ],
  },

  {
    id: 'decorators',
    title: 'Decorators',
    group: 'Intermediate',
    explanation:
      "A decorator is a function that takes another function and returns a wrapped version of it, adding behavior before/after the original runs without touching its source code — like gift-wrapping a present: the present inside is untouched, but there's extra paper around it now. The @decorator syntax above a function definition is shorthand for func = decorator(func).",
    diagram: {
      type: 'wrap',
      steps: [
        { layers: [{ label: 'greet("Ava") — the call site', active: false }], note: "greet is called. But greet isn't the original function anymore — @log_calls already replaced it with wrapper." },
        { layers: [{ label: 'wrapper(*args, **kwargs)', active: true }], note: "wrapper runs first: it prints \"Calling greet\" — the decorator's own added behavior." },
        {
          layers: [{ label: 'wrapper(*args, **kwargs)', active: true }, { label: 'greet(name) — original function', active: true }],
          note: 'Inside wrapper, the ORIGINAL greet function is finally called, safely wrapped inside — this is the "box inside a box".',
        },
        {
          layers: [{ label: 'wrapper(*args, **kwargs)', active: true }, { label: 'greet(name) — original function', active: false }],
          resultLabel: '"Hi, Ava" returned to caller',
          note: 'greet returns its normal result. wrapper prints "Done" and passes that exact result back up to the caller, unchanged.',
        },
      ],
    },
    code: `def log_calls(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        result = func(*args, **kwargs)
        print("Done")
        return result
    return wrapper

@log_calls                 # same as: greet = log_calls(greet)
def greet(name):
    return f"Hi, {name}"

print(greet("Ava"))
# Calling greet
# Done
# Hi, Ava`,
    playgroundCode: `def log_calls(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        result = func(*args, **kwargs)
        print("Done")
        return result
    return wrapper

@log_calls
def greet(name):
    return f"Hi, {name}"

print(greet("Ava"))`,
    challenge: {
      prompt: "Write a decorator shout that uppercases whatever string a wrapped function returns, then apply it to a function greet(name) that returns f'hi {name}'.",
      hint: 'wrapper calls func(...), then returns result.upper()',
      solution: `def shout(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return result.upper()
    return wrapper

@shout
def greet(name):
    return f"hi {name}"

print(greet("Ava"))  # HI AVA`,
    },
    mistakes: [
      "Forgetting *args, **kwargs in the wrapper — your decorator crashes (or silently drops arguments) on any decorated function that isn't zero-argument.",
      'Forgetting to return result (or the wrapper function itself) — a decorator that forgets to return loses the original output, or replaces the function with None.',
      "Losing the original function's name/docstring after decorating (greet.__name__ becomes 'wrapper') — fix with @functools.wraps(func) on the wrapper.",
    ],
  },

  {
    id: 'context-managers',
    title: 'Context Managers (with)',
    group: 'Intermediate',
    explanation:
      "A context manager is an object that knows how to set something up and guarantee it gets torn down again, wired into Python via the with statement — __enter__ runs at the top of the block, and __exit__ runs when the block ends, even if an exception happened inside it. It's the general-purpose version of what \"with open(...) as f:\" does specifically for files.",
    diagram: {
      type: 'wrap',
      steps: [
        { layers: [{ label: 'with Timer() as t:', active: false }], note: 'with Timer() as t: is about to run.' },
        { layers: [{ label: 'Timer.__enter__() runs', active: true }], note: '__enter__() runs FIRST, automatically — it records the start time and returns self, which is bound to t.' },
        {
          layers: [{ label: 'Timer.__enter__() ran', active: false }, { label: 'block body runs', active: true }],
          note: 'The indented code inside the with block runs next, safely sandwiched between setup and teardown.',
        },
        {
          layers: [{ label: 'block finished', active: false }, { label: 'Timer.__exit__() runs', active: true }],
          resultLabel: 'elapsed time printed',
          note: 'Once the block ends — normally OR via an exception — __exit__() runs automatically, guaranteed. Here it prints the elapsed time.',
        },
      ],
    },
    code: `import time

class Timer:
    def __enter__(self):
        self.start = time.time()
        return self                     # this becomes "t" in "as t"

    def __exit__(self, exc_type, exc_val, exc_tb):
        elapsed = time.time() - self.start
        print(f"Elapsed: {elapsed:.4f}s")
        return False                     # False = don't suppress exceptions

with Timer() as t:
    total = sum(range(1_000_000))
print(total)

# The standard library's contextlib makes simple ones even easier:
from contextlib import contextmanager

@contextmanager
def timer():
    start = time.time()
    yield                                # the "with" block runs here
    print(f"Elapsed: {time.time() - start:.4f}s")

with timer():
    total = sum(range(1_000_000))`,
    playgroundCode: `import time

class Timer:
    def __enter__(self):
        self.start = time.time()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        elapsed = time.time() - self.start
        print(f"Elapsed: {elapsed:.4f}s")
        return False

with Timer() as t:
    total = sum(range(1_000_000))
print(total)`,
    challenge: {
      prompt: 'Write a context manager class Suppress that swallows (silences) any exception raised inside its with block, by returning True from __exit__.',
      hint: '__exit__(self, exc_type, exc_val, exc_tb): return True',
      solution: `class Suppress:
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        return True  # True suppresses any exception

with Suppress():
    raise ValueError("this never propagates!")

print("still running!")`,
    },
    mistakes: [
      'Returning a truthy value from __exit__ SILENTLY SUPPRESSES any exception raised in the block — easy to do by accident if you forget to explicitly return False.',
      'Forgetting __enter__ must return self (or something) if you plan to use "as" — "with Timer() as t:" needs that return value to bind to t.',
      'Believing __exit__ only runs on success — it runs on EVERY exit path, including exceptions, which is exactly the guarantee that makes context managers useful for cleanup.',
    ],
  },
];
