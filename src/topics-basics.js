// ============================================================================
// PyVisualize — Basics topic content
// Schema per topic: { id, title, group, explanation, diagram, code,
//                      playgroundCode, challenge:{prompt,hint,solution}, mistakes:[...] }
// ============================================================================

window.TOPICS_BASICS = [
  {
    id: 'variables-data-types',
    title: 'Variables & Data Types',
    group: 'Basics',
    explanation:
      "A variable is just a labeled sticky note pointing at a value stored in memory — not a box that holds the value itself. When you write x = 5, Python creates the integer 5 somewhere in memory and sticks the label \"x\" onto it. Every value has a type (int, float, str, bool, ...) that determines what you can do with it, and a single name can point to different types at different times.",
    diagram: {
      type: 'box',
      steps: [
        {
          bubbles: [{ id: 'b5', value: '5' }],
          labels: [{ name: 'x', bubbleId: 'b5', typeTag: 'int' }],
          note: 'x = 5 creates an int object 5 in memory, and the name x points to it.',
        },
        {
          bubbles: [{ id: 'b5', value: '5' }, { id: 'bhello', value: '"hello"' }],
          labels: [{ name: 'x', bubbleId: 'b5', typeTag: 'int' }, { name: 'y', bubbleId: 'bhello', typeTag: 'str' }],
          note: 'y = "hello" creates a completely separate str object; x is untouched.',
        },
        {
          bubbles: [{ id: 'b5', value: '5' }, { id: 'bhello', value: '"hello"' }, { id: 'b6', value: '6' }],
          labels: [{ name: 'x', bubbleId: 'b6', typeTag: 'int' }, { name: 'y', bubbleId: 'bhello', typeTag: 'str' }],
          note: "x = x + 1 doesn't change the 5 — it creates a brand-new int 6 and re-points x's label onto it. The old 5, now unreferenced, fades away.",
        },
        {
          bubbles: [{ id: 'b5', value: '5' }, { id: 'bhello', value: '"hello"' }, { id: 'b6', value: '6' }],
          labels: [
            { name: 'x', bubbleId: 'b6', typeTag: 'int' },
            { name: 'y', bubbleId: 'bhello', typeTag: 'str' },
            { name: 'z', bubbleId: 'b6', typeTag: 'int' },
          ],
          note: "z = x makes z point at the EXACT same object x points to — they share the same 6, they aren't independent copies.",
        },
      ],
    },
    code: `# A variable is a label, not a container.
x = 5          # x now points to the int object 5
y = "hello"    # y points to a different object, a str
print(type(x)) # <class 'int'>
print(type(y)) # <class 'str'>

x = x + 1      # this does NOT modify 5 in place;
               # it creates a new int 6 and re-points x to it
print(x)       # 6`,
    playgroundCode: `x = 5
y = "hello"
print(type(x), type(y))

x = x + 1
print("x is now:", x)

z = x
print("z and x point to the same object:", z is x)`,
    challenge: {
      prompt: 'Create a variable age set to 30, then create age_in_days by multiplying age by 365. Print both with a label.',
      hint: 'Multiplication creates a brand-new int — just like x = x + 1 did above.',
      solution: `age = 30
age_in_days = age * 365
print("age:", age)
print("age_in_days:", age_in_days)`,
    },
    mistakes: [
      'Thinking y = x copies the value — for mutable objects (like lists) it actually makes y point at the SAME object, so changing one changes the other.',
      'Assuming a variable "has" a fixed type. Python names are just labels — x = 5 then x = "five" is legal (though usually a sign of confusing code).',
      'Forgetting that reassignment (x = x + 1) creates a brand-new object rather than mutating the old one, for immutable types like int, float, str, tuple.',
    ],
  },

  {
    id: 'type-casting',
    title: 'Type Casting',
    group: 'Basics',
    explanation:
      'Type casting converts a value from one type to another, like translating a word into a different language — the meaning survives, the form changes. Python gives you built-in functions like int(), float(), str(), and bool() to convert between common types on demand. Casting always produces a brand-new object; it never changes the original value in place.',
    diagram: {
      type: 'box',
      steps: [
        {
          bubbles: [{ id: 's42', value: '"42"' }],
          labels: [{ name: 'raw', bubbleId: 's42', typeTag: 'str' }],
          note: 'raw holds the string "42" — text that happens to look like a number.',
        },
        {
          bubbles: [{ id: 's42', value: '"42"' }, { id: 'n42', value: '42' }],
          labels: [{ name: 'raw', bubbleId: 's42', typeTag: 'str' }, { name: 'num', bubbleId: 'n42', typeTag: 'int' }],
          note: 'num = int(raw) converts it to an actual integer 42 — a new object; raw is unaffected.',
        },
        {
          bubbles: [{ id: 's42', value: '"42"' }, { id: 'n42', value: '42' }, { id: 'f42', value: '42.0' }],
          labels: [
            { name: 'raw', bubbleId: 's42', typeTag: 'str' },
            { name: 'num', bubbleId: 'n42', typeTag: 'int' },
            { name: 'flt', bubbleId: 'f42', typeTag: 'float' },
          ],
          note: 'flt = float(num) converts the int to a float, 42.0.',
        },
        {
          bubbles: [
            { id: 's42', value: '"42"' },
            { id: 'n42', value: '42' },
            { id: 'f42', value: '42.0' },
            { id: 'btrue', value: 'True' },
          ],
          labels: [
            { name: 'raw', bubbleId: 's42', typeTag: 'str' },
            { name: 'num', bubbleId: 'n42', typeTag: 'int' },
            { name: 'flt', bubbleId: 'f42', typeTag: 'float' },
            { name: 'flag', bubbleId: 'btrue', typeTag: 'bool' },
          ],
          note: 'flag = bool(num) — any nonzero number casts to True.',
        },
      ],
    },
    code: `raw = "42"            # a string that looks like a number
num = int(raw)        # convert str -> int
flt = float(num)      # convert int -> float
flag = bool(num)      # any nonzero number is True

print(raw, type(raw))
print(num, type(num))
print(flt, type(flt))
print(flag, type(flag))`,
    playgroundCode: `raw = "42"
num = int(raw)
flt = float(num)
flag = bool(num)
print(raw, "->", num, "->", flt, "->", flag)

# Uncomment to see what happens when a string ISN'T a valid number:
# broken = int("forty-two")`,
    challenge: {
      prompt: 'Given price_text = "19.99", convert it to a float called price, then print price rounded to the nearest whole number using round().',
      hint: "float() handles decimal points; int() would just chop off everything after the decimal, not round it.",
      solution: `price_text = "19.99"
price = float(price_text)
print(round(price))`,
    },
    mistakes: [
      'int("3.5") raises a ValueError — int() cannot parse a decimal point directly; go through float() first: int(float("3.5")).',
      'bool("False") is True! Any non-empty string is truthy, no matter what text it contains.',
      'Casting a string that isn\'t numeric (int("abc")) raises ValueError — always expect this can fail on real user input.',
    ],
  },

  {
    id: 'operators',
    title: 'Operators',
    group: 'Basics',
    explanation:
      'Operators are the small symbols (+, -, ==, and, ...) that combine values into new ones, following the same order-of-operations rules as a calculator: parentheses, then exponents, then multiplication/division, then addition/subtraction. Python also has comparison operators that produce True/False, and logical operators that combine those booleans together.',
    diagram: {
      type: 'trace',
      code: 'result = 3 + 4 * 2\nis_big = result > 9\nfinal = is_big and (result != 10)',
      steps: [
        { activeLine: 0, vars: {}, output: [], note: 'Python is about to evaluate 3 + 4 * 2. Multiplication binds tighter than addition, so 4 * 2 happens first.' },
        { activeLine: 0, vars: { result: 11 }, output: [], note: '4 * 2 = 8, then 3 + 8 = 11. result now holds 11.' },
        { activeLine: 1, vars: { result: 11 }, output: [], note: 'Now the comparison runs: result > 9 → 11 > 9 → True.' },
        { activeLine: 1, vars: { result: 11, is_big: true }, output: [], note: 'is_big is now True.' },
        { activeLine: 2, vars: { result: 11, is_big: true }, output: [], note: 'final = is_big and (result != 10) — the parenthesized part evaluates first: 11 != 10 is True.' },
        { activeLine: 2, vars: { result: 11, is_big: true, final: true }, output: [], note: 'True and True → final is True.' },
      ],
    },
    code: `# Arithmetic operators follow normal math precedence:
result = 3 + 4 * 2      # 4*2 happens first -> 3+8 -> 11

# Comparison operators produce a bool:
is_big = result > 9     # True

# Logical operators (and/or/not) combine booleans:
final = is_big and (result != 10)   # True and True -> True

print(result, is_big, final)`,
    playgroundCode: `result = 3 + 4 * 2
is_big = result > 9
final = is_big and (result != 10)
print("result:", result)
print("is_big:", is_big)
print("final:", final)

# A few more operators worth knowing:
print(17 // 5)   # floor division -> 3
print(17 % 5)    # modulo (remainder) -> 2
print(2 ** 10)   # exponent -> 1024`,
    challenge: {
      prompt: 'Without running anything, predict the value of x = 2 + 3 * 4 ** 2 - 1, then check yourself in the playground.',
      hint: 'Order of operations: exponent first, then multiplication, then addition/subtraction left to right.',
      solution: `# ** first: 4 ** 2 = 16
# * next: 3 * 16 = 48
# then left-to-right: 2 + 48 - 1 = 49
x = 2 + 3 * 4 ** 2 - 1
print(x)  # 49`,
    },
    mistakes: [
      '= is assignment, == is comparison — "if x = 5:" is a syntax error; you want "if x == 5:".',
      'and/or short-circuit: in a() or b(), if a() is truthy, b() never even runs — do not rely on both sides always executing.',
      'Chained comparisons like 1 < x < 10 work in Python and mean (1 < x) and (x < 10) — handy, but easy to misread at first.',
    ],
  },

  {
    id: 'strings-methods',
    title: 'Strings & String Methods',
    group: 'Basics',
    explanation:
      "A string is an ordered, immutable sequence of characters — a strip of numbered mailboxes, each holding one character, that you're never allowed to repaint in place. You can read any character by its index (s[0]), grab slices (s[1:4]), and call built-in methods like .upper() or .split() — every one of which returns a brand-new string rather than modifying the original.",
    diagram: {
      type: 'sequence',
      steps: [
        {
          mode: 'string',
          items: [
            { id: 'c0', value: 'H', index: 0 },
            { id: 'c1', value: 'i', index: 1 },
            { id: 'c2', value: ' ', index: 2 },
            { id: 'c3', value: 'P', index: 3 },
            { id: 'c4', value: 'y', index: 4 },
          ],
          note: 'greeting = "Hi Py" — 5 characters, indexed 0 through 4.',
        },
        {
          mode: 'string',
          items: [
            { id: 'c0', value: 'H', index: 0 },
            { id: 'c1', value: 'i', index: 1, tone: 'active' },
            { id: 'c2', value: ' ', index: 2 },
            { id: 'c3', value: 'P', index: 3 },
            { id: 'c4', value: 'y', index: 4 },
          ],
          note: 'greeting[1] reads a single character: "i".',
        },
        {
          mode: 'string',
          items: [
            { id: 'c0', value: 'H', index: 0 },
            { id: 'c1', value: 'i', index: 1 },
            { id: 'c2', value: ' ', index: 2 },
            { id: 'c3', value: 'P', index: 3, tone: 'active' },
            { id: 'c4', value: 'y', index: 4, tone: 'active' },
          ],
          note: 'greeting[3:5] slices out characters starting at index 3 up to (not including) index 5: "Py".',
        },
        {
          mode: 'pipeline',
          items: [
            { id: 'c0', value: 'H' },
            { id: 'c1', value: 'i' },
            { id: 'c2', value: ' ' },
            { id: 'c3', value: 'P' },
            { id: 'c4', value: 'y' },
          ],
          fnLabel: '.upper()',
          resultItems: [
            { id: 'u0', value: 'H' },
            { id: 'u1', value: 'I' },
            { id: 'u2', value: ' ' },
            { id: 'u3', value: 'P' },
            { id: 'u4', value: 'Y' },
          ],
          note: 'greeting.upper() returns a brand-new string "HI PY" — the original greeting is completely untouched.',
        },
      ],
    },
    code: `greeting = "Hi Py"

print(greeting[1])      # 'i'      - indexing
print(greeting[3:5])    # 'Py'     - slicing
print(greeting.upper()) # 'HI PY'  - returns a NEW string
print(greeting)         # 'Hi Py'  - unchanged! strings are immutable

# Some everyday string methods:
print(greeting.lower())
print(greeting.replace("Py", "Python"))
print(greeting.split(" "))          # -> ['Hi', 'Py']
print("  padded  ".strip())         # -> 'padded'
print(", ".join(["a", "b", "c"]))   # -> 'a, b, c'`,
    playgroundCode: `greeting = "Hi Py"
print(greeting[1])
print(greeting[3:5])
print(greeting.upper())
print(greeting.replace("Py", "Python"))
print(greeting.split(" "))
print(", ".join(["a", "b", "c"]))`,
    challenge: {
      prompt: 'Given sentence = "the quick brown fox", produce "The Quick Brown Fox" (title case) using a single string method.',
      hint: "There's a method literally named for this.",
      solution: `sentence = "the quick brown fox"
print(sentence.title())`,
    },
    mistakes: [
      's[0] = "X" raises a TypeError — strings are immutable, you cannot assign into an index. Build a new string instead: s = "X" + s[1:].',
      "String methods don't modify in place: greeting.upper() alone does nothing useful — capture the return value: greeting = greeting.upper().",
      'Slicing s[3:5] stops BEFORE index 5, not at it — the slice length is 5 - 3 = 2 characters.',
    ],
  },

  {
    id: 'input-output',
    title: 'Input / Output',
    group: 'Basics',
    explanation:
      "Input and output are how your program talks to the outside world: print() sends text out to the console, and input() pauses your program and waits for the user to type something back. Whatever input() receives is always handed to you as a string — even if the user typed a number, you'll need to cast it yourself.",
    diagram: {
      type: 'flow',
      steps: [
        {
          nodes: [
            { id: 'user', label: 'User', x: 5, y: 50, shape: 'start' },
            { id: 'input', label: 'input()', x: 30, y: 50, shape: 'process' },
            { id: 'var', label: 'name = "Ava"', x: 55, y: 50, shape: 'process' },
            { id: 'print', label: 'print(f"...")', x: 80, y: 50, shape: 'process' },
            { id: 'console', label: 'Console', x: 97, y: 50, shape: 'end' },
          ],
          edges: [
            { from: 'user', to: 'input' },
            { from: 'input', to: 'var' },
            { from: 'var', to: 'print' },
            { from: 'print', to: 'console' },
          ],
          note: 'The program calls input("What\'s your name? ") and pauses, waiting for the user.',
        },
        {
          nodes: [
            { id: 'user', label: 'User', x: 5, y: 50, shape: 'start', active: true },
            { id: 'input', label: 'input()', x: 30, y: 50, shape: 'process', active: true },
            { id: 'var', label: 'name = ?', x: 55, y: 50, shape: 'process' },
            { id: 'print', label: 'print(f"...")', x: 80, y: 50, shape: 'process' },
            { id: 'console', label: 'Console', x: 97, y: 50, shape: 'end' },
          ],
          edges: [
            { from: 'user', to: 'input', active: true, label: 'types "Ava"' },
            { from: 'input', to: 'var' },
            { from: 'var', to: 'print' },
            { from: 'print', to: 'console' },
          ],
          note: 'The user types "Ava" and hits Enter.',
        },
        {
          nodes: [
            { id: 'user', label: 'User', x: 5, y: 50, shape: 'start' },
            { id: 'input', label: 'input()', x: 30, y: 50, shape: 'process' },
            { id: 'var', label: 'name = "Ava"', x: 55, y: 50, shape: 'process', active: true },
            { id: 'print', label: 'print(f"...")', x: 80, y: 50, shape: 'process' },
            { id: 'console', label: 'Console', x: 97, y: 50, shape: 'end' },
          ],
          edges: [
            { from: 'user', to: 'input' },
            { from: 'input', to: 'var', active: true, label: 'returns str' },
            { from: 'var', to: 'print' },
            { from: 'print', to: 'console' },
          ],
          note: "input() always returns a str — name now holds the string \"Ava\", not a special 'typed' type.",
        },
        {
          nodes: [
            { id: 'user', label: 'User', x: 5, y: 50, shape: 'start' },
            { id: 'input', label: 'input()', x: 30, y: 50, shape: 'process' },
            { id: 'var', label: 'name = "Ava"', x: 55, y: 50, shape: 'process' },
            { id: 'print', label: 'print(f"Hi, Ava!")', x: 80, y: 50, shape: 'process', active: true },
            { id: 'console', label: 'Console', x: 97, y: 50, shape: 'end' },
          ],
          edges: [
            { from: 'user', to: 'input' },
            { from: 'input', to: 'var' },
            { from: 'var', to: 'print', active: true, label: 'formats' },
            { from: 'print', to: 'console' },
          ],
          note: 'print(f"Hi, {name}!") builds a new formatted string from the variable.',
        },
        {
          nodes: [
            { id: 'user', label: 'User', x: 5, y: 50, shape: 'start' },
            { id: 'input', label: 'input()', x: 30, y: 50, shape: 'process' },
            { id: 'var', label: 'name = "Ava"', x: 55, y: 50, shape: 'process' },
            { id: 'print', label: 'print(f"...")', x: 80, y: 50, shape: 'process' },
            { id: 'console', label: '"Hi, Ava!"', x: 97, y: 50, shape: 'end', active: true },
          ],
          edges: [
            { from: 'user', to: 'input' },
            { from: 'input', to: 'var' },
            { from: 'var', to: 'print' },
            { from: 'print', to: 'console', active: true, label: 'writes' },
          ],
          note: 'The formatted text is written out to the console — that is output.',
        },
      ],
    },
    code: `name = input("What's your name? ")   # pauses, returns a str
age_text = input("How old are you? ")
age = int(age_text)                  # you must cast it yourself

print(f"Hi, {name}! In 10 years you'll be {age + 10}.")`,
    playgroundCode: `# input() pauses for real keyboard input, which is hard to demo in a
# sandboxed playground — so here we simulate what input() would return:
name = "Ava"          # pretend this came from: input("What's your name? ")
age_text = "30"       # pretend this came from: input("How old are you? ")
age = int(age_text)   # input() always returns a str, so cast it yourself

print(f"Hi, {name}! In 10 years you'll be {age + 10}.")`,
    challenge: {
      prompt: 'Simulate reading two numbers as strings ("12" and "8"), convert both to int, and print their sum.',
      hint: "int() each string before adding — adding two strings would concatenate, not sum, them.",
      solution: `a_text = "12"
b_text = "8"
a = int(a_text)
b = int(b_text)
print(a + b)  # 20, not '128'`,
    },
    mistakes: [
      'input() always returns a str — input("Age: ") + 1 raises a TypeError until you wrap it in int(...).',
      'Forgetting the prompt text is optional but very helpful: bare input() shows no message, which confuses users.',
      'print(a, b) inserts a space between arguments automatically; pass sep="" if you want no separator.',
    ],
  },

  {
    id: 'if-elif-else',
    title: 'if / elif / else',
    group: 'Basics',
    explanation:
      'Conditionals let your program choose which block of code to run based on a True/False test — a fork in the road with signposts. Python checks each condition top to bottom (the if, then any elifs) and runs the first block whose condition is True, skipping every remaining branch entirely; else catches everything that didn\'t match.',
    diagram: {
      type: 'flow',
      steps: [
        {
          nodes: [
            { id: 'start', label: 'temp = 15', x: 50, y: 6, shape: 'start' },
            { id: 'd1', label: 'temp < 0?', x: 50, y: 26, shape: 'decision' },
            { id: 'freezing', label: '"freezing"', x: 88, y: 26, shape: 'process' },
            { id: 'd2', label: 'temp < 20?', x: 50, y: 50, shape: 'decision' },
            { id: 'cool', label: '"cool"', x: 88, y: 50, shape: 'process' },
            { id: 'd3', label: 'temp < 30?', x: 50, y: 74, shape: 'decision' },
            { id: 'warm', label: '"warm"', x: 88, y: 74, shape: 'process' },
            { id: 'hot', label: '"hot"', x: 50, y: 94, shape: 'end' },
          ],
          edges: [
            { from: 'start', to: 'd1' },
            { from: 'd1', to: 'freezing', label: 'True' },
            { from: 'd1', to: 'd2', label: 'False' },
            { from: 'd2', to: 'cool', label: 'True' },
            { from: 'd2', to: 'd3', label: 'False' },
            { from: 'd3', to: 'warm', label: 'True' },
            { from: 'd3', to: 'hot', label: 'False' },
          ],
          note: 'temp = 15. Python starts checking conditions from the very top.',
        },
        {
          nodes: [
            { id: 'start', label: 'temp = 15', x: 50, y: 6, shape: 'start' },
            { id: 'd1', label: 'temp < 0?', x: 50, y: 26, shape: 'decision', active: true },
            { id: 'freezing', label: '"freezing"', x: 88, y: 26, shape: 'process' },
            { id: 'd2', label: 'temp < 20?', x: 50, y: 50, shape: 'decision' },
            { id: 'cool', label: '"cool"', x: 88, y: 50, shape: 'process' },
            { id: 'd3', label: 'temp < 30?', x: 50, y: 74, shape: 'decision' },
            { id: 'warm', label: '"warm"', x: 88, y: 74, shape: 'process' },
            { id: 'hot', label: '"hot"', x: 50, y: 94, shape: 'end' },
          ],
          edges: [
            { from: 'start', to: 'd1', active: true },
            { from: 'd1', to: 'freezing', label: 'True' },
            { from: 'd1', to: 'd2', label: 'False' },
            { from: 'd2', to: 'cool', label: 'True' },
            { from: 'd2', to: 'd3', label: 'False' },
            { from: 'd3', to: 'warm', label: 'True' },
            { from: 'd3', to: 'hot', label: 'False' },
          ],
          note: 'if temp < 0: → 15 < 0 is False. Python skips this block and checks the next elif.',
        },
        {
          nodes: [
            { id: 'start', label: 'temp = 15', x: 50, y: 6, shape: 'start' },
            { id: 'd1', label: 'temp < 0?', x: 50, y: 26, shape: 'decision' },
            { id: 'freezing', label: '"freezing"', x: 88, y: 26, shape: 'process' },
            { id: 'd2', label: 'temp < 20?', x: 50, y: 50, shape: 'decision', active: true },
            { id: 'cool', label: '"cool"', x: 88, y: 50, shape: 'process' },
            { id: 'd3', label: 'temp < 30?', x: 50, y: 74, shape: 'decision' },
            { id: 'warm', label: '"warm"', x: 88, y: 74, shape: 'process' },
            { id: 'hot', label: '"hot"', x: 50, y: 94, shape: 'end' },
          ],
          edges: [
            { from: 'start', to: 'd1' },
            { from: 'd1', to: 'freezing', label: 'True' },
            { from: 'd1', to: 'd2', label: 'False', active: true },
            { from: 'd2', to: 'cool', label: 'True' },
            { from: 'd2', to: 'd3', label: 'False' },
            { from: 'd3', to: 'warm', label: 'True' },
            { from: 'd3', to: 'hot', label: 'False' },
          ],
          note: 'elif temp < 20: → 15 < 20 is True! Python will run this block and skip every remaining elif/else.',
        },
        {
          nodes: [
            { id: 'start', label: 'temp = 15', x: 50, y: 6, shape: 'start' },
            { id: 'd1', label: 'temp < 0?', x: 50, y: 26, shape: 'decision' },
            { id: 'freezing', label: '"freezing"', x: 88, y: 26, shape: 'process' },
            { id: 'd2', label: 'temp < 20?', x: 50, y: 50, shape: 'decision' },
            { id: 'cool', label: '"cool"', x: 88, y: 50, shape: 'process', active: true },
            { id: 'd3', label: 'temp < 30?', x: 50, y: 74, shape: 'decision' },
            { id: 'warm', label: '"warm"', x: 88, y: 74, shape: 'process' },
            { id: 'hot', label: '"hot"', x: 50, y: 94, shape: 'end' },
          ],
          edges: [
            { from: 'start', to: 'd1' },
            { from: 'd1', to: 'freezing', label: 'True' },
            { from: 'd1', to: 'd2', label: 'False' },
            { from: 'd2', to: 'cool', label: 'True', active: true },
            { from: 'd2', to: 'd3', label: 'False' },
            { from: 'd3', to: 'warm', label: 'True' },
            { from: 'd3', to: 'hot', label: 'False' },
          ],
          note: 'Only "cool" is printed. Even though temp < 30 is technically also true, Python never checks it — the first match wins.',
        },
      ],
    },
    code: `temp = 15

if temp < 0:
    label = "freezing"
elif temp < 20:
    label = "cool"
elif temp < 30:
    label = "warm"
else:
    label = "hot"

print(label)   # "cool" — the FIRST matching branch wins`,
    playgroundCode: `temp = 15  # try changing this value

if temp < 0:
    label = "freezing"
elif temp < 20:
    label = "cool"
elif temp < 30:
    label = "warm"
else:
    label = "hot"

print(label)`,
    challenge: {
      prompt: 'Write a grading rule using if/elif/else: score >= 90 -> "A", >= 80 -> "B", >= 70 -> "C", else -> "F". Test it with score = 84.',
      hint: 'Order matters — check the highest threshold first, since elif stops at the first True condition.',
      solution: `score = 84
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"
print(grade)  # B`,
    },
    mistakes: [
      'Checking conditions in the wrong order: "if score >= 70: ... elif score >= 90:" — a 95 would wrongly match the first branch and never reach the 90 check.',
      'Using multiple separate if statements when you mean elif — with separate ifs more than one block can run; with elif only one ever will.',
      'Indentation IS the block structure in Python — a misaligned line silently belongs to the wrong block (or raises an IndentationError).',
    ],
  },

  {
    id: 'for-while-loops',
    title: 'for & while Loops',
    group: 'Basics',
    explanation:
      "A for loop walks through a known sequence of items one at a time, like reading down a checklist — it stops automatically once the list runs out. A while loop instead keeps repeating as long as a condition stays True, like 'keep stirring until the sauce thickens' — you're responsible for eventually making that condition False, or it runs forever.",
    diagram: {
      type: 'trace',
      code: 'total = 0\nfor n in [10, 20, 30]:\n    total += n\nprint(total)',
      steps: [
        { activeLine: 1, vars: { total: 0 }, output: [], note: 'total starts at 0. The for loop begins: n takes the first value, 10.' },
        { activeLine: 2, vars: { total: 0, n: 10 }, output: [], note: 'total += n runs: total becomes 0 + 10 = 10.' },
        { activeLine: 1, vars: { total: 10, n: 20 }, output: [], note: 'Loop goes back to the top; n takes the next value, 20.' },
        { activeLine: 2, vars: { total: 10, n: 20 }, output: [], note: 'total += n: total becomes 30.' },
        { activeLine: 1, vars: { total: 30, n: 30 }, output: [], note: 'n takes the last value, 30.' },
        { activeLine: 2, vars: { total: 30, n: 30 }, output: [], note: 'total += n: total becomes 60.' },
        { activeLine: 3, vars: { total: 60, n: 30 }, output: ['60'], note: 'The list is exhausted, so the loop ends on its own. print(total) runs: 60.' },
      ],
    },
    code: `# for loop — walks a known sequence:
total = 0
for n in [10, 20, 30]:
    total += n
print(total)   # 60

# while loop — repeats until a condition goes False:
count = 3
while count > 0:
    print("countdown:", count)
    count -= 1     # YOU must change the condition, or this never stops
print("liftoff!")`,
    playgroundCode: `total = 0
for n in [10, 20, 30]:
    total += n
print("total:", total)

count = 3
while count > 0:
    print("countdown:", count)
    count -= 1
print("liftoff!")`,
    challenge: {
      prompt: 'Use a while loop to find the smallest power of 2 that is greater than 1000.',
      hint: 'Start value = 1, keep multiplying by 2 while value <= 1000.',
      solution: `value = 1
while value <= 1000:
    value *= 2
print(value)  # 1024`,
    },
    mistakes: [
      'Writing a while loop whose condition never becomes False — an infinite loop that freezes your program. Always double-check the variable actually changes inside the loop.',
      'Modifying a list while iterating over it with "for x in my_list:" — items can be skipped; iterate over a copy (my_list[:]) if you need to remove items during the loop.',
      'Off-by-one confusion with range(n) — it produces 0, 1, ..., n-1 (n numbers total), never n itself.',
    ],
  },

  {
    id: 'break-continue-pass',
    title: 'break / continue / pass',
    group: 'Basics',
    explanation:
      "break, continue, and pass are three small keywords that change how a loop behaves mid-stride. break slams the brakes and exits the loop immediately; continue skips just the rest of the current iteration and jumps to the next one; pass does nothing at all — it's a placeholder for when Python's syntax requires a statement but you don't have one yet.",
    diagram: {
      type: 'trace',
      code: 'for n in [1, 2, 3, 4, 5]:\n    if n == 3:\n        continue\n    if n == 5:\n        break\n    print(n)',
      steps: [
        { activeLine: 0, vars: { n: 1 }, output: [], note: 'Loop starts: n = 1.' },
        { activeLine: 5, vars: { n: 1 }, output: ['1'], note: 'Neither condition matches, so print(n) runs: 1.' },
        { activeLine: 0, vars: { n: 2 }, output: ['1'], note: 'n = 2.' },
        { activeLine: 5, vars: { n: 2 }, output: ['1', '2'], note: 'print(n): 2.' },
        { activeLine: 2, vars: { n: 3 }, output: ['1', '2'], note: 'n = 3 matches "if n == 3", so continue runs — it jumps straight back to the top, skipping print(n) for this iteration entirely.' },
        { activeLine: 0, vars: { n: 4 }, output: ['1', '2'], note: 'n = 4.' },
        { activeLine: 5, vars: { n: 4 }, output: ['1', '2', '4'], note: 'print(n): 4.' },
        { activeLine: 4, vars: { n: 5 }, output: ['1', '2', '4'], note: 'n = 5 matches "if n == 5", so break runs — the loop ends immediately. 5 is never printed.' },
      ],
    },
    code: `for n in [1, 2, 3, 4, 5]:
    if n == 3:
        continue   # skip just this iteration
    if n == 5:
        break      # exit the loop entirely
    print(n)

# pass does nothing — it's a placeholder:
for n in [1, 2, 3]:
    if n == 2:
        pass       # TODO: handle this case later
    print("checked", n)`,
    playgroundCode: `for n in [1, 2, 3, 4, 5]:
    if n == 3:
        continue
    if n == 5:
        break
    print(n)

print("---")

for n in [1, 2, 3]:
    if n == 2:
        pass
    print("checked", n)`,
    challenge: {
      prompt: 'Loop over numbers 1 through 20 and print only the ones that are NOT divisible by 3, stopping the loop completely once you reach a number greater than 15.',
      hint: 'Use continue to skip multiples of 3, and break once n > 15.',
      solution: `for n in range(1, 21):
    if n > 15:
        break
    if n % 3 == 0:
        continue
    print(n)`,
    },
    mistakes: [
      'continue inside a nested loop only skips to the next iteration of the INNERMOST loop, not the outer one — a common source of confusion.',
      "break only exits ONE loop level — breaking out of a nested loop's inner loop still leaves the outer loop running.",
      'Using pass when you actually meant continue — pass does nothing and execution falls through to the rest of the loop body; it does not skip anything.',
    ],
  },

  {
    id: 'lists',
    title: 'Lists',
    group: 'Basics',
    explanation:
      'A list is an ordered, mutable collection — a row of labeled lockers you can open, refill, rearrange, or add more lockers to at any time. Items keep their position (index), starting at 0, and you can change, insert, or remove elements in place without ever creating a whole new list.',
    diagram: {
      type: 'sequence',
      steps: [
        {
          mode: 'list',
          items: [
            { id: 'a', value: '"apple"', index: 0 },
            { id: 'b', value: '"banana"', index: 1 },
            { id: 'c', value: '"cherry"', index: 2 },
          ],
          note: 'fruits = ["apple", "banana", "cherry"] — three items at indices 0, 1, 2.',
        },
        {
          mode: 'list',
          items: [
            { id: 'a', value: '"apple"', index: 0 },
            { id: 'b', value: '"banana"', index: 1, tone: 'active' },
            { id: 'c', value: '"cherry"', index: 2 },
          ],
          note: 'fruits[1] reads "banana" by its index.',
        },
        {
          mode: 'list',
          items: [
            { id: 'a', value: '"apple"', index: 0 },
            { id: 'b', value: '"banana"', index: 1 },
            { id: 'c', value: '"cherry"', index: 2 },
            { id: 'd', value: '"date"', index: 3, tone: 'add' },
          ],
          note: 'fruits.append("date") adds a new item at the end — the list grows in place, no new list is created.',
        },
        {
          mode: 'list',
          items: [
            { id: 'a', value: '"apple"', index: 0, tone: 'remove' },
            { id: 'b', value: '"banana"', index: 1 },
            { id: 'c', value: '"cherry"', index: 2 },
            { id: 'd', value: '"date"', index: 3 },
          ],
          note: 'fruits.remove("apple") deletes it by value.',
        },
        {
          mode: 'list',
          items: [
            { id: 'b', value: '"banana"', index: 0 },
            { id: 'c', value: '"cherry"', index: 1 },
            { id: 'd', value: '"date"', index: 2 },
          ],
          note: 'The list is now ["banana", "cherry", "date"] — every index after the removed item shifted down by one automatically.',
        },
      ],
    },
    code: `fruits = ["apple", "banana", "cherry"]

print(fruits[1])        # 'banana' — indexing
fruits.append("date")   # add to the end, in place
fruits.remove("apple")  # delete by value, in place
fruits[0] = "blueberry" # overwrite an item by index

print(fruits)            # ['blueberry', 'cherry', 'date']
print(len(fruits))       # 3`,
    playgroundCode: `fruits = ["apple", "banana", "cherry"]
print(fruits[1])
fruits.append("date")
fruits.remove("apple")
fruits[0] = "blueberry"
print(fruits)
print(len(fruits))`,
    challenge: {
      prompt: 'Start with numbers = [5, 3, 8, 1], add 9 to the end, remove 3, then print the list sorted in ascending order.',
      hint: 'list.append(), list.remove(), and list.sort() are all you need.',
      solution: `numbers = [5, 3, 8, 1]
numbers.append(9)
numbers.remove(3)
numbers.sort()
print(numbers)  # [1, 5, 8, 9]`,
    },
    mistakes: [
      'my_list.append(x) returns None, not the new list — my_list = my_list.append(x) silently sets my_list to None.',
      'my_list.remove(x) deletes by VALUE, not by index; use del my_list[i] or my_list.pop(i) to remove by position.',
      'Copying a list with new = old does not copy anything — both names point at the same list, so mutating new also mutates old. Use new = old.copy() or old[:] for a real copy.',
    ],
  },

  {
    id: 'tuples',
    title: 'Tuples',
    group: 'Basics',
    explanation:
      "A tuple is an ordered collection just like a list, but it's immutable — once built, you cannot add, remove, or reassign its items, like a sentence engraved in stone. Tuples suit fixed groups of values that shouldn't change, such as coordinates (x, y) or a record returned from a function.",
    diagram: {
      type: 'sequence',
      steps: [
        {
          mode: 'tuple',
          items: [{ id: 'x', value: '3', index: 0 }, { id: 'y', value: '4', index: 1 }],
          note: 'point = (3, 4) — a 2-item tuple representing coordinates.',
        },
        {
          mode: 'tuple',
          items: [{ id: 'x', value: '3', index: 0, tone: 'active' }, { id: 'y', value: '4', index: 1 }],
          note: 'point[0] reads 3, exactly like list indexing.',
        },
        {
          mode: 'tuple',
          items: [{ id: 'x', value: '3', index: 0, tone: 'remove' }, { id: 'y', value: '4', index: 1 }],
          note: 'point[0] = 99 raises a TypeError — tuples do not support item assignment. (Shown here for illustration; this line never actually runs.)',
        },
        {
          mode: 'tuple',
          items: [
            { id: 'x', value: '3', index: 0 },
            { id: 'y', value: '4', index: 1 },
            { id: 'z', value: '5', index: 2, tone: 'add' },
          ],
          note: 'You CAN build a new tuple: point_3d = point + (5,) creates an entirely new 3-item tuple — the original point is untouched.',
        },
      ],
    },
    code: `point = (3, 4)          # a 2-item tuple

print(point[0])          # 3 — indexing works like a list
# point[0] = 99          # TypeError: 'tuple' object does not support item assignment

point_3d = point + (5,)  # concatenation makes a NEW tuple
print(point_3d)          # (3, 4, 5)

x, y = point              # unpacking — a very common tuple use
print(x, y)               # 3 4`,
    playgroundCode: `point = (3, 4)
print(point[0])

point_3d = point + (5,)
print(point_3d)

x, y = point
print(x, y)`,
    challenge: {
      prompt: 'Given rgb = (255, 0, 128), unpack it into r, g, b in one line and print f"#{r:02x}{g:02x}{b:02x}" (a hex color code).',
      hint: 'Tuple unpacking: r, g, b = rgb.',
      solution: `rgb = (255, 0, 128)
r, g, b = rgb
print(f"#{r:02x}{g:02x}{b:02x}")  # #ff0080`,
    },
    mistakes: [
      'Writing (5) and expecting a tuple — that is just the int 5 in parentheses. A one-item tuple needs a trailing comma: (5,).',
      'Trying to mutate a tuple in place (t[0] = 1, t.append(x)) always raises a TypeError — tuples have no such methods.',
      "Forgetting a tuple can still contain mutable objects — t = ([1,2], 3) — the tuple's slots can't be reassigned, but t[0].append(4) still works, since you're mutating the list inside, not the tuple.",
    ],
  },

  {
    id: 'sets',
    title: 'Sets',
    group: 'Basics',
    explanation:
      "A set is an unordered collection of unique values — a bag of distinct marbles where duplicates simply can't exist and there's no such thing as 'the first one'. Sets are built for fast membership testing (x in my_set) and classic math operations like union, intersection, and difference.",
    diagram: {
      type: 'sequence',
      steps: [
        {
          mode: 'set',
          items: [
            { id: '1', value: '1' },
            { id: '2', value: '2' },
            { id: '2b', value: '2', tone: 'remove' },
            { id: '3', value: '3' },
          ],
          note: 's = {1, 2, 2, 3} — duplicates are automatically dropped while the set is built.',
        },
        {
          mode: 'set',
          items: [{ id: '1', value: '1' }, { id: '2', value: '2' }, { id: '3', value: '3' }],
          note: 'The actual set only ever contains {1, 2, 3} — no memory of how many times 2 was written, and no guaranteed order.',
        },
        {
          mode: 'set',
          items: [
            { id: '1', value: '1' },
            { id: '2', value: '2' },
            { id: '3', value: '3' },
            { id: '4', value: '4', tone: 'add' },
          ],
          note: 's.add(4) inserts a new unique value.',
        },
        {
          mode: 'set',
          items: [
            { id: '1', value: '1' },
            { id: '2', value: '2', tone: 'active' },
            { id: '3', value: '3' },
            { id: '4', value: '4' },
          ],
          note: '2 in s is a very fast O(1) check — this is exactly what sets are optimized for.',
        },
        {
          mode: 'set',
          items: [
            { id: '1', value: '1' },
            { id: '2', value: '2' },
            { id: '3', value: '3', tone: 'active' },
            { id: '4', value: '4', tone: 'active' },
          ],
          note: 's & {3, 4, 5} (intersection) would give {3, 4} — only values present in both sets.',
        },
      ],
    },
    code: `s = {1, 2, 2, 3}      # duplicates collapse automatically
print(s)               # {1, 2, 3}

s.add(4)                # insert a unique value
print(2 in s)            # True — very fast membership test

a = {1, 2, 3}
b = {3, 4, 5}
print(a & b)              # intersection: {3}
print(a | b)              # union: {1, 2, 3, 4, 5}
print(a - b)              # difference: {1, 2}`,
    playgroundCode: `s = {1, 2, 2, 3}
print(s)
s.add(4)
print(2 in s)

a = {1, 2, 3}
b = {3, 4, 5}
print("intersection:", a & b)
print("union:", a | b)
print("difference:", a - b)`,
    challenge: {
      prompt: 'Given monday = ["Al","Bo","Cy"] and tuesday = ["Bo","Cy","Di"], print the set of people who attended BOTH days.',
      hint: 'Convert each list to a set, then use &.',
      solution: `monday = {"Al", "Bo", "Cy"}
tuesday = {"Bo", "Cy", "Di"}
print(monday & tuesday)  # {'Bo', 'Cy'}`,
    },
    mistakes: [
      '{} creates an empty DICT, not an empty set — use set() for an empty set.',
      'Sets have no order and no indexing — my_set[0] raises a TypeError.',
      "Sets can only hold hashable (essentially immutable) items — {[1,2]} raises a TypeError because lists aren't hashable; use a tuple instead.",
    ],
  },

  {
    id: 'dictionaries',
    title: 'Dictionaries',
    group: 'Basics',
    explanation:
      'A dictionary stores key-value pairs — a real dictionary where you look up a word (the key) to find its definition (the value), instead of hunting through numbered pages. Keys must be unique and unchangeable (usually strings or numbers), values can be absolutely anything, and lookup by key is extremely fast.',
    diagram: {
      type: 'sequence',
      steps: [
        {
          mode: 'dict',
          items: [{ id: 'name', key: '"name"', value: '"Ava"' }, { id: 'age', key: '"age"', value: '30' }],
          note: 'person = {"name": "Ava", "age": 30} — two key-value pairs.',
        },
        {
          mode: 'dict',
          items: [{ id: 'name', key: '"name"', value: '"Ava"', tone: 'active' }, { id: 'age', key: '"age"', value: '30' }],
          note: 'person["name"] looks up the value stored under that key: "Ava".',
        },
        {
          mode: 'dict',
          items: [
            { id: 'name', key: '"name"', value: '"Ava"' },
            { id: 'age', key: '"age"', value: '30' },
            { id: 'city', key: '"city"', value: '"Boston"', tone: 'add' },
          ],
          note: 'person["city"] = "Boston" adds a brand-new key — dicts grow in place.',
        },
        {
          mode: 'dict',
          items: [
            { id: 'name', key: '"name"', value: '"Ava"' },
            { id: 'age', key: '"age"', value: '31', tone: 'active' },
            { id: 'city', key: '"city"', value: '"Boston"' },
          ],
          note: 'person["age"] = 31 overwrites the existing value for an existing key — no new key is created.',
        },
        {
          mode: 'dict',
          items: [
            { id: 'name', key: '"name"', value: '"Ava"' },
            { id: 'age', key: '"age"', value: '31' },
            { id: 'city', key: '"city"', value: '"Boston"' },
          ],
          note: 'person.get("zip", "unknown") safely looks up a MISSING key, returning "unknown" instead of raising a KeyError.',
        },
      ],
    },
    code: `person = {"name": "Ava", "age": 30}

print(person["name"])          # 'Ava'
person["city"] = "Boston"      # add a new key, in place
person["age"] = 31             # overwrite an existing key

print(person)                   # {'name': 'Ava', 'age': 31, 'city': 'Boston'}
print(person.get("zip", "unknown"))  # safe lookup, no crash on a missing key

for key, value in person.items():
    print(key, "->", value)`,
    playgroundCode: `person = {"name": "Ava", "age": 30}
print(person["name"])
person["city"] = "Boston"
person["age"] = 31
print(person)
print(person.get("zip", "unknown"))

for key, value in person.items():
    print(key, "->", value)`,
    challenge: {
      prompt: 'Given prices = {"apple": 1.5, "banana": 0.5}, add "cherry": 3.0, then print the total of all values.',
      hint: 'sum(prices.values()) adds up every value in one call.',
      solution: `prices = {"apple": 1.5, "banana": 0.5}
prices["cherry"] = 3.0
print(sum(prices.values()))  # 5.0`,
    },
    mistakes: [
      'person["zip"] on a missing key raises a KeyError and crashes your program — use .get(key, default) when the key might not exist.',
      'Dict keys must be hashable — a string, number, or tuple works as a key, but a list or another dict never can.',
      'Since Python 3.7 dicts remember insertion order, but you should still never rely on that order for correctness across different code paths.',
    ],
  },

  {
    id: 'functions-arguments',
    title: 'Functions & Arguments',
    group: 'Basics',
    explanation:
      'A function packages a block of reusable code behind a name, like a recipe card you can hand ingredients (arguments) to and get a dish (return value) back. Every call creates a brand-new local workspace — a stack frame — for its parameters and local variables, which disappears the moment the function returns.',
    diagram: {
      type: 'stack',
      steps: [
        { frames: [], note: "Nothing is running yet. Python has read the def, but no frame exists until the function is actually CALLED." },
        {
          frames: [{ id: 'f1', name: 'greet', args: 'name="Ava", excited=False', locals: 'message = ?' }],
          note: 'greet("Ava") is called: a new frame is pushed with name bound to "Ava" and excited defaulting to False.',
        },
        {
          frames: [{ id: 'f1', name: 'greet', args: 'name="Ava", excited=False', locals: 'message = "Hello, Ava"' }],
          note: 'Inside the frame, message is computed and stored as a local variable.',
        },
        {
          frames: [{ id: 'f1', name: 'greet', args: 'name="Ava", excited=False', locals: 'message = "Hello, Ava"', returning: '"Hello, Ava"' }],
          note: 'return sends the value back to the caller — the frame is popped off the stack and destroyed; message no longer exists anywhere.',
        },
        {
          frames: [{ id: 'f2', name: 'greet', args: 'name="Sam", excited=True', locals: 'message = ?' }],
          note: 'A completely separate call, greet("Sam", excited=True), pushes a brand-new frame that shares no state with the previous one.',
        },
      ],
    },
    code: `def greet(name, excited=False):
    message = f"Hello, {name}"
    if excited:
        message += "!!!"
    return message

print(greet("Ava"))                  # 'Hello, Ava'
print(greet("Sam", excited=True))    # 'Hello, Sam!!!'`,
    playgroundCode: `def greet(name, excited=False):
    message = f"Hello, {name}"
    if excited:
        message += "!!!"
    return message

print(greet("Ava"))
print(greet("Sam", excited=True))`,
    challenge: {
      prompt: 'Write a function area(width, height=1) that returns width*height, defaulting height to 1. Call it two ways.',
      hint: 'Default parameter values only apply when the caller omits that argument.',
      solution: `def area(width, height=1):
    return width * height

print(area(5))        # 5
print(area(5, 3))     # 15`,
    },
    mistakes: [
      'Mutable default arguments are a classic trap: def f(items=[]): reuses the SAME list across every call that omits one — use None and create the list inside instead.',
      'A function with no explicit return returns None — forgetting return is a common source of mysterious None values.',
      'Positional and keyword arguments can be mixed, but every positional argument must come before any keyword argument in the call.',
    ],
  },

  {
    id: 'args-kwargs',
    title: '*args and **kwargs',
    group: 'Basics',
    explanation:
      "*args and **kwargs let a function accept a flexible, unknown number of arguments — *args gathers extra positional values into a tuple, **kwargs gathers extra named values into a dict. It's the parameter-list equivalent of saying 'and anything else you want to hand me, I'll catch it.'",
    diagram: {
      type: 'stack',
      steps: [
        { frames: [], note: 'About to call summarize("Order", "pen", "pad", qty=2, rush=True).' },
        {
          frames: [
            { id: 'f1', name: 'summarize', args: 'title="Order"', locals: 'args=("pen","pad")  kwargs={"qty":2,"rush":True}' },
          ],
          note: 'title captures the first positional argument. Every EXTRA positional argument ("pen", "pad") is collected into the tuple args, and every extra keyword argument into the dict kwargs.',
        },
        {
          frames: [
            { id: 'f1', name: 'summarize', args: 'title="Order"', locals: 'args=("pen","pad")  kwargs={"qty":2,"rush":True}', returning: 'None (just prints)' },
          ],
          note: 'Inside the function, args behaves like any normal tuple and kwargs like any normal dict — loop over them, index them, len() them.',
        },
      ],
    },
    code: `def summarize(title, *args, **kwargs):
    print("title:", title)
    print("args:", args)      # a tuple of extra positional args
    print("kwargs:", kwargs)  # a dict of extra keyword args

summarize("Order", "pen", "pad", qty=2, rush=True)
# title: Order
# args: ('pen', 'pad')
# kwargs: {'qty': 2, 'rush': True}

# The reverse also works: "unpacking" when CALLING a function
values = (1, 2)
options = {"sep": " | "}
print(*values, **options)   # 1 | 2`,
    playgroundCode: `def summarize(title, *args, **kwargs):
    print("title:", title)
    print("args:", args)
    print("kwargs:", kwargs)

summarize("Order", "pen", "pad", qty=2, rush=True)

values = (1, 2)
options = {"sep": " | "}
print(*values, **options)`,
    challenge: {
      prompt: 'Write a function total(*nums) that returns the sum of any number of arguments, then call it with 5 different numbers.',
      hint: '*nums collects every positional argument into one tuple you can sum().',
      solution: `def total(*nums):
    return sum(nums)

print(total(1, 2, 3, 4, 5))  # 15`,
    },
    mistakes: [
      "Order matters in a function definition: regular params, then *args, then keyword-only params, then **kwargs — you can't put **kwargs before *args.",
      '*args is just a name by convention, not a keyword — *values works identically; what matters is the single asterisk.',
      "**kwargs keys must be valid identifiers passed as name=value at the call site — you can't stick arbitrary non-string keys in there.",
    ],
  },

  {
    id: 'variable-scope',
    title: 'Variable Scope (local / global / nonlocal)',
    group: 'Basics',
    explanation:
      'Scope determines where a variable name is visible in your code — Python looks names up using the LEGB rule: Local (current function), Enclosing (any outer function), Global (top of the module), then Built-in. A variable created inside a function normally vanishes when that function returns; global and nonlocal are the explicit escape hatches for reaching outside the local scope.',
    diagram: {
      type: 'stack',
      steps: [
        { frames: [{ id: 'g', name: '<module>', args: '', locals: 'count = 0' }], note: 'At the top level (global scope), count = 0 exists.' },
        {
          frames: [
            { id: 'g', name: '<module>', args: '', locals: 'count = 0' },
            { id: 'o', name: 'outer', args: '', locals: 'x = "outer-x"' },
          ],
          note: 'outer() is called. It has its own local scope: x = "outer-x" lives only in this frame — the ENCLOSING scope for whatever is nested inside it.',
        },
        {
          frames: [
            { id: 'g', name: '<module>', args: '', locals: 'count = 0' },
            { id: 'o', name: 'outer', args: '', locals: 'x = "outer-x"' },
            { id: 'i', name: 'inner', args: '', locals: '(declares nonlocal x)' },
          ],
          note: "inner() is called from inside outer(). Because it declares 'nonlocal x', it doesn't create its own local x — it reaches out to outer()'s x directly.",
        },
        {
          frames: [
            { id: 'g', name: '<module>', args: '', locals: 'count = 0' },
            { id: 'o', name: 'outer', args: '', locals: 'x = "changed by inner"' },
          ],
          note: 'inner() finishes and its frame is popped. Back in outer(), x has actually been changed — nonlocal let it reach through the enclosing scope.',
        },
        {
          frames: [{ id: 'g', name: '<module>', args: '', locals: 'count = 0' }],
          note: 'outer() returns "changed by inner" and its frame is destroyed too. Only the global frame remains, with count still 0 — untouched by any of this.',
        },
      ],
    },
    code: `count = 0   # a GLOBAL variable

def outer():
    x = "outer-x"          # local to outer() — the ENCLOSING scope for inner()

    def inner():
        nonlocal x          # "don't create a new local x — use outer's"
        x = "changed by inner"

    inner()
    return x

print(outer())    # 'changed by inner'

def bump():
    global count             # "don't create a new local count — use the global one"
    count += 1

bump()
print(count)       # 1`,
    playgroundCode: `count = 0

def outer():
    x = "outer-x"
    def inner():
        nonlocal x
        x = "changed by inner"
    inner()
    return x

print(outer())

def bump():
    global count
    count += 1

bump()
print(count)`,
    challenge: {
      prompt: 'Predict, then verify: what does this print?\nn = 5\ndef f():\n    n = 10\n    return n\nprint(f(), n)',
      hint: 'Assigning n = 10 inside f() creates a brand-new LOCAL n — it never touches the global n.',
      solution: `n = 5
def f():
    n = 10   # this is a NEW local variable, shadowing the global one
    return n
print(f(), n)  # 10 5 — the global n was never touched`,
    },
    mistakes: [
      "Assigning to a name inside a function makes it local by default — even if a global with that name exists, without global/nonlocal you just shadow it, you don't modify it.",
      'Using global/nonlocal everywhere as a shortcut leads to tangled, hard-to-test code — prefer passing values in as arguments and returning values out.',
      "Reading a global variable inside a function works fine without any keyword — global is only required when you plan to ASSIGN to it.",
    ],
  },
];
