# Random number generator
This library is an implementation in JavaScript of pseudo-randoms numbers generators, heavily based on Python's [Random](https://github.com/python/cpython/blob/2.7/Lib/random.py) library.

* [Live demo](https://lowlighter.github.io/random/demo/)
* [Documentation](https://lowlighter.github.io/random/docs/)

# Features
* **11** differents probability distributions
    * Normal (+ Gauss faster implementation), Log-normal, Exponential, Uniform, Beta, Gamma, Pareto, Von Mises, Weibull, Triangular and Restricted set.
* **Seeds** support (both numeric and textual)
* **Utilitaries** to use with *Arrays*
    * Choice, Shuffle and Sample

## Getting Started
First of all, you need to include the library :
```html
    <script src="./bin/lowlight.random.js"></script>
```

Then you may want create an alias for convenience :
```javascript
    let Distribution = Lowlight.Random.Distribution
```

## Create a new generator

Type the following code to instantiate a new generator :
```javascript
    let generator = Distribution.Normal(0, 1)
```

If later, you need to update distribution's parameters, just call their respective methods to do so.
Note that they all return the instance so can just chain them if you need to edit multiples parameters.
```javascript
    generator.mean(1).deviation(10)
```

You can also read their values by calling them with no arguments.
```javascript
    generator.mean() //Output 1
```

### Seeding generator
You can use the **Distribution.seed** method to set the seed of a generator.
```javascript
    generator.seed(null) //Initialize seed with current timestamp (default behaviour)
    generator.seed(0xCAFE) //Initialize seed with a number
    generator.seed("Café") //Initialize seed with a string (will be hashed into a number)
```

**Distribution.seed** method also return the instance, so you can instantiate your generators this way :
```javascript
    generator = Distribution.Normal(0, 1).seed(0xCAFE)
```

Or even this way :
```javascript
    generator = Distribution.Normal().mean(0).deviation(1).seed(0xCAFE)
```

### Generate numbers
Just call **Distribution.next** method to get a new pseudo-random number.
```javascript
    generator.next() //Output a random number
```

Note that once you started generating numbers with **Distribution.next** method, you won't be able to change seed anymore unless
you call **Distribution.reset**, which will create a new internal generator function, thus losing iterations count.
```javascript
    generator.seed("Tea") //No effect
    generator.reset().seed("Tea") //Will keep previous parameters and reseed generator
```

## Miscelleanous

This library also provide some usefuls function to manage sets of values.

You may want create an alias for convenience :
```javascript
    let Utilities = Lowlight.Random.Utilities
```

### Shuffle array or strings
**Utilities.shuffle(array, seed)**

This method shuffles an array (it doesn't modify the original one) or a string.

```javascript
    Utilities.shuffle([67, 65, 70, 69], 0) //Output [70, 69, 65, 67]
    Utilities.shuffle("cafe", 0) //Output "feac"
```

### Sample array
**Utilities.sample(array, length, replace, seed)**

This method sample values from an array or a string. You may specify which length you want for your sampled array and also if values
should be replaced in set of possible drawable values.
```javascript
    Utilities.sample([67, 65, 70, 69], 3, false, 0) //Output [67, 69, 65]
    Utilities.sample([67, 65, 70, 69], 6, true, 0) //Output [67, 69, 67, 69, 67, 67]
```

### Sample array
**Utilities.choice(array, seed)**

Equivalent to **Utilities.sample(array, 1)**
```javascript
    Utilities.choice([67, 65, 70, 69], 0) //Output 67
```

## Project content
|            |                            |
| ---------- | -------------------------- |
| **/bin**   | Production and test files  |
| **/src**   | Source files               |
| **/demo**  | Demo and codes examples    |
| **/docs**  | Library's documentations   |

### Rebuild project

If you need to rebuild project, just run the following command :
```
npm run build
# /bin will be updated with /src scripts files
# /docs will be updated
```

Don't forget to install dependencies before running the previous command.
```
npm install
```

## License
This project is licensed under the MIT License. See [LICENSE.md](https://github.com/lowlighter/random/blob/master/LICENSE.md) file for details.
