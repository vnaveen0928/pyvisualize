// ============================================================================
// PyVisualize — Advanced topic content
// ============================================================================

window.TOPICS_ADVANCED = [
  {
    id: 'closures',
    title: 'Closures',
    group: 'Advanced',
    explanation:
      "A closure is an inner function that \"remembers\" the variables from its enclosing scope even after that outer function has finished running — like packing a backpack full of the values it needs before heading out on its own. Each call to the outer function creates a fresh backpack, so multiple closures from the same factory function stay completely independent.",
    diagram: {
      type: 'backpack',
      steps: [
        { enclosingVars: [{ name: 'factor', value: '2' }], innerActive: false, note: 'make_multiplier(2) runs. factor=2 is a local variable of make_multiplier — normally it would vanish when the function returns.' },
        { enclosingVars: [{ name: 'factor', value: '2' }], innerActive: false, note: "But make_multiplier returns the inner function `multiply` WITHOUT calling it. Since multiply references factor, Python packs factor into multiply's closure — its backpack." },
        { enclosingVars: [{ name: 'factor', value: '2' }], innerActive: true, note: 'double = multiply (with factor=2 in its backpack). double(5) reaches into the backpack for factor and returns 5 * 2 = 10.' },
        { enclosingVars: [{ name: 'factor', value: '3' }], innerActive: true, note: 'triple = make_multiplier(3) creates a COMPLETELY SEPARATE backpack with factor=3 — triple(5) returns 15, and double is entirely unaffected.' },
      ],
    },
    code: `def make_multiplier(factor):
    def multiply(x):
        return x * factor     # multiply "remembers" factor
    return multiply

double = make_multiplier(2)   # factor=2 gets packed into double's closure
triple = make_multiplier(3)   # a SEPARATE factor=3, packed into triple's closure

print(double(5))    # 10
print(triple(5))    # 15 — independent of double

print(double.__closure__[0].cell_contents)  # 2 — you can even peek inside`,
    playgroundCode: `def make_multiplier(factor):
    def multiply(x):
        return x * factor
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)
print(double(5))
print(triple(5))
print(double.__closure__[0].cell_contents)`,
    challenge: {
      prompt: "Write make_counter() that returns a function which returns an incrementing count each time it's called, starting at 1 (use nonlocal).",
      hint: 'count = 0 in the outer function; inner uses nonlocal count; count += 1; return count',
      solution: `def make_counter():
    count = 0
    def counter():
        nonlocal count
        count += 1
        return count
    return counter

c = make_counter()
print(c())  # 1
print(c())  # 2
print(c())  # 3`,
    },
    mistakes: [
      'Forgetting nonlocal when the inner function needs to REASSIGN (not just read) a variable from the enclosing scope — without it, Python creates a brand-new local variable instead.',
      "The classic late-binding closure bug: building closures in a loop ([lambda: i for i in range(3)]) — all three lambdas share the SAME i, and by call time i is 2 for all of them. Fix with a default argument: lambda i=i: i.",
      "Assuming closures copy the enclosing variable's VALUE at creation time — they keep a reference to the variable itself, which is exactly why the loop bug above happens.",
    ],
  },

  {
    id: 'metaclasses',
    title: 'Metaclasses',
    group: 'Advanced',
    explanation:
      "A metaclass is the class of a class — just as an object is created by calling its class, a class itself is created by calling its metaclass, and `type` is the default metaclass that builds every class you've ever written. Overriding a metaclass lets you hook into and customize the very process of class creation itself, which is powerful but rarely necessary.",
    diagram: {
      type: 'tree',
      steps: [
        { nodes: [{ id: 'type', label: 'type', x: 50, y: 10, sub: 'the default metaclass' }], edges: [], note: "`type` sits at the very top — it's the default metaclass that builds every ordinary class in Python." },
        {
          nodes: [
            { id: 'type', label: 'type', x: 50, y: 10 },
            { id: 'meta', label: 'MyMeta(type)', x: 50, y: 40, tone: 'active' },
          ],
          edges: [{ from: 'meta', to: 'type', label: 'instance of', tone: 'active' }],
          note: 'class MyMeta(type): ... defines a CUSTOM metaclass — itself built by type, since metaclasses are classes too.',
        },
        {
          nodes: [
            { id: 'type', label: 'type', x: 50, y: 10 },
            { id: 'meta', label: 'MyMeta(type)', x: 50, y: 40 },
            { id: 'cls', label: 'MyClass', x: 50, y: 68, sub: 'metaclass=MyMeta', tone: 'active' },
          ],
          edges: [{ from: 'meta', to: 'type', label: 'instance of' }, { from: 'cls', to: 'meta', label: 'instance of', tone: 'active' }],
          note: 'class MyClass(metaclass=MyMeta): ... — Python calls MyMeta(...) to construct MyClass, instead of the default type(...). This is where you could inject custom behavior.',
        },
        {
          nodes: [
            { id: 'type', label: 'type', x: 50, y: 10 },
            { id: 'meta', label: 'MyMeta(type)', x: 50, y: 40 },
            { id: 'cls', label: 'MyClass', x: 50, y: 68 },
            { id: 'obj', label: 'obj = MyClass()', x: 50, y: 94, tone: 'active' },
          ],
          edges: [
            { from: 'meta', to: 'type', label: 'instance of' },
            { from: 'cls', to: 'meta', label: 'instance of' },
            { from: 'obj', to: 'cls', label: 'instance of', tone: 'active' },
          ],
          note: 'obj = MyClass() then calls MyClass(...) as usual to build an ordinary instance — completely normal from here on.',
        },
      ],
    },
    code: `class MyMeta(type):
    def __new__(mcs, name, bases, namespace):
        print(f"Creating class {name}")
        return super().__new__(mcs, name, bases, namespace)

class MyClass(metaclass=MyMeta):    # MyMeta.__new__ runs RIGHT NOW
    def greet(self):
        return "hi"

# Output when the class body above is executed:
# Creating class MyClass

obj = MyClass()      # this just makes a normal instance
print(obj.greet())    # 'hi'

print(type(MyClass))   # <class '__main__.MyMeta'>
print(type(int))        # <class 'type'>  — every ordinary class's metaclass`,
    playgroundCode: `class MyMeta(type):
    def __new__(mcs, name, bases, namespace):
        print(f"Creating class {name}")
        return super().__new__(mcs, name, bases, namespace)

class MyClass(metaclass=MyMeta):
    def greet(self):
        return "hi"

obj = MyClass()
print(obj.greet())
print(type(MyClass))
print(type(int))`,
    challenge: {
      prompt: 'Write a metaclass UpperAttrMeta that uppercases every non-dunder attribute name defined in the class body (a classic metaclass party trick).',
      hint: "Loop over namespace.items() in __new__, build a new dict with .upper() keys for names not starting with '__'.",
      solution: `class UpperAttrMeta(type):
    def __new__(mcs, name, bases, namespace):
        upper_ns = {
            (k.upper() if not k.startswith('__') else k): v
            for k, v in namespace.items()
        }
        return super().__new__(mcs, name, bases, upper_ns)

class Config(metaclass=UpperAttrMeta):
    debug = True

print(Config.DEBUG)  # True`,
    },
    mistakes: [
      'Reaching for a metaclass to solve a problem a simpler tool (a decorator, or __init_subclass__) would solve more clearly — metaclasses are powerful but rarely the right first choice.',
      "Confusing __new__ and __init__ on a metaclass — __new__ actually CREATES the class object, __init__ just initializes the already-created one.",
      'Forgetting that a class using a custom metaclass must have base classes with a compatible metaclass, or Python raises a TypeError about metaclass conflicts.',
    ],
  },

  {
    id: 'descriptors',
    title: 'Descriptors',
    group: 'Advanced',
    explanation:
      "A descriptor is an object that customizes what happens when you get, set, or delete an attribute on another class, by defining __get__, __set__, or __delete__ — it's the mechanism that quietly powers @property, methods, and much of Python's own attribute machinery. Whenever you write obj.attr, Python may secretly detour through a descriptor's __get__ before handing you a plain value.",
    diagram: {
      type: 'flow',
      steps: [
        {
          nodes: [
            { id: 'access', label: 'w.temperature = -300', x: 6, y: 50, shape: 'start' },
            { id: 'lookup', label: 'sees a descriptor on the class', x: 36, y: 50, shape: 'process' },
            { id: 'set', label: 'Celsius.__set__(w, -300)', x: 66, y: 50, shape: 'process' },
            { id: 'check', label: 'validates & raises', x: 94, y: 50, shape: 'end' },
          ],
          edges: [{ from: 'access', to: 'lookup' }, { from: 'lookup', to: 'set' }, { from: 'set', to: 'check' }],
          note: 'w = Weather(); w.temperature = -300 is about to run.',
        },
        {
          nodes: [
            { id: 'access', label: 'w.temperature = -300', x: 6, y: 50, shape: 'start', active: true },
            { id: 'lookup', label: 'sees a descriptor on the class', x: 36, y: 50, shape: 'process', active: true },
            { id: 'set', label: 'Celsius.__set__(w, -300)', x: 66, y: 50, shape: 'process' },
            { id: 'check', label: 'validates & raises', x: 94, y: 50, shape: 'end' },
          ],
          edges: [{ from: 'access', to: 'lookup', active: true }, { from: 'lookup', to: 'set' }, { from: 'set', to: 'check' }],
          note: "Python sees that `temperature` on the Weather class is a descriptor object (it has __set__) — not a plain value.",
        },
        {
          nodes: [
            { id: 'access', label: 'w.temperature = -300', x: 6, y: 50, shape: 'start' },
            { id: 'lookup', label: 'sees a descriptor on the class', x: 36, y: 50, shape: 'process' },
            { id: 'set', label: 'Celsius.__set__(w, -300)', x: 66, y: 50, shape: 'process', active: true },
            { id: 'check', label: 'validates & raises', x: 94, y: 50, shape: 'end' },
          ],
          edges: [{ from: 'access', to: 'lookup' }, { from: 'lookup', to: 'set', active: true }, { from: 'set', to: 'check' }],
          note: 'Instead of just storing -300 directly, Python detours through Celsius.__set__(w, -300).',
        },
        {
          nodes: [
            { id: 'access', label: 'w.temperature = -300', x: 6, y: 50, shape: 'start' },
            { id: 'lookup', label: 'sees a descriptor on the class', x: 36, y: 50, shape: 'process' },
            { id: 'set', label: 'Celsius.__set__(w, -300)', x: 66, y: 50, shape: 'process' },
            { id: 'check', label: 'ValueError: too cold!', x: 94, y: 50, shape: 'end', active: true },
          ],
          edges: [{ from: 'access', to: 'lookup' }, { from: 'lookup', to: 'set' }, { from: 'set', to: 'check', active: true }],
          note: 'Inside __set__, YOUR validation logic runs: -300 is below -273.15 (absolute zero), so it raises a ValueError instead of ever storing the bad value.',
        },
      ],
    },
    code: `class Celsius:
    def __set_name__(self, owner, name):
        self.name = "_" + name              # e.g. "_temperature"

    def __get__(self, obj, objtype=None):
        return getattr(obj, self.name)

    def __set__(self, obj, value):
        if value < -273.15:
            raise ValueError("below absolute zero!")
        setattr(obj, self.name, value)

class Weather:
    temperature = Celsius()      # a descriptor, shared by all instances

w = Weather()
w.temperature = 22            # -> Celsius.__set__(w, 22)
print(w.temperature)           # -> Celsius.__get__(w, Weather) -> 22
# w.temperature = -300         # ValueError: below absolute zero!

# @property is just a built-in, convenient descriptor:
class Circle:
    def __init__(self, r):
        self._r = r
    @property
    def area(self):
        return 3.14159 * self._r ** 2`,
    playgroundCode: `class Celsius:
    def __set_name__(self, owner, name):
        self.name = "_" + name
    def __get__(self, obj, objtype=None):
        return getattr(obj, self.name)
    def __set__(self, obj, value):
        if value < -273.15:
            raise ValueError("below absolute zero!")
        setattr(obj, self.name, value)

class Weather:
    temperature = Celsius()

w = Weather()
w.temperature = 22
print(w.temperature)
try:
    w.temperature = -300
except ValueError as e:
    print("caught:", e)`,
    challenge: {
      prompt: "Write a descriptor PositiveNumber that raises ValueError if you try to set it to a value <= 0, and use it for a Product class's price attribute.",
      hint: "Mirror Celsius's __set__, but check value <= 0 instead.",
      solution: `class PositiveNumber:
    def __set_name__(self, owner, name):
        self.name = '_' + name
    def __get__(self, obj, objtype=None):
        return getattr(obj, self.name)
    def __set__(self, obj, value):
        if value <= 0:
            raise ValueError('must be positive')
        setattr(obj, self.name, value)

class Product:
    price = PositiveNumber()

p = Product()
p.price = 9.99
print(p.price)`,
    },
    mistakes: [
      "Storing the value directly as self.value on the DESCRIPTOR instance itself (shared by every object using it!) instead of on each individual owning instance — that leaks state between unrelated objects.",
      "Forgetting __set_name__ (Python 3.6+) is how a descriptor learns its own attribute name automatically — without it you must hardcode the name, which is error-prone.",
      '@property is itself implemented as a descriptor under the hood — descriptors are the general mechanism, @property is just the friendly shortcut for the common case.',
    ],
  },

  {
    id: 'multiple-inheritance-mro',
    title: 'Multiple Inheritance & MRO',
    group: 'Advanced',
    explanation:
      'When a class inherits from multiple parents, Python needs one consistent order to search for methods — the Method Resolution Order (MRO), computed by the C3 linearization algorithm, inspectable via ClassName.__mro__. The classic "diamond" shape (two parents sharing a common grandparent) is exactly why a naive left-to-right search would be unsafe, and why Python computes something smarter.',
    diagram: {
      type: 'tree',
      steps: [
        {
          nodes: [
            { id: 'A', label: 'A', x: 50, y: 8, sub: 'greet() -> "A"' },
            { id: 'B', label: 'B', x: 25, y: 38, sub: '(no greet)' },
            { id: 'C', label: 'C', x: 75, y: 38, sub: 'greet() -> "C"' },
            { id: 'D', label: 'D(B, C)', x: 50, y: 70, sub: '(no greet)' },
          ],
          edges: [{ from: 'B', to: 'A' }, { from: 'C', to: 'A' }, { from: 'D', to: 'B' }, { from: 'D', to: 'C' }],
          note: 'D().greet() is called. D itself has no greet(), so Python searches the MRO: D -> B -> C -> A -> object.',
        },
        {
          nodes: [
            { id: 'A', label: 'A', x: 50, y: 8, sub: 'greet() -> "A"' },
            { id: 'B', label: 'B', x: 25, y: 38, sub: '(no greet)' },
            { id: 'C', label: 'C', x: 75, y: 38, sub: 'greet() -> "C"' },
            { id: 'D', label: 'D(B, C)', x: 50, y: 70, sub: 'checked 1st — no greet', tone: 'active' },
          ],
          edges: [{ from: 'B', to: 'A' }, { from: 'C', to: 'A' }, { from: 'D', to: 'B' }, { from: 'D', to: 'C' }],
          note: 'D is checked first — it has no greet() of its own.',
        },
        {
          nodes: [
            { id: 'A', label: 'A', x: 50, y: 8, sub: 'greet() -> "A"' },
            { id: 'B', label: 'B', x: 25, y: 38, sub: 'checked 2nd — no greet', tone: 'active' },
            { id: 'C', label: 'C', x: 75, y: 38, sub: 'greet() -> "C"' },
            { id: 'D', label: 'D(B, C)', x: 50, y: 70 },
          ],
          edges: [{ from: 'B', to: 'A' }, { from: 'C', to: 'A' }, { from: 'D', to: 'B', tone: 'active' }, { from: 'D', to: 'C' }],
          note: "B is checked next — B doesn't define greet() either, it just inherits.",
        },
        {
          nodes: [
            { id: 'A', label: 'A', x: 50, y: 8, sub: 'greet() -> "A"' },
            { id: 'B', label: 'B', x: 25, y: 38, sub: '(no greet)' },
            { id: 'C', label: 'C', x: 75, y: 38, sub: 'checked 3rd — FOUND!', tone: 'active' },
            { id: 'D', label: 'D(B, C)', x: 50, y: 70 },
          ],
          edges: [{ from: 'B', to: 'A' }, { from: 'C', to: 'A' }, { from: 'D', to: 'B' }, { from: 'D', to: 'C', tone: 'active' }],
          note: 'C is checked next — and C DOES define its own greet(), returning "C". The search stops immediately here.',
        },
        {
          nodes: [
            { id: 'A', label: 'A', x: 50, y: 8, sub: 'never reached!' },
            { id: 'B', label: 'B', x: 25, y: 38, sub: '(no greet)' },
            { id: 'C', label: 'C', x: 75, y: 38, sub: 'greet() -> "C" — used' },
            { id: 'D', label: 'D(B, C)', x: 50, y: 70 },
          ],
          edges: [{ from: 'B', to: 'A' }, { from: 'C', to: 'A' }, { from: 'D', to: 'B' }, { from: 'D', to: 'C' }],
          note: "A is never even checked, even though it also defines greet() — this is exactly why MRO order matters: B before C, C before A, per C3 linearization.",
        },
      ],
    },
    code: `class A:
    def greet(self):
        return "A"

class B(A):
    pass

class C(A):
    def greet(self):
        return "C"

class D(B, C):
    pass

print(D.__mro__)
# (D, B, C, A, object)

print(D().greet())   # 'C' — B has no greet, so Python moves on to C, which does`,
    playgroundCode: `class A:
    def greet(self):
        return "A"

class B(A):
    pass

class C(A):
    def greet(self):
        return "C"

class D(B, C):
    pass

print([c.__name__ for c in D.__mro__])
print(D().greet())`,
    challenge: {
      prompt: 'Predict D.__mro__ for this diamond, then verify: class A: pass / class B(A): pass / class C(A): pass / class D(B, C): pass',
      hint: 'MRO always starts with the class itself, then follows C3 linearization — left-to-right, deepest-first, each class appearing exactly once.',
      solution: `class A: pass
class B(A): pass
class C(A): pass
class D(B, C): pass

print(D.__mro__)
# (<class D>, <class B>, <class C>, <class A>, <class object>)`,
    },
    mistakes: [
      "Assuming multiple inheritance searches depth-first, left-to-right the naive way — Python's C3 linearization is smarter, specifically to avoid visiting a shared ancestor more than once or out of order.",
      "Defining conflicting methods in sibling parent classes and being surprised which one 'wins' — always check ClassName.__mro__ instead of guessing.",
      'Overusing multiple inheritance for convenience — deep, tangled hierarchies are notoriously hard to reason about; prefer composition or small single-purpose mixins.',
    ],
  },

  {
    id: 'abstract-base-classes',
    title: 'Abstract Base Classes',
    group: 'Advanced',
    explanation:
      "An abstract base class (ABC) defines a required interface — method names every subclass MUST implement — without providing a usable implementation itself, and Python refuses to let you instantiate it directly if any abstract method is left unfilled. It's a contract: 'anything calling itself a Shape must have an area() method,' enforced automatically instead of just hoped for.",
    diagram: {
      type: 'tree',
      steps: [
        {
          nodes: [{ id: 'shape', label: 'Shape(ABC)', x: 50, y: 15, sub: '@abstractmethod area()', tone: 'abstract' }],
          edges: [],
          note: 'from abc import ABC, abstractmethod\nclass Shape(ABC): @abstractmethod def area(self): ... — Shape defines the CONTRACT but has no working area() itself.',
        },
        {
          nodes: [{ id: 'shape', label: 'Shape() — DIRECTLY', x: 50, y: 15, sub: 'TypeError!', tone: 'abstract' }],
          edges: [],
          note: "Shape() directly raises a TypeError: Can't instantiate abstract class Shape with abstract method area — enforced before you even get an object.",
        },
        {
          nodes: [
            { id: 'shape', label: 'Shape(ABC)', x: 50, y: 15, sub: '@abstractmethod area()', tone: 'abstract' },
            { id: 'circle', label: 'Circle', x: 30, y: 60, sub: 'implements area()', tone: 'active' },
          ],
          edges: [{ from: 'circle', to: 'shape', label: 'implements area()', tone: 'active' }],
          note: 'class Circle(Shape): def area(self): ... — Circle provides a real implementation, so Circle() works fine.',
        },
        {
          nodes: [
            { id: 'shape', label: 'Shape(ABC)', x: 50, y: 15, sub: '@abstractmethod area()', tone: 'abstract' },
            { id: 'circle', label: 'Circle', x: 30, y: 60, sub: 'implements area()' },
            { id: 'incomplete', label: 'IncompleteShape', x: 72, y: 60, sub: 'missing area() — TypeError!', tone: 'active' },
          ],
          edges: [{ from: 'circle', to: 'shape' }, { from: 'incomplete', to: 'shape', label: 'missing area()', tone: 'active' }],
          note: 'class IncompleteShape(Shape): pass — forgets to implement area(). IncompleteShape() ALSO raises a TypeError, exactly like Shape() did.',
        },
      ],
    },
    code: `from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        ...          # no implementation — subclasses MUST provide one

class Circle(Shape):
    def __init__(self, r): self.r = r
    def area(self): return 3.14159 * self.r ** 2

# shape = Shape()          # TypeError: Can't instantiate abstract class
c = Circle(3)
print(c.area())              # works fine

class IncompleteShape(Shape):
    pass                      # forgot to implement area()

# broken = IncompleteShape()  # TypeError, same reason as Shape()`,
    playgroundCode: `from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        ...

class Circle(Shape):
    def __init__(self, r): self.r = r
    def area(self): return 3.14159 * self.r ** 2

c = Circle(3)
print(c.area())

try:
    Shape()
except TypeError as e:
    print("caught:", e)`,
    challenge: {
      prompt: "Define an ABC Animal with an abstract method sound(), then a subclass Cow that implements it to return 'Moo'. Instantiate Cow and print sound().",
      hint: 'from abc import ABC, abstractmethod; @abstractmethod def sound(self): ...',
      solution: `from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def sound(self):
        ...

class Cow(Animal):
    def sound(self):
        return "Moo"

print(Cow().sound())`,
    },
    mistakes: [
      "Forgetting the class must actually inherit from ABC (or use ABCMeta as its metaclass) — without that, @abstractmethod is decorative and enforces nothing.",
      "Believing an abstract method can't have a body — it can! Subclasses can even call it via super().area() to reuse shared logic, as long as they still provide their own override.",
      'Using an ABC as a substitute for good testing — it enforces that a method EXISTS, not that it behaves correctly.',
    ],
  },

  {
    id: 'multithreading',
    title: 'Multithreading',
    group: 'Advanced',
    explanation:
      "Threading runs multiple functions seemingly 'at once' within a single process, sharing the same memory — great for tasks that spend most of their time waiting (network calls, file I/O), since one thread can run while another waits. In standard CPython, only ONE thread executes Python bytecode at any instant (the GIL), so threading speeds up I/O-bound work but not CPU-bound crunching.",
    diagram: {
      type: 'timeline',
      steps: [
        {
          lanes: [{ label: 'Thread-1', segments: [] }, { label: 'Thread-2', segments: [] }],
          cursorPct: 0,
          note: 'Two threads are started to download two files. Both begin around the same time.',
        },
        {
          lanes: [{ label: 'Thread-1', segments: [{ startPct: 0, widthPct: 15, tone: 'run' }] }, { label: 'Thread-2', segments: [] }],
          cursorPct: 15,
          note: 'Thread-1 gets the GIL first and starts its request, then hits network I/O and releases the GIL while it waits.',
        },
        {
          lanes: [
            { label: 'Thread-1', segments: [{ startPct: 0, widthPct: 15, tone: 'run' }, { startPct: 15, widthPct: 55, tone: 'io' }] },
            { label: 'Thread-2', segments: [{ startPct: 15, widthPct: 15, tone: 'run' }] },
          ],
          cursorPct: 30,
          note: 'While Thread-1 waits on the network, Thread-2 grabs the GIL and starts its own request — this is where threading actually helps.',
        },
        {
          lanes: [
            { label: 'Thread-1', segments: [{ startPct: 0, widthPct: 15, tone: 'run' }, { startPct: 15, widthPct: 55, tone: 'io' }, { startPct: 70, widthPct: 15, tone: 'run' }] },
            { label: 'Thread-2', segments: [{ startPct: 15, widthPct: 15, tone: 'run' }, { startPct: 30, widthPct: 60, tone: 'io' }] },
          ],
          cursorPct: 70,
          note: "Thread-1's download finishes; it reacquires the GIL briefly to process the result while Thread-2 is still waiting on I/O.",
        },
        {
          lanes: [
            {
              label: 'Thread-1',
              segments: [
                { startPct: 0, widthPct: 15, tone: 'run' },
                { startPct: 15, widthPct: 55, tone: 'io' },
                { startPct: 70, widthPct: 15, tone: 'run' },
                { startPct: 85, widthPct: 10, tone: 'done' },
              ],
            },
            {
              label: 'Thread-2',
              segments: [
                { startPct: 15, widthPct: 15, tone: 'run' },
                { startPct: 30, widthPct: 60, tone: 'io' },
                { startPct: 90, widthPct: 8, tone: 'done' },
              ],
            },
          ],
          note: 'Both downloads finish around the same total wall-clock time — much faster than one after another, even though only one thread ever executes Python code at a time.',
        },
      ],
    },
    code: `import threading, time

def download(name, seconds):
    print(f"{name}: starting download")
    time.sleep(seconds)         # simulates waiting on the network (releases the GIL!)
    print(f"{name}: done")

t1 = threading.Thread(target=download, args=("file1", 1))
t2 = threading.Thread(target=download, args=("file2", 1))

t1.start()   # both threads run "concurrently"
t2.start()
t1.join()     # wait for t1 to finish
t2.join()     # wait for t2 to finish
print("Both downloads complete")
# total time ~= 1 second, NOT 2 — they overlapped while waiting`,
    playgroundCode: `# Real OS threads aren't available inside this browser-based playground,
# so here's a simulation of what the timeline above represents:
def simulate(name, steps):
    for s in steps:
        print(f"{name}: {s}")

simulate("Thread-1", ["start request", "waiting on network...", "got response", "done"])
simulate("Thread-2", ["start request", "waiting on network...", "got response", "done"])
print("(In real threaded code, these two would interleave while waiting on I/O.)")`,
    challenge: {
      prompt: "Write real threading code (won't run in-browser) that starts two threads, each printing their name 3 times with a short sleep between prints, then joins both.",
      hint: 'threading.Thread(target=fn, args=(...)).start(), then .join() on both.',
      solution: `import threading, time

def worker(name):
    for i in range(3):
        print(name, i)
        time.sleep(0.1)

t1 = threading.Thread(target=worker, args=('A',))
t2 = threading.Thread(target=worker, args=('B',))
t1.start(); t2.start()
t1.join(); t2.join()`,
    },
    mistakes: [
      'Expecting threading to speed up CPU-bound work (heavy math/loops) — the GIL means only one thread runs Python bytecode at a time, so pure computation sees little to no benefit.',
      'Forgetting .join() — without it, your main program can exit before the threads finish their work.',
      'Sharing mutable state between threads without a Lock — two threads incrementing the same counter can race and lose updates, even though only one holds the GIL at a time.',
    ],
  },

  {
    id: 'multiprocessing',
    title: 'Multiprocessing',
    group: 'Advanced',
    explanation:
      'Multiprocessing runs separate Python processes, each with its own memory and its own GIL, so unlike threads they can genuinely execute CPU-heavy code in parallel across multiple CPU cores. The cost is heavier setup (each process starts its own Python interpreter) and no shared memory by default — passing data between processes means explicitly serializing (pickling) it across a queue or pipe.',
    diagram: {
      type: 'timeline',
      steps: [
        { lanes: [{ label: 'Process-1', segments: [] }, { label: 'Process-2', segments: [] }], note: 'Two CPU-heavy tasks (crunching large number ranges) are dispatched to two separate processes.' },
        {
          lanes: [
            { label: 'Process-1', segments: [{ startPct: 0, widthPct: 80, tone: 'run' }] },
            { label: 'Process-2', segments: [{ startPct: 0, widthPct: 80, tone: 'run' }] },
          ],
          note: "Unlike threads, each process has its OWN interpreter and its OWN GIL — both bars are genuinely 'running' at the exact same wall-clock time, on two separate CPU cores.",
        },
        {
          lanes: [
            { label: 'Process-1', segments: [{ startPct: 0, widthPct: 80, tone: 'run' }, { startPct: 80, widthPct: 10, tone: 'done' }] },
            { label: 'Process-2', segments: [{ startPct: 0, widthPct: 90, tone: 'run' }, { startPct: 90, widthPct: 8, tone: 'done' }] },
          ],
          note: 'Both processes finish independently. Total time is close to however long the SLOWER one takes — true parallelism, not just clever waiting.',
        },
        {
          lanes: [
            { label: 'Process-1', segments: [{ startPct: 0, widthPct: 80, tone: 'run' }, { startPct: 80, widthPct: 10, tone: 'done' }] },
            { label: 'Process-2', segments: [{ startPct: 0, widthPct: 90, tone: 'run' }, { startPct: 90, widthPct: 8, tone: 'done' }] },
            { label: 'Main', segments: [{ startPct: 0, widthPct: 90, tone: 'wait' }, { startPct: 90, widthPct: 8, tone: 'run' }] },
          ],
          note: 'The main process must explicitly collect results (e.g. via pool.map()) — each result is pickled (serialized) to cross the process boundary, which has its own overhead.',
        },
      ],
    },
    code: `from multiprocessing import Pool

def square(n):
    return n * n

if __name__ == "__main__":
    with Pool(processes=4) as pool:
        results = pool.map(square, [1, 2, 3, 4, 5])
    print(results)   # [1, 4, 9, 16, 25] — computed across 4 separate processes`,
    playgroundCode: `# multiprocessing needs real OS processes, which this in-browser playground
# can't provide — but here's what the equivalent single-process code
# computes, so you can see the expected result:

def square(n):
    return n * n

results = [square(n) for n in [1, 2, 3, 4, 5]]
print(results)  # [1, 4, 9, 16, 25]

# On your own machine, multiprocessing.Pool(4).map(square, [...]) would
# compute this same list across 4 separate CPU cores, in parallel.`,
    challenge: {
      prompt: 'Write the code (no need to run it here) for a Pool of 2 processes that computes the cube of numbers 1 through 6 using pool.map().',
      hint: 'from multiprocessing import Pool; Pool(2).map(cube, range(1,7))',
      solution: `from multiprocessing import Pool

def cube(n):
    return n ** 3

if __name__ == '__main__':
    with Pool(2) as pool:
        print(pool.map(cube, range(1, 7)))`,
    },
    mistakes: [
      'Forgetting the if __name__ == "__main__": guard — without it, each spawned child process can re-import your script and recursively spawn infinite processes on some platforms.',
      'Assuming data is shared between processes like it is between threads — each process gets its own COPY of memory; pass data explicitly via arguments, Queues, or shared memory objects.',
      "Using multiprocessing for I/O-bound work (network/file waiting) — the heavy process-startup cost usually isn't worth it there; threading or asyncio fit better.",
    ],
  },

  {
    id: 'asyncio',
    title: 'asyncio (async / await)',
    group: 'Advanced',
    explanation:
      "asyncio runs many tasks cooperatively on a SINGLE thread by explicitly pausing at await points — instead of the OS switching between threads for you, your own code says 'I'm waiting now, let someone else run,' which makes thousands of concurrent I/O-bound tasks cheap since there's no thread-switching overhead at all.",
    diagram: {
      type: 'timeline',
      steps: [
        { lanes: [{ label: 'Task-A', segments: [] }, { label: 'Task-B', segments: [] }], note: 'async def fetch_a() and fetch_b() are scheduled with asyncio.gather() — both on the SAME single thread.' },
        {
          lanes: [{ label: 'Task-A', segments: [{ startPct: 0, widthPct: 10, tone: 'run' }] }, { label: 'Task-B', segments: [] }],
          note: 'Task-A starts running. It hits await (simulating a network call) and voluntarily YIELDS control back to the event loop instead of blocking.',
        },
        {
          lanes: [
            { label: 'Task-A', segments: [{ startPct: 0, widthPct: 10, tone: 'run' }, { startPct: 10, widthPct: 60, tone: 'io' }] },
            { label: 'Task-B', segments: [{ startPct: 10, widthPct: 10, tone: 'run' }] },
          ],
          note: 'While Task-A awaits, the event loop picks up Task-B and starts running it — on the very same thread, just at a different moment in time.',
        },
        {
          lanes: [
            { label: 'Task-A', segments: [{ startPct: 0, widthPct: 10, tone: 'run' }, { startPct: 10, widthPct: 60, tone: 'io' }] },
            { label: 'Task-B', segments: [{ startPct: 10, widthPct: 10, tone: 'run' }, { startPct: 20, widthPct: 55, tone: 'io' }] },
          ],
          note: "Task-B also hits an await and yields. Both tasks are now 'awaiting' — the event loop is free to check on either the instant it resolves.",
        },
        {
          lanes: [
            {
              label: 'Task-A',
              segments: [{ startPct: 0, widthPct: 10, tone: 'run' }, { startPct: 10, widthPct: 60, tone: 'io' }, { startPct: 70, widthPct: 10, tone: 'done' }],
            },
            {
              label: 'Task-B',
              segments: [{ startPct: 10, widthPct: 10, tone: 'run' }, { startPct: 20, widthPct: 55, tone: 'io' }, { startPct: 75, widthPct: 10, tone: 'done' }],
            },
          ],
          note: 'As each await resolves, the event loop resumes that exact task from where it paused. Both finish close together — cooperative concurrency, all on one thread.',
        },
      ],
    },
    code: `import asyncio

async def fetch(name, seconds):
    print(f"{name}: starting")
    await asyncio.sleep(seconds)   # yields control back to the event loop
    print(f"{name}: done")
    return f"{name} result"

async def main():
    results = await asyncio.gather(
        fetch("A", 1),
        fetch("B", 1),
    )
    print(results)

asyncio.run(main())
# total time ~= 1 second, NOT 2 — they overlapped while "waiting"`,
    playgroundCode: `# asyncio.run() can conflict with the playground's own event loop, so
# here's a straight-line simulation of the interleaving shown above:
def simulate(name, steps):
    for s in steps:
        print(f"{name}: {s}")

simulate("Task-A", ["starting", "await sleep(1) -> yields", "resumed", "done"])
simulate("Task-B", ["starting", "await sleep(1) -> yields", "resumed", "done"])
print("(Both actually ran cooperatively, on one thread, interleaved in time.)")`,
    challenge: {
      prompt: "Write (don't need to run) an async function fetch_all() that awaits three fetch(name, 1) coroutines concurrently with asyncio.gather() and prints all three results.",
      hint: "await asyncio.gather(fetch('A',1), fetch('B',1), fetch('C',1))",
      solution: `import asyncio

async def fetch(name, seconds):
    await asyncio.sleep(seconds)
    return name

async def fetch_all():
    results = await asyncio.gather(fetch('A', 1), fetch('B', 1), fetch('C', 1))
    print(results)

asyncio.run(fetch_all())`,
    },
    mistakes: [
      'Forgetting await before a coroutine call — fetch("A", 1) alone just creates a coroutine OBJECT without running it; you must await it (or schedule it with gather/create_task).',
      "Mixing blocking calls (time.sleep(), heavy CPU work) into async code — a blocking call freezes the ENTIRE event loop, since nothing else can run meanwhile.",
      'Assuming asyncio gives you parallelism like multiprocessing — it is concurrency on a SINGLE thread; CPU-bound work sees no speedup, only I/O-bound waiting does.',
    ],
  },

  {
    id: 'gil',
    title: 'The GIL (Global Interpreter Lock)',
    group: 'Advanced',
    explanation:
      "The Global Interpreter Lock (GIL) is a single lock inside CPython that only one thread can hold at a time, and holding it is required to execute Python bytecode — so even on a multi-core machine, only one thread is ever running actual Python code at any given instant. Threads pass the key back and forth (especially whenever one blocks on I/O), which is why threading helps with waiting-heavy work but not CPU-heavy crunching.",
    diagram: {
      type: 'key',
      steps: [
        {
          threads: [{ name: 'Thread-1', hasKey: true, waiting: false }, { name: 'Thread-2', hasKey: false, waiting: true }, { name: 'Thread-3', hasKey: false, waiting: true }],
          note: "Thread-1 currently holds the GIL and is executing Python bytecode. Thread-2 and Thread-3 can't run any Python code right now — they're blocked waiting for the key.",
        },
        {
          threads: [{ name: 'Thread-1', hasKey: false, waiting: true }, { name: 'Thread-2', hasKey: true, waiting: false }, { name: 'Thread-3', hasKey: false, waiting: true }],
          note: 'Thread-1 hits a blocking I/O call (or the interpreter\'s check-interval expires) and releases the GIL. Thread-2 grabs it and starts running.',
        },
        {
          threads: [{ name: 'Thread-1', hasKey: false, waiting: true }, { name: 'Thread-2', hasKey: false, waiting: true }, { name: 'Thread-3', hasKey: true, waiting: false }],
          note: "Thread-2's turn ends too, and Thread-3 gets the key next. At every instant, exactly one thread — never zero, never more than one — holds it.",
        },
        {
          threads: [{ name: 'Thread-1', hasKey: true, waiting: false }, { name: 'Thread-2', hasKey: false, waiting: true }, { name: 'Thread-3', hasKey: false, waiting: true }],
          note: "The key keeps getting passed around. This is why CPU-bound multithreaded code doesn't actually run faster in CPython — only I/O-bound code benefits, because releasing the GIL during a wait lets someone else make progress.",
        },
      ],
    },
    code: `# The GIL isn't something you code around directly — it's a fact
# about the CPython interpreter itself. But you can OBSERVE its effect:

import threading, time

def cpu_burn(n):
    total = 0
    for i in range(n):
        total += i
    return total

start = time.time()
cpu_burn(20_000_000)
cpu_burn(20_000_000)
print("sequential:", time.time() - start)

start = time.time()
t1 = threading.Thread(target=cpu_burn, args=(20_000_000,))
t2 = threading.Thread(target=cpu_burn, args=(20_000_000,))
t1.start(); t2.start()
t1.join(); t2.join()
print("threaded:", time.time() - start)
# threaded time is roughly the SAME as sequential — the GIL prevented
# any real speedup for this CPU-bound work

# multiprocessing sidesteps the GIL entirely, since each process gets its own:
# from multiprocessing import Process   # -> genuine parallel CPU work`,
    playgroundCode: `import time

def cpu_burn(n):
    total = 0
    for i in range(n):
        total += i
    return total

start = time.time()
cpu_burn(2_000_000)
cpu_burn(2_000_000)
print("time for two sequential CPU-bound calls:", round(time.time() - start, 4))

# On real CPython, wrapping these two calls in threads would NOT make this
# faster, because of the GIL -- unlike multiprocessing, which would.`,
    challenge: {
      prompt: 'In a comment, explain why threading.Thread would NOT speed up two calls to a pure CPU-bound function in CPython, but multiprocessing.Process would.',
      hint: 'Think about what each thread needs to hold before it can execute any Python bytecode.',
      solution: `# threading.Thread: both threads share ONE GIL. Only one can execute
# Python bytecode at a time, so two CPU-bound threads take turns --
# no wall-clock speedup, maybe even slightly SLOWER due to switching overhead.
#
# multiprocessing.Process: each process gets its OWN Python interpreter
# and its OWN GIL. Two CPU-bound processes can genuinely run on two
# separate CPU cores at the same time -- real parallel speedup.
print("see comment above")`,
    },
    mistakes: [
      'Assuming the GIL means Python threads are useless — they genuinely help with I/O-bound work (network, disk, waiting on other systems), just not CPU-bound crunching.',
      "Believing the GIL is a Python LANGUAGE feature — it's specific to CPython (the reference implementation); other implementations handle this differently.",
      "Trying to 'fix' the GIL by adding more threads to CPU-bound code — more threads just adds switching overhead with no additional throughput; reach for multiprocessing instead.",
    ],
  },

  {
    id: 'memory-management-gc',
    title: 'Memory Management & Garbage Collection',
    group: 'Advanced',
    explanation:
      'Python manages memory automatically using reference counting: every object keeps a count of how many things point to it, and the moment that count hits zero, the memory is freed immediately. A separate cyclic garbage collector runs periodically to catch reference CYCLES (two objects pointing at each other) that reference counting alone could never clean up on its own.',
    diagram: {
      type: 'heap',
      steps: [
        { objects: [{ id: 'a', label: 'obj_a', refcount: 1 }], note: 'a = SomeObject() creates one object with a reference count of 1 (the name `a` points to it).' },
        { objects: [{ id: 'a', label: 'obj_a', refcount: 2 }], note: 'b = a does not copy anything — it adds another reference to the SAME object, so the refcount rises to 2.' },
        { objects: [{ id: 'a', label: 'obj_a', refcount: 1 }], note: 'del b (or b going out of scope) removes one reference — refcount drops back to 1. a still keeps it alive.' },
        { objects: [{ id: 'a', label: 'obj_a', refcount: 0 }], note: 'del a removes the last reference — refcount hits 0.' },
        { objects: [{ id: 'a', label: 'obj_a', refcount: 0, collected: true }], note: 'The moment refcount hits 0, CPython frees the memory IMMEDIATELY — no waiting for a GC pass.' },
        {
          objects: [{ id: 'x', label: 'node_x', refcount: 1 }, { id: 'y', label: 'node_y', refcount: 1 }],
          note: 'Now a trickier case: x = Node(); y = Node(); x.other = y; y.other = x — two objects referencing EACH OTHER.',
        },
        {
          objects: [{ id: 'x', label: 'node_x', refcount: 1 }, { id: 'y', label: 'node_y', refcount: 1 }],
          note: 'del x; del y removes the external names, but x and y still reference each other — reference counting ALONE would leak this memory forever.',
        },
        {
          objects: [{ id: 'x', label: 'node_x', refcount: 1, collected: true }, { id: 'y', label: 'node_y', refcount: 1, collected: true }],
          note: 'This is what the cyclic garbage collector (the gc module) is for: it periodically finds groups of objects only reachable from each other and reclaims them.',
        },
      ],
    },
    code: `import sys, gc

a = [1, 2, 3]
print(sys.getrefcount(a))   # 2 (the name a, plus the temporary arg to getrefcount)

b = a                        # another reference to the SAME list
print(sys.getrefcount(a))   # 3

del b                         # one fewer reference
print(sys.getrefcount(a))   # back to 2

# Reference cycles need the cyclic garbage collector:
class Node:
    def __init__(self):
        self.other = None

x, y = Node(), Node()
x.other = y
y.other = x            # a cycle: x -> y -> x

del x, y                # refcounts don't hit 0 (they still reference each other!)
gc.collect()             # the cyclic GC finds and frees the cycle anyway`,
    playgroundCode: `import sys, gc

a = [1, 2, 3]
print(sys.getrefcount(a))
b = a
print(sys.getrefcount(a))
del b
print(sys.getrefcount(a))

class Node:
    def __init__(self):
        self.other = None

x, y = Node(), Node()
x.other = y
y.other = x
del x, y
collected = gc.collect()
print("cyclic objects collected:", collected)`,
    challenge: {
      prompt: 'Use sys.getrefcount() to show that appending a list to itself\'s container twice increases its refcount.',
      hint: 'Each appearance in a container is one more reference to the same list object.',
      solution: `import sys
lst = [1, 2]
print(sys.getrefcount(lst))
container = [lst, lst]
print(sys.getrefcount(lst))  # increased by 2`,
    },
    mistakes: [
      "Assuming Python has NO garbage collector because 'reference counting handles it' — reference counting alone can't free reference cycles; the gc module handles those.",
      'Manually calling gc.collect() everywhere out of caution — it runs automatically, and calling it constantly just adds overhead.',
      'Forgetting circular references involving a custom __del__ method used to be genuinely uncollectable before Python 3.4 — a good reason to avoid __del__ unless truly necessary.',
    ],
  },

  {
    id: 'decorators-with-arguments',
    title: 'Decorators with Arguments',
    group: 'Advanced',
    explanation:
      'A decorator that takes its OWN arguments (like @repeat(3)) needs one extra layer of nesting: an outer function that accepts the decorator\'s arguments and returns the actual decorator, which itself returns the wrapper. Same box-in-box idea as a plain decorator, just with one more box on the outside to hold the configuration.',
    diagram: {
      type: 'wrap',
      steps: [
        { layers: [{ label: 'repeat(3) — the factory call', active: false }], note: '@repeat(3) first CALLS repeat(3). This runs immediately at decoration time and must return the real decorator.' },
        { layers: [{ label: 'repeat(3) returns decorator', active: true }], note: 'repeat(3) returns `decorator`, a function that remembers times=3 in its own closure — this is a closure too!' },
        {
          layers: [{ label: 'decorator(greet) called', active: true }, { label: 'wrapper() — remembers times=3', active: true }],
          note: '@decorator is applied to greet: decorator(greet) runs, returning wrapper — greet is now replaced by wrapper.',
        },
        {
          layers: [{ label: 'wrapper() — remembers times=3', active: true }, { label: 'greet() — original function', active: true }],
          resultLabel: 'called 3 times total',
          note: 'Calling greet() now actually calls wrapper(), which loops `times` times, calling the ORIGINAL greet() inside — three box layers all working together.',
        },
      ],
    },
    code: `def repeat(times):                    # the OUTER factory: takes the decorator's own args
    def decorator(func):               # the actual decorator
        def wrapper(*args, **kwargs):   # the wrapper, same as always
            result = None
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)                # same as: greet = repeat(3)(greet)
def greet():
    print("hi")

greet()
# hi
# hi
# hi`,
    playgroundCode: `def repeat(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            result = None
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def greet():
    print("hi")

greet()`,
    challenge: {
      prompt: "Write a decorator factory min_delay(seconds) whose wrapped function prints 'Too soon!' if called again before `seconds` have passed since the last call.",
      hint: 'Store last_called as a mutable single-item list (or use nonlocal) inside the closure.',
      solution: `import time

def min_delay(seconds):
    def decorator(func):
        last_called = [0]
        def wrapper(*args, **kwargs):
            now = time.time()
            if now - last_called[0] < seconds:
                print("Too soon!")
                return None
            last_called[0] = now
            return func(*args, **kwargs)
        return wrapper
    return decorator

@min_delay(1)
def ping():
    print("pong")

ping()
ping()`,
    },
    mistakes: [
      'Forgetting the extra layer of nesting — @repeat(3) needs THREE nested functions (factory -> decorator -> wrapper), not two; skipping one breaks the call chain.',
      "Forgetting the parentheses at the decoration site: @repeat (missing the call) passes the function itself as `times`, which is almost never what you want.",
      "Not using @functools.wraps(func) on the innermost wrapper — parametrized decorators are just as prone to losing the original function's __name__ and docstring.",
    ],
  },

  {
    id: 'functools',
    title: 'functools (lru_cache, partial, wraps)',
    group: 'Advanced',
    explanation:
      'functools is the standard-library toolbox for working WITH functions themselves: lru_cache memoizes a function\'s results so repeated calls with the same arguments are instant, partial pre-fills some of a function\'s arguments to create a simpler specialized version, and wraps fixes the "lost identity" problem plain decorators cause.',
    diagram: {
      type: 'wrap',
      steps: [
        { layers: [{ label: 'fib(10) — first call', active: false }], note: '@lru_cache decorates fib. The cache starts empty.' },
        { layers: [{ label: 'lru_cache wrapper checks cache: MISS', active: true }], note: 'fib(10) is called. The cache wrapper checks: have we computed fib(10) before? No — a cache miss.' },
        {
          layers: [{ label: 'lru_cache wrapper', active: true }, { label: 'fib(10) — original function runs', active: true }],
          resultLabel: 'result stored in cache',
          note: 'The real fib(10) runs, and the FINAL result is stored in the cache keyed by 10 before being returned.',
        },
        {
          layers: [{ label: 'lru_cache wrapper checks cache: HIT!', active: true }],
          resultLabel: 'returned instantly, no recomputation',
          note: 'Call fib(10) again later: this time it is a cache HIT — the stored result returns instantly, without running the original function body at all.',
        },
      ],
    },
    code: `from functools import lru_cache, partial, wraps

@lru_cache(maxsize=None)
def fib(n):
    if n < 2: return n
    return fib(n - 1) + fib(n - 2)

print(fib(30))          # fast, thanks to caching every sub-result
print(fib.cache_info())  # CacheInfo(hits=..., misses=..., ...)

# partial: pre-fill some arguments to make a specialized version
def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
print(square(5))          # 25 — exponent is already "baked in"

# wraps: preserve a decorated function's identity
def log_calls(func):
    @wraps(func)              # without this, greet.__name__ becomes 'wrapper'
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@log_calls
def greet(name): return f"hi {name}"
print(greet.__name__)   # 'greet', not 'wrapper' — thanks to @wraps`,
    playgroundCode: `from functools import lru_cache, partial, wraps

@lru_cache(maxsize=None)
def fib(n):
    if n < 2: return n
    return fib(n - 1) + fib(n - 2)

print(fib(30))
print(fib.cache_info())

def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
print(square(5))

def log_calls(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@log_calls
def greet(name): return f"hi {name}"
print(greet.__name__)`,
    challenge: {
      prompt: 'Use functools.partial to create a function double() from a general multiply(a, b) function, with a fixed at 2.',
      hint: 'partial(multiply, 2) pre-fills the FIRST positional argument.',
      solution: `from functools import partial

def multiply(a, b):
    return a * b

double = partial(multiply, 2)
print(double(5))  # 10`,
    },
    mistakes: [
      'Using @lru_cache on a function with mutable or unhashable arguments (like a list) raises a TypeError — cache keys must be hashable.',
      "Forgetting cached results never expire or account for outside state changes — lru_cache assumes the function is 'pure'; caching one with side effects can give stale results.",
      "Skipping @wraps on custom decorators 'because it still works' — it does, until something relies on __name__ or __doc__ (frameworks, debuggers), and then it breaks mysteriously.",
    ],
  },

  {
    id: 'itertools',
    title: 'itertools',
    group: 'Advanced',
    explanation:
      "itertools is the standard library's toolbox of fast, memory-efficient iterator building blocks — infinite counters, chained sequences, groupings, combinations — all LAZY, meaning nothing is computed until you actually pull a value out, exactly like a generator. It's the tool of choice whenever you're tempted to build a big intermediate list just to loop over it once.",
    diagram: {
      type: 'pull',
      steps: [
        { produced: [], requesting: false, note: 'counter = itertools.count(10, 5) creates an INFINITE lazy sequence: 10, 15, 20, 25, ... Nothing is computed yet — building this costs no memory at all.' },
        { produced: [], requesting: true, note: 'next(counter) is called.' },
        { produced: [10], requesting: false, note: '10 is produced — the very first value.' },
        { produced: [10], requesting: true, note: 'next(counter) again.' },
        { produced: [10, 15], requesting: false, note: '15 is produced (10 + step of 5). Only ONE value exists in memory at a time, no matter how far you keep pulling.' },
        { produced: [10, 15, 20], requesting: false, note: 'itertools.islice(counter, 3) is exactly how you safely grab a finite slice from an infinite iterator without it running forever.' },
      ],
    },
    code: `import itertools

counter = itertools.count(10, 5)      # lazy, infinite: 10, 15, 20, 25, ...
first_three = list(itertools.islice(counter, 3))
print(first_three)                     # [10, 15, 20] — safely finite

# chain: walk multiple iterables as if they were one, lazily
combined = itertools.chain([1, 2], ["a", "b"])
print(list(combined))                    # [1, 2, 'a', 'b']

# groupby: group CONSECUTIVE equal items (sort first if you need global groups)
data = [1, 1, 2, 2, 2, 3]
for key, group in itertools.groupby(data):
    print(key, list(group))
# 1 [1, 1]
# 2 [2, 2, 2]
# 3 [3]

# combinations / permutations
print(list(itertools.combinations([1, 2, 3], 2)))   # [(1,2), (1,3), (2,3)]`,
    playgroundCode: `import itertools

counter = itertools.count(10, 5)
print(list(itertools.islice(counter, 3)))

combined = itertools.chain([1, 2], ["a", "b"])
print(list(combined))

data = [1, 1, 2, 2, 2, 3]
for key, group in itertools.groupby(data):
    print(key, list(group))

print(list(itertools.combinations([1, 2, 3], 2)))`,
    challenge: {
      prompt: 'Use itertools.islice with itertools.count() to print the first 5 even numbers starting at 0, without building an "all even numbers" list.',
      hint: 'itertools.count(0, 2) counts by 2s forever; islice takes a finite slice of it.',
      solution: `import itertools

evens = itertools.islice(itertools.count(0, 2), 5)
print(list(evens))  # [0, 2, 4, 6, 8]`,
    },
    mistakes: [
      'Calling list() directly on an INFINITE iterator like itertools.count() with no islice/limit first — this hangs forever (or exhausts memory trying).',
      'Forgetting itertools iterators are single-use, exactly like generators — once consumed, you cannot loop over the same chain/count object again.',
      'Using itertools.groupby() on unsorted data expecting global grouping — it only groups CONSECUTIVE matching items; sort by the same key first if you want everything grouped together.',
    ],
  },

  {
    id: 'collections',
    title: 'collections (Counter, defaultdict, namedtuple, deque)',
    group: 'Advanced',
    explanation:
      'The collections module offers specialized container types that fix common annoyances with plain lists/dicts: Counter tallies items for you, defaultdict never raises a KeyError on a missing key (it just creates one), namedtuple gives tuple entries readable field names, and deque is a list optimized for fast appends/pops from BOTH ends.',
    diagram: {
      type: 'sequence',
      steps: [
        { mode: 'dict', items: [], note: 'words = ["a","b","a","c","b","a"]; Counter(words) is about to tally them.' },
        {
          mode: 'dict',
          items: [{ id: 'a', key: '"a"', value: '3' }, { id: 'b', key: '"b"', value: '2' }, { id: 'c', key: '"c"', value: '1' }],
          note: 'Counter(words) produces {"a": 3, "b": 2, "c": 1} — like a dict, but built specifically for counting, with a .most_common() method.',
        },
        {
          mode: 'list',
          items: [{ id: 'x', value: '1', index: 0 }, { id: 'y', value: '2', index: 1 }, { id: 'z', value: '3', index: 2 }],
          note: 'dq = deque([1,2,3]); dq.appendleft(0) is about to add to the FRONT — something a plain list only does slowly (O(n)), but deque does in O(1).',
        },
        {
          mode: 'list',
          items: [{ id: 'w', value: '0', index: 0, tone: 'add' }, { id: 'x', value: '1', index: 1 }, { id: 'y', value: '2', index: 2 }, { id: 'z', value: '3', index: 3 }],
          note: 'deque is now [0, 1, 2, 3] — appendleft and append (and their pop equivalents) are all fast at both ends.',
        },
      ],
    },
    code: `from collections import Counter, defaultdict, namedtuple, deque

words = ["a", "b", "a", "c", "b", "a"]
counts = Counter(words)
print(counts)                    # Counter({'a': 3, 'b': 2, 'c': 1})
print(counts.most_common(1))      # [('a', 3)]

# defaultdict: missing keys auto-create instead of raising KeyError
groups = defaultdict(list)
groups["fruit"].append("apple")     # no KeyError, even though "fruit" is new
groups["fruit"].append("banana")
print(dict(groups))                  # {'fruit': ['apple', 'banana']}

# namedtuple: tuples with readable field names
Point = namedtuple("Point", ["x", "y"])
p = Point(3, 4)
print(p.x, p.y, p[0])            # 3 4 3 — works both ways

# deque: fast appends/pops from EITHER end
dq = deque([1, 2, 3])
dq.appendleft(0)
dq.append(4)
print(dq)                          # deque([0, 1, 2, 3, 4])`,
    playgroundCode: `from collections import Counter, defaultdict, namedtuple, deque

words = ["a", "b", "a", "c", "b", "a"]
counts = Counter(words)
print(counts)
print(counts.most_common(1))

groups = defaultdict(list)
groups["fruit"].append("apple")
groups["fruit"].append("banana")
print(dict(groups))

Point = namedtuple("Point", ["x", "y"])
p = Point(3, 4)
print(p.x, p.y, p[0])

dq = deque([1, 2, 3])
dq.appendleft(0)
dq.append(4)
print(dq)`,
    challenge: {
      prompt: 'Given text = "the cat sat on the mat the cat ran", use Counter to find the single most common word.',
      hint: 'Counter(text.split()).most_common(1)',
      solution: `from collections import Counter

text = "the cat sat on the mat the cat ran"
counts = Counter(text.split())
print(counts.most_common(1))  # [('the', 3)]`,
    },
    mistakes: [
      'Manually checking "if key not in d: d[key] = []" everywhere instead of defaultdict(list) — defaultdict removes that entire boilerplate pattern.',
      'Forgetting namedtuple instances are still immutable tuples — p.x = 5 raises an AttributeError, just like regular tuple item assignment would.',
      'Using a plain list with .pop(0) or .insert(0, x) in a hot loop — both are O(n) on a list; switch to deque for O(1) operations at the front.',
    ],
  },

  {
    id: 'regex-basics',
    title: 'Regex Basics',
    group: 'Advanced',
    explanation:
      "A regular expression (regex) is a tiny pattern language for describing shapes of text — digits, word boundaries, repeats — so you can search, match, or replace text without writing a manual character-by-character parser. Python's re module compiles these patterns and hands you back match objects telling you exactly WHERE and WHAT matched.",
    diagram: {
      type: 'regex',
      steps: [
        { text: 'Room 42B has 3 chairs', spans: [], cursor: 0, note: 'pattern = r"\\d+"  (one or more digits). re.findall(pattern, text) starts scanning from the very beginning.' },
        { text: 'Room 42B has 3 chairs', spans: [], cursor: 5, note: "Scanning through 'Room ' — no digits yet, the cursor keeps advancing." },
        { text: 'Room 42B has 3 chairs', spans: [{ start: 5, end: 7 }], cursor: 7, note: '"42" is found at position 5-7 — two consecutive digits match \\d+ as ONE match (it grabs as many digits as it can, "greedily").' },
        { text: 'Room 42B has 3 chairs', spans: [{ start: 5, end: 7 }], cursor: 13, note: "Scanning continues through 'B has ' — no more digits yet." },
        { text: 'Room 42B has 3 chairs', spans: [{ start: 5, end: 7 }, { start: 13, end: 14 }], cursor: 14, note: '"3" is found at position 13-14 — a second, separate match.' },
        { text: 'Room 42B has 3 chairs', spans: [{ start: 5, end: 7 }, { start: 13, end: 14 }], cursor: 21, note: 'Scanning finishes through "chairs" — no more digits. re.findall returns ["42", "3"].' },
      ],
    },
    code: `import re

text = "Room 42B has 3 chairs"

matches = re.findall(r"\\d+", text)     # one-or-more digits, each run
print(matches)                            # ['42', '3']

m = re.search(r"\\d+", text)              # first match only, as a Match object
print(m.group(), m.start(), m.end())       # 42 5 7

# common building blocks:
re.match(r"^Room", text)        # anchors: ^ start, $ end
re.sub(r"\\d+", "#", text)       # replace every match: 'Room #B has # chairs'
re.findall(r"[A-Za-z]+", text)  # one-or-more letters
re.split(r"\\s+", text)          # split on whitespace runs`,
    playgroundCode: `import re

text = "Room 42B has 3 chairs"
print(re.findall(r"\\d+", text))

m = re.search(r"\\d+", text)
print(m.group(), m.start(), m.end())

print(re.sub(r"\\d+", "#", text))
print(re.findall(r"[A-Za-z]+", text))
print(re.split(r"\\s+", text))`,
    challenge: {
      prompt: 'Use re.findall to extract simplified email-like tokens from: "contact ava@example.com or bo@test.org".',
      hint: "A simplified pattern: r'\\w+@\\w+\\.\\w+'",
      solution: `import re

text = "contact ava@example.com or bo@test.org"
emails = re.findall(r"\\w+@\\w+\\.\\w+", text)
print(emails)  # ['ava@example.com', 'bo@test.org']`,
    },
    mistakes: [
      'Forgetting to use a RAW string (r"...") for patterns — without the r prefix, backslash escapes like \\d get mangled by Python\'s own string parsing before re even sees them.',
      'Using .match() and expecting it to search anywhere in the string — .match() only checks from the very START of the string; use .search() to find a match anywhere.',
      'Writing a greedy quantifier (.*) when you meant a non-greedy one (.*?) — greedy grabs as much text as possible, which can match far more than intended.',
    ],
  },

  {
    id: 'type-hints-typing',
    title: 'Type Hints & the typing Module',
    group: 'Advanced',
    explanation:
      "Type hints let you annotate what type a variable, parameter, or return value is EXPECTED to be — def greet(name: str) -> str: — purely as documentation and for external tools; Python itself does not enforce them at runtime at all. Static type checkers (like mypy) and IDEs read these hints to catch mismatches before you ever run the code, and the typing module supplies more advanced shapes like list[int], Optional[str], and Union[int, str].",
    diagram: {
      type: 'box',
      steps: [
        {
          bubbles: [{ id: 'b1', value: '"Ava"' }],
          labels: [{ name: 'name: str', bubbleId: 'b1', typeTag: 'annotated: str' }],
          note: 'name: str = "Ava" — the ": str" is a type HINT, purely informational to humans and tools.',
        },
        {
          bubbles: [{ id: 'b1', value: '"Ava"' }, { id: 'b2', value: '42' }],
          labels: [
            { name: 'name: str', bubbleId: 'b1', typeTag: 'annotated: str' },
            { name: 'age: int', bubbleId: 'b2', typeTag: 'annotated: int' },
          ],
          note: 'age: int = 42 — same idea, this time for an int.',
        },
        {
          bubbles: [{ id: 'b1', value: '"Ava"' }, { id: 'b2', value: '42' }, { id: 'b3', value: '"oops"' }],
          labels: [
            { name: 'name: str', bubbleId: 'b1', typeTag: 'annotated: str' },
            { name: 'age (reassigned!)', bubbleId: 'b3', typeTag: 'hint still says int...' },
          ],
          note: 'age = "oops" — Python happily allows this at runtime! Type hints are NOT enforced by the interpreter; only external tools like mypy would flag it.',
        },
        {
          bubbles: [{ id: 'b1', value: '"Ava"' }, { id: 'b2', value: '42' }, { id: 'b3', value: '"oops"' }],
          labels: [
            { name: 'name: str', bubbleId: 'b1', typeTag: 'annotated: str' },
            { name: 'age (reassigned!)', bubbleId: 'b3', typeTag: 'hint still says int...' },
          ],
          note: 'def add(a: int, b: int) -> int: documents a CONTRACT a type checker can verify across your codebase — but Python itself would still happily run add("a","b") and just concatenate.',
        },
      ],
    },
    code: `name: str = "Ava"
age: int = 42

age = "oops"        # Python allows this at runtime! Hints aren't enforced.

def add(a: int, b: int) -> int:
    return a + b

print(add(2, 3))       # 5 — runs fine
print(add("a", "b"))   # 'ab' — ALSO runs fine; a type checker would flag it, Python won't

from typing import Optional, Union

def find_user(user_id: int) -> Optional[str]:   # returns a str OR None
    return None

def parse(value: Union[int, str]) -> str:         # accepts an int OR a str
    return str(value)

# modern syntax (3.9+) for generic containers:
scores: list[int] = [90, 85, 77]
lookup: dict[str, int] = {"Ava": 90}`,
    playgroundCode: `def add(a: int, b: int) -> int:
    return a + b

print(add(2, 3))
print(add("a", "b"))

from typing import Optional, Union

def find_user(user_id: int) -> Optional[str]:
    return None

def parse(value: Union[int, str]) -> str:
    return str(value)

print(find_user(1))
print(parse(42))
print(parse("hi"))`,
    challenge: {
      prompt: 'Add type hints to this function: def area(width, height): return width * height — parameters and return type should be float.',
      hint: 'def area(width: float, height: float) -> float:',
      solution: `def area(width: float, height: float) -> float:
    return width * height

print(area(2.5, 4.0))  # 10.0`,
    },
    mistakes: [
      'Believing type hints make Python statically typed or enforce anything at runtime — they are purely advisory; use mypy (or a runtime library like pydantic) to actually check them.',
      'Forgetting older Python versions need explicit typing imports (Optional, Union, List, Dict) before generic builtins (list[int]) were allowed directly in 3.9+.',
      'Over-annotating obvious local variables inside a function body — hints are most valuable on function signatures and public APIs, not every single local variable.',
    ],
  },
];
