# Random number generator
This library is an implementation in JavaScript of pseudo-randoms numbers generators, heavily based on Python's [Random](https://github.com/python/cpython/blob/2.7/Lib/random.py) library.

* [Live demo](https://lowlighter.github.io/random/demo/)
* [Documentation](https://lowlighter.github.io/random/docs/)
* [About](https://lowlight.fr/en/blog/random-library/)


# Features
* **11** differents probability distributions
    * Normal (+ Gauss faster implementation), Log-normal, Exponential, Uniform, Beta, Gamma, Pareto, Von Mises, Weibull, Triangular and Restricted set.
* **Seeds** support (both numeric and textual)
* **Utilitaries** to use with *Arrays*
    * Choice, Shuffle and Sample


## Getting Started
First of all, you'll need to include the library :
```html
    <script src="./bin/lowlight.random.js"></script>
```

You may include the minified library instead :
```html
    <script src="./bin/lowlight.random.min.js"></script>
```

Then you may create alias for convenience :
```javascript
    let Distribution = Lowlight.Random.Distribution
```

## Create a new generator

To create a new generator, just choose one of the 11 availables distributions.
For example, to instantiate a new Normal distribution, type the following code.
```javascript
    let generator = new Distribution.Normal(0, 1)
```

### Seeding generator

By default generator will be seeded with current timestamp.
However you can seed it manually by using `Generator.seed(seed)` method.

Here are some possible ways to seed a generator :
```javascript
    generator.seed(null) //Initialize seed with current timestamp (default behaviour)
    generator.seed(0xCAFE) //Initialize seed with a number
    generator.seed("Café") //Initialize seed with a string (will be hashed into a number)
```

Note that `Generator.seed(seed)` also return current instance so you can instantiate your generators this way :

```javascript
    generator = Distribution.Normal(0, 1).seed(0xCAFE)
```

You can read a generator's seed by calling `Generator.seed()` without arguments.

Note that once you've started generating numbers with `Generator.next()`, you won't be able to seed it again.
You can call `Generator.reset()`, which will create a new internal generator function but you'll lose iterations count.
```javascript
    generator.seed("Tea") //No effect
    generator.reset().seed("Tea") //Will keep previous parameters and reseed generator
```

### Edit generator's parameters

To setup or update a generator's parameter, just call their respective methods to do so.
Note that they all return the instance so can just chain them if you need to edit multiples parameters.

For example, with our previous normal distribution generator, we can type the following :
```javascript
    generator.mean(1).deviation(10)
```

You can also read their values by calling them with no arguments.
```javascript
    generator.mean() //Output 1
```

In the end, you can instantiate a generator with a single line :
```javascript
    generator = Distribution.Normal().mean(0).deviation(1).seed(0xCAFE)
```

### Generate numbers
Just call `Generator.next()` method to get a new pseudo-random number.
```javascript
    generator.next() //Output a random number
```

## Miscelleanous

This library also provide some miscelleanous functions to manage sets of values.

You may want create an alias for convenience :
```javascript
    let Utilities = Lowlight.Random.Utilities
```

### Shuffle array or strings
`Utilities.shuffle(array, seed)` method shuffles an array *(it doesn't modify the original one)* or a string.

```javascript
    Utilities.shuffle([67, 65, 70, 69], 0) //Output [70, 69, 65, 67]
    Utilities.shuffle("cafe", 0) //Output "feac"
```

### Sample array
`Utilities.sample(array, length, replace, seed)` method sample values from an array or a string. You may specify which length you want for your sampled array and also if values should be replaced in set of possible drawable values.
```javascript
    Utilities.sample([67, 65, 70, 69], 3, false, 0) //Output [67, 69, 65]
    Utilities.sample([67, 65, 70, 69], 6, true, 0) //Output [67, 69, 67, 69, 67, 67]
```

### Sample array

`Utilities.choice(array, seed)` method is equivalent to `Utilities.sample(array, 1)`.
```javascript
    Utilities.choice([67, 65, 70, 69], 0) //Output 67
```


## Project content
|            |                             |
| ---------- | --------------------------- |
| **/bin**   | Live and dev scrripts files |
| **/src**   | Source files                |
| **/demo**  | Demo and codes examples     |
| **/docs**  | Documentation               |

## Rebuild project and expanding the library
You'll need to run the following command the first time to install dependencies.
```shell
npm install
```

Then to rebuild project, just run the following command :
```shell
npm run build
```

This will update `/bin` files with included `/src` files.
Although `package.json` (which contains `"source" and "output"` paths) are preconfigured, you may need to reconfigure them if you're planning to expand this library.

To include a file just use the following syntax in the `"source"` file :
```javascript
    /* #include <path/to/file.js> */
```

* File minification is performed with [Babel minify](https://github.com/babel/minify).
* Documentation is generated with [JSDoc 3](https://github.com/jsdoc3/jsdoc).

Although `package.json` (which contains `"jsdoc_source", "jsdoc_output", "jsdoc_config" and "jsdoc_readme"`) and `docs/categories.json` are preconfigured, you may need to reconfigure them if you're planning to expand this library.

## License
This project is licensed under the MIT License.

See [LICENSE.md](https://github.com/lowlighter/quadtree/blob/master/LICENSE.md) file for details.
