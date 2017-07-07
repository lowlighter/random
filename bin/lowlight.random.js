/**
 * Copyright 2017, Lecoq Simon (lowlight.fr)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function (global) {
    //Registering
        if (typeof global.Lowlight === "undefined") { global.Lowlight = {} }
        if ((typeof module === "object")&&(typeof module.exports === "object")) { module.exports = global.Lowlight }

        
//Includes
    class Distribution {
        /**
         * Support class for probability distributions implementation.
         * See [Probability Distribution]{@link https://en.wikipedia.org/wiki/Probability_distribution}.
         * @category misc
         * @abstract
         */
            constructor() {
                /**
                 * <pre>
                 * Internal random generator.
                 * It will be initialized the first time <span class="bold">Distribution.next</span> is called.
                 * </pre>
                 * @readonly
                 * @private
                 * @type {Generator}
                 */
                    this.generator = false

                //Initialization
                    this.seed(null)
            }

        /**
         * Generate a new number.
         * @return {Number} A generated number
         */
            next() {
                return this.generator ? this.generator.next().value : (this.generator = this.constructor.generator.call(this), this.next())
            }

        /**
         * <pre>
         * Seed generator.
         * If value is <span class="bold">null</span>, seed will be initialized with current timestamp.
         * If value is a <span class="bold">string</span>, it will be hashed into a number with [Distribution.seed]{@link Distribution#seed} method.
         * </pre>
         * <div class="alert info">
         * Note that once you call [Distribution.next]{@link Distribution#next} method, it isn't possible to change seed again unless you call [Distribution.reset]{@link Distribution#reset} method.
         * </div>
         * @example <caption>Seed a generator</caption>
         * // Seed a generator
         * let generator = new Lowlight.Random.Distribution.Normal(0, 1).seed(0xCAFE)
         * // You may seed again you generator while you haven't generated any number
         * generator.seed("cafe")
         *
         * // Generate a new number
         * generator.next() //Output -0.2679027397143018
         *
         * // You won't be able to change seed anymore
         * generator.seed("tea")
         * generator.seed() //Ouput 3045789 ("cafe"'s hashcode)
         * @example <caption>Force seed change</caption>
         * //If you really need to change seed, you'll need to call <span class="bold">Distribution.reset</span> method
         * generator.reset().seed("tea")
         * generator.seed() //Ouput 114704 ("tea"'s hashcode)
         *
         * //Which is actually equivalent to
         * generator = new Lowlight.Random.Distribution.Normal(0, 1).seed("tea")
         *
         * //However, note that parameters (e.g. : mean, standard deviation, etc.) kept their values
         * generator.mean() //Output 0
         . generator.deviation() //Output 1
         *
         * @param {?(Number|String)} [seed] - Seed value
         * @return {Distribution} Instance
         */
            seed(seed) {
                if (arguments.length) {
                    if (!this.generator) { this._seed = seed === null ? Date.now() : typeof seed === "number" ? seed : Distribution.hash((seed||"").toString()) }
                    else { console.warn("Seed cannot be changed anymore after you called Distribution.next()") }
                    return this
                } else { return this._seed }
            }

        /**
         * <pre>
         * Reset generator.
         * This allows you to change <span class="bold">seed</span> again, but it'll also reset generator's iterations counter as it will create a new one.
         * </pre>
         * @return {Distribution} Instance
         */
            reset() { return (this.generator = false, this) }

        /**
         * Hash a string into a number.
         * @param {String} string - String to hash
         * @return {Number} Hashed string
         */
            static hash(string) {
                let hash = 0
                for (let i = 0; i < string.length; i++) { hash = ((hash << 5) - hash) + string.charCodeAt(i), hash |= 0 }
                return hash
            }
    }

//Constants
    Distribution.NV_MAGICCONST = 4*Math.exp(-0.5)/Math.sqrt(2)
    Distribution.PI = Math.PI
    Distribution.PI2 = Math.PI*2
    Distribution.LOG4 = Math.log(4)
    Distribution.SG_MAGICCONST = 1.0 + Math.log(4.5)
    Distribution.E = Math.E


        
class Beta extends Distribution {
    /**
     * <pre>
     * Create a beta distribution random number generator.
     * Conditions on the parameters are α > 0 and β > 0.
     *
     * This version due to Janne Sinkkonen, and matches all the std texts (e.g., Knuth Vol 2 Ed 3 pg 134 "the beta distribution").
     *
     * See [Beta Distribution]{@link https://en.wikipedia.org/wiki/Beta_distribution}.
     * </pre>
     * <div style="text-align:center">
     *      <figure style="display:inline-block">
     *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/f/f3/Beta_distribution_pdf.svg">
     *      <figcaption style="text-align:center">Probability density function</figcaption>
     *      </figure>
     *      <figure style="display:inline-block">
     *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/1/11/Beta_distribution_cdf.svg">
     *      <figcaption style="text-align:center">Cumulative distribution function</figcaption>
     *      </figure>
     * </div>
     * @param {Number} [alpha=2] - Shape parameter (α)
     * @param {Number} [beta=2] - Shape parameter (β)
     * @category distribution
     * @extends Distribution
     */
        constructor(alpha = 0.5, beta = 0.5) {
            super()
            this.alpha(alpha).beta(beta)
        }

    /**
     * Update shape paramater value.
     * @param {Number} [mean] - Shape paramater (> 0)
     * @return {Number|Distribution} Return instance in setter mode and value in getter mode
     */
        alpha(alpha) { return arguments.length ? (this._alpha = alpha, this) : this._alpha }

    /**
    * <pre>
    * Update shape paramater value.
    * </pre>
    * @param {Number} [concentration] - Shape paramater (> 0)
    * @return {Number|Distribution} Return instance in setter mode and value in getter mode
     */
        beta(beta) { return arguments.length ? (this._beta = beta, this) : this._beta }

   /**
    * Create a beta distribution random number generator.
    * <div class="alert warning">
    * This method requires <span class="bold">this</span> context to be a {@link Distribution} instance, and this cannot be called directly.
    * </div>
    * @private
    * @return {Generator} Beta distribution number generator
    */
       static *generator() {
           let rand = new Distribution.Gamma(1, 1).seed(this.seed())
           while (1) {
               let y = rand.alpha(this.alpha()).next(), z = rand.alpha(this.beta()).next()
               yield y / (y + z)
           }
       }
}

//Registering
    Distribution.Beta = Beta

        
class Exponential extends Distribution {
    /**
     * <pre>
     * Create an exponential distribution random number generator.
     * Returned values range from [0;+∞[ if λ is positive and [-∞;0[ if λ is negative,
     * λ is 1/mean and shoul be non zero.
     *
     * See [Exponential Distribution]{@link https://en.wikipedia.org/wiki/Exponential_distribution}.
     * </pre>
     * <div style="text-align:center">
     *      <figure style="display:inline-block">
     *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/e/ec/Exponential_pdf.svg">
     *      <figcaption style="text-align:center">Probability density function</figcaption>
     *      </figure>
     *      <figure style="display:inline-block">
     *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Exponential_cdf.svg">
     *      <figcaption style="text-align:center">Cumulative distribution function</figcaption>
     *      </figure>
     * </div>
     * @param {Number} [rate=1] - Rate parameter (λ)
     * @category distribution
     * @extends Distribution
     */
        constructor(rate = 1) {
            super()
            this.rate(rate)
        }

    /**
     * Update rate parameter value.
     * @param {Number} [rate] - Rate parameter (λ)
     * @return {Number|Distribution} Return instance in setter mode and value in getter mode
     */
        rate(rate) { return arguments.length ? (this._rate = rate, this) : this._rate }

   /**
    * Create an exponential distribution random number generator.
    * <div class="alert warning">
    * This method requires <span class="bold">this</span> context to be a {@link Distribution} instance, and this cannot be called directly.
    * </div>
    * @private
    * @return {Generator} Exponential distribution number generator
    */
       static *generator() {
           let rand = new Distribution.Random(this.seed())
           while (1) { yield -Math.log(1 - rand.next())/this.rate() }
       }
}

//Registering
    Distribution.Exponential = Exponential

        
class Gamma extends Distribution {
    /**
     * <pre>
     * Create a gamma distribution random number generator.
     * Conditions on the parameters are α > 0 and β > 0.
     * The probability distribution function is: pdf(x) = (x<sup>α- 1</sup> * e<sup>-x/β</sup>)/(gamma(α) * β<sup>α</sup>)
     * Mean is α*beta, variance is α*β**2.
     *
     * Uses R.C.H. Cheng, "The generation of Gamma variables with non-integral shape parameters", Applied Statistics, (1977), 26, No. 1, p71-74.
     * Uses ALGORITHM GS of Statistical Computing - Kennedy & Gentle.
     *
     * See [Gamma Distribution]{@link https://en.wikipedia.org/wiki/Gamma_distribution}.
     * </pre>
     * <div class="alert warning">
     * A few older sources define the gamma distribution in terms of α > -1.
     * </div>
     * <div style="text-align:center">
     *      <figure style="display:inline-block">
     *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/e/e6/Gamma_distribution_pdf.svg">
     *      <figcaption style="text-align:center">Probability density function</figcaption>
     *      </figure>
     *      <figure style="display:inline-block">
     *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/8/8d/Gamma_distribution_cdf.svg">
     *      <figcaption style="text-align:center">Cumulative distribution function</figcaption>
     *      </figure>
     * </div>
     * @param {Number} [alpha=5] - Shape parameter
     * @param {Number} [beta=1] - Rate parameter
     * @category distribution
     * @extends Distribution
     */
        constructor(alpha = 5, beta = 1) {
            super()
            this.alpha(alpha).beta(beta)
        }

    /**
     * Update shape paramater value.
     * @param {Number} [mean] - Shape paramater (> 0)
     * @return {Number|Distribution} Return instance in setter mode and value in getter mode
     */
        alpha(alpha) { return arguments.length ? (this._alpha = alpha, this) : this._alpha }

    /**
    * <pre>
    * Update rate paramater value.
    * </pre>
    * @param {Number} [concentration] - Rate paramater (> 0)
    * @return {Number|Distribution} Return instance in setter mode and value in getter mode
     */
        beta(beta) { return arguments.length ? (this._beta = beta, this) : this._beta }

   /**
    * Create a gamma distribution random number generator.
    * <div class="alert warning">
    * This method requires <span class="bold">this</span> context to be a {@link Distribution} instance, and this cannot be called directly.
    * </div>
    * @private
    * @return {Generator} Gamma distribution number generator
    */
       static *generator() {
           let rand =  new Distribution.Random(this.seed())
           while (1) {
               let alpha = this.alpha(), beta = this.beta()
               if (alpha > 1) {
                   let ainv = Math.sqrt(2 * alpha - 1), bbb = alpha - Distribution.LOG4, ccc = alpha + ainv
                   while (1) {
                       let v = rand.next(), w = 1 - rand.next()
                       if (!((1e-7 < v)&&(v < .9999999))) { continue }
                       let u = Math.log(v/(1-v))/ainv, x = alpha * Math.exp(u), z = v*v*w, r = bbb + ccc*u - x
                       if ((r + Distribution.SG_MAGICCONST - 4.5*z >= 0)||(r >= Math.log(z))) { yield x * beta }
                   }
               } else if (alpha == 1) {
                   let v = rand.next()
                   while (v <= 1e-7) { v = rand.next() }
                   yield -Math.log(v) * beta
               } else {
                   let x
                   while (1) {
                       let v = rand.next(), w = rand.next()
                       let b = (Distribution.E + alpha) / Distribution.E, p = b * v
                       x = (p <= 1) ? Math.pow(p, 1/alpha) : - Math.log((b-p)/alpha)
                       if (p > 1) { if (w <= Math.pow(x, alpha-1)) { break } } else if (w <= Math.exp(-x)) { break }
                   }
                   yield x * beta
               }
           }
       }
}

//Registering
    Distribution.Gamma = Gamma

        
class Gauss extends Distribution {
    /**
     * <pre>
     * Create a Gauss distribution random number generator (should be faster than [Distribution.Normal]{@link Normal}).
     *
     * Uses Kinderman and Monahan method. Reference: Kinderman, A.J. and Monahan, J.F., "Computer generation of random variables using the ratio of uniform deviates", ACM Trans,
     * Math Software, 3, (1977), pp257-260.
     *
     * See [Normal Distribution]{@link https://en.wikipedia.org/wiki/Normal_distribution}.
     * </pre>
     * <div style="text-align:center">
     *      <figure style="display:inline-block">
     *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/7/74/Normal_Distribution_PDF.svg">
     *      <figcaption style="text-align:center">Probability density function</figcaption>
     *      </figure>
     *      <figure style="display:inline-block">
     *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/c/ca/Normal_Distribution_CDF.svg">
     *      <figcaption style="text-align:center">Cumulative distribution function</figcaption>
     *      </figure>
     * </div>
     * @param {Number} [mean=0] - Mean
     * @param {Number} [deviation=1] - Standard deviation
     * @category distribution
     * @extends Distribution
     */
        constructor(mean = 0, deviation = 1) {
            super()
            this.mean(mean).deviation(deviation)
        }

    /**
     * Update mean value.
     * @param {Number} [mean] - Mean
     * @return {Number|Distribution} Return instance in setter mode and value in getter mode
     */
        mean(mean) { return arguments.length ? (this._mean = mean, this) : this._mean }

    /**
    * Update standard deviation value.
    * @param {Number} [deviation] - Standard deviation
    * @return {Number|Distribution} Return instance in setter mode and value in getter mode
     */
        deviation(deviation) { return arguments.length ? (this._deviation = deviation, this) : this._deviation }

   /**
    * Create a Gauss distribution random number generator.
    * <div class="alert warning">
    * This method requires <span class="bold">this</span> context to be a {@link Distribution} instance, and this cannot be called directly.
    * </div>
    * @private
    * @return {Generator} Gauss distribution number generator
    */
       static *generator() {
           let rand = new Distribution.Random(this.seed()), next = null
           while (1) {
               let z = next ; next = null
               if (z === null) {
                   let x = rand.next()*Distribution.PI2;
                   let g = Math.sqrt(-2 * Math.log(1 - rand.next()))
                   z = Math.cos(x) * g
                   next = Math.sin(x) * g
               }
               yield this.mean() + z*this.deviation()
           }
       }
}

//Registering
    Distribution.Gauss = Gauss

        
class Normal extends Distribution {
    /**
     * <pre>
     * Create a normal distribution random number generator.
     *
     * Uses Kinderman and Monahan method. Reference: Kinderman, A.J. and Monahan, J.F., "Computer generation of random variables using the ratio of uniform deviates", ACM Trans,
     * Math Software, 3, (1977), pp257-260.
     *
     * See [Normal Distribution]{@link https://en.wikipedia.org/wiki/Normal_distribution}.
     * </pre>
     * <div style="text-align:center">
     *      <figure style="display:inline-block">
     *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/7/74/Normal_Distribution_PDF.svg">
     *      <figcaption style="text-align:center">Probability density function</figcaption>
     *      </figure>
     *      <figure style="display:inline-block">
     *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/c/ca/Normal_Distribution_CDF.svg">
     *      <figcaption style="text-align:center">Cumulative distribution function</figcaption>
     *      </figure>
     * </div>
     * @param {Number} [mean=0] - Mean
     * @param {Number} [deviation=1] - Standard deviation
     * @category distribution
     * @extends Distribution
     */
        constructor(mean = 0, deviation = 1) {
            super()
            this.mean(mean).deviation(deviation)
        }

    /**
     * Update mean value.
     * @param {Number} [mean] - Mean
     * @return {Number|Distribution} Return instance in setter mode and value in getter mode
     */
        mean(mean) { return arguments.length ? (this._mean = mean, this) : this._mean }

    /**
    * Update standard deviation value.
    * @param {Number} [deviation] - Standard deviation
    * @return {Number|Distribution} Return instance in setter mode and value in getter mode
     */
        deviation(deviation) { return arguments.length ? (this._deviation = deviation, this) : this._deviation }

   /**
    * Create a normal distribution random number generator.
    * <div class="alert warning">
    * This method requires <span class="bold">this</span> context to be a {@link Distribution} instance, and this cannot be called directly.
    * </div>
    * @private
    * @return {Generator} Normal distribution number generator
    */
       static *generator() {
           let rand = new Distribution.Random(this.seed()), a, b, z
           while (1) {
               while (1) {
                   a = rand.next(), b = 1 - rand.next()
                   z = Distribution.NV_MAGICCONST*(a-0.5)/b
                   if ((z*z)/4 <= - Math.log(b)) { break }
               }
               yield this.mean() + z*this.deviation()
           }
       }
}

//Registering
    Distribution.Normal = Normal

        
class Lognormal extends Normal {
    /**
     * <pre>
     * Create a log-normal distribution random number generator.
     * If you take the natural logarithm of this distribution, you'll get a normal distribution.
     * <span class="bold">mean</span> can have any value but <span class="bold">deviation</span> must be greater than zero.
     *
     * See [Log-normal Distribution]{@link https://en.wikipedia.org/wiki/Log-normal_distribution}.
     * </pre>
     * <div style="text-align:center">
     *      <figure style="display:inline-block">
     *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/a/ae/PDF-log_normal_distributions.svg">
     *      <figcaption style="text-align:center">Probability density function</figcaption>
     *      </figure>
     *      <figure style="display:inline-block">
     *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/4/42/CDF-log_normal_distributions.svg">
     *      <figcaption style="text-align:center">Cumulative distribution function</figcaption>
     *      </figure>
     * </div>
     * @param {Number} [mean=0] - Mean
     * @param {Number} [deviation=1] - Standard deviation (deviation > 0)
     * @category distribution
     * @extends Normal
     */
        constructor(mean = 0, deviation = 1) {
            super(mean, deviation)
        }

   /**
    * Create a log-normal distribution random number generator.
    * <div class="alert warning">
    * This method requires <span class="bold">this</span> context to be a {@link Distribution} instance, and this cannot be called directly.
    * </div>
    * @private
    * @return {Generator} Log-normal distribution number generator
    */
       static *generator() {
           let rand = super.generator.call(this)
           while (1) { yield Math.exp(rand.next().value) }
       }
}

//Registering
    Distribution.Lognormal = Lognormal

        
class Pareto extends Distribution {
    /**
     * <pre>
     * Create a Pareto distribution random number generator.
     *
     * Jain, pg. 495.
     *
     * See [Pareto Distribution]{@link https://en.wikipedia.org/wiki/Pareto_distribution}.
     * </pre>
     * <div style="text-align:center">
     *      <figure style="display:inline-block">
     *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/1/11/Probability_density_function_of_Pareto_distribution.svg">
     *      <figcaption style="text-align:center">Probability density function</figcaption>
     *      </figure>
     *      <figure style="display:inline-block">
     *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Cumulative_distribution_function_of_Pareto_distribution.svg">
     *      <figcaption style="text-align:center">Cumulative distribution function</figcaption>
     *      </figure>
     * </div>
     * @param {Number} [alpha=1] - Shape parameter
     * @category distribution
     * @extends Distribution
     */
        constructor(alpha = 1) {
            super()
            this.alpha(alpha)
        }

    /**
     * Update shape paramater value.
     * @param {Number} [mean] - Shape paramater (> 0)
     * @return {Number|Distribution} Return instance in setter mode and value in getter mode
     */
        alpha(alpha) { return arguments.length ? (this._alpha = alpha, this) : this._alpha }

   /**
    * Create a Pareto distribution random number generator.
    * <div class="alert warning">
    * This method requires <span class="bold">this</span> context to be a {@link Distribution} instance, and this cannot be called directly.
    * </div>
    * @private
    * @return {Generator} Pareto distribution number generator
    */
       static *generator() {
           let rand = new Distribution.Random(this.seed())
           while (1) { yield 1 / Math.pow(1 - rand.next(), 1/this.alpha()) }
       }
}

//Registering
    Distribution.Pareto = Pareto

        
class Random extends Distribution {
    /**
     * <pre>
     * Random number between [0;1[ generator.
     *
     * Wichman-Hill random number generator.
     *
     * See [Uniform Distribution]{@link https://en.wikipedia.org/wiki/Uniform_distribution_(continuous)}.
     * </pre>
     * <div class="alert warning">
     * This is the sole Distribution that can takes a <span class="bold">seed</span> argument in its constructor.
     * Other distributions need to be initialized with [Distribution.seed]{@link Distribution#seed} method.
     * </div>
     * @param {?(Number|String)} [seed] - Seed
     * @category distribution
     * @extends Distribution
     */
        constructor(seed) {
            super()
            this.seed(seed)
        }

   /**
    * Create a uniform distribution random number between [0;1[ generator.
    * <div class="alert warning">
    * This method requires <span class="bold">this</span> context to be a {@link Distribution} instance, and this cannot be called directly.
    * </div>
    * @private
    * @return {Generator} Uniform distribution number generator
    */
       static *generator() {
           let a = 30269, b = 30307, c = 30323, seed = this.seed()
           let x = seed%(a-1)+1, y = seed%(b-1)+1, z = seed%(c-1)+1
           while (1) {
               x = (x*171)%a, y = (y*172)%b, z = (z*170)%c
               yield (x/a + y/b + z/c) % 1
           }
       }
}

//Registering
    Distribution.Random = Random

        
class Set extends Distribution {
    /**
     * <pre>
     * Uniform distribution number generator on a restricted set of numbers.
     * </pre>
     * @example <caption>Basic usage</caption>
     * //Instantiate generator
     * let generator = new Distribution.Set(["red", "orange", "yellow", "green", "blue", "indigo", "violet"]).seed(0)
     *
     * //Pick random elements
     * generator.next() //Output "red"
     * generator.next() //Output "violet"
     * @example <caption>Multiple occurences values</caption>
     * //Update values
     * //In the following example, 1/6 to have a 'critical hit' or 'missed' and 2/3 to have a 'regular hit'
     * generator.values(["critical hit", "missed"].concat(Array(4).fill("hit")))
     * generator.next() //Output "critical hit"
     * generator.next() //Output "hit"
     * @param {Array} [values=[0, 1]] - Values array
     * @category distribution
     * @extends Distribution
     */
        constructor(values = [0, 1]) {
            super()
            this.values(values)
        }

    /**
     * Update set of values.
     * @param {Array} [values] - Values array
     * @return {Array|Distribution} Return instance in setter mode and value in getter mode
     */
        values(values) { return arguments.length ? (this._values = values, this) : this._values }

   /**
    * Create an uniform distribution random number generator on a restricted set of numbers.
    * <div class="alert warning">
    * This method requires <span class="bold">this</span> context to be a {@link Distribution} instance, and this cannot be called directly.
    * </div>
    * @private
    * @return {Generator} Uniform distribution number generator
    */
       static *generator() {
           let rand = new Distribution.Uniform().seed(this.seed())
           while (1) { yield this.values()[Math.floor(rand.max(this.values().length).next())] }
       }
}

//Registering
    Distribution.Set = Set

        
    class Triangular extends Distribution {
        /**
         * <pre>
         * Triangular distribution umber generator.
         * Continuous distribution bounded by given lower and upper limits, and having a given mode value in-between.
         * See [Triangular distribution]{@link https://en.wikipedia.org/wiki/Triangular_distribution}.
         * </pre>
         * <div style="text-align:center">
         *      <figure style="display:inline-block">
         *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/4/45/Triangular_distribution_PMF.png">
         *      <figcaption style="text-align:center">Probability density function</figcaption>
         *      </figure>
         *      <figure style="display:inline-block">
         *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Triangular_distribution_CMF.png">
         *      <figcaption style="text-align:center">Cumulative distribution function</figcaption>
         *      </figure>
         * </div>
         * @param {Number} [min=0] - Lower bound
         * @param {Number} [max=1] - Upper bound
         * @param {?Number} [mode=null] - Mode (default to midpoint between bounds, ie. symetric distribution)
         * @category distribution
         * @extends Distribution
         */
            constructor(min = 0, max = 1, mode = null) {
                super()
                this.min(min).max(max).mode(mode)
            }

        /**
         * Update lower bound value.
         * @param {Number} [min] - Lower bound
         * @return {Number|Distribution} Return instance in setter mode and value in getter mode
         */
            min(min) { return arguments.length ? (this._min = min, this) : this._min }

        /**
        * Update upper bound value.
        * @param {Number} [max] - Upper bound
        * @return {Number|Distribution} Return instance in setter mode and value in getter mode
         */
            max(max) { return arguments.length ? (this._max = max, this) : this._max }

        /**
        * Update mode value.
        * Must be between lower and upper bounds.
        * @param {Number} [mode] - Mode value
        * @return {?(Number|Distribution)} Return instance in setter mode and value in getter mode
         */
            mode(mode) { return arguments.length ? (this._mode = mode, this) : this._mode }

       /**
        * Create a uniform distribution random number generator.
        * <div class="alert warning">
        * This method requires <span class="bold">this</span> context to be a {@link Distribution} instance, and this cannot be called directly.
        * </div>
        * @private
        * @return {Generator} Uniform distribution number generator
        */
           static *generator() {
               let rand = new Distribution.Random(this.seed()), c, v, swap = false
               while (1) {
                   let min = swap ? this.max() : this.min() , max = swap ? this.min() : this.max()
                   let c = (this.mode() === null) ? 0.5 : (this.mode() - min)/(max - min)
                   if (!Number.isFinite(c)) { yield min } else {
                       let v = rand.next()
                       if (v > c) {
                           v = 1 - v ; c = 1 - c ; swap = !swap
                           yield min + (max - min) * Math.sqrt(v * c)
                       }
                   }
               }
           }
    }

    //Registering
        Distribution.Triangular = Triangular

        
class Uniform extends Distribution {
    /**
     * <pre>
     * Uniform distribution number generator.
     *
     * See [Uniform Distribution]{@link https://en.wikipedia.org/wiki/Uniform_distribution_(continuous)}.
     * Upper bound may or not be included depending on rounding.
     * If <span class="bold">min</span> is greater than <span class="bold">max</span>, min will always be returned.
     * </pre>
     * <div style="text-align:center">
     *      <figure style="display:inline-block">
     *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/9/96/Uniform_Distribution_PDF_SVG.svg">
     *      <figcaption style="text-align:center">Probability density function</figcaption>
     *      </figure>
     *      <figure style="display:inline-block">
     *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/6/63/Uniform_cdf.svg">
     *      <figcaption style="text-align:center">Cumulative distribution function</figcaption>
     *      </figure>
     * </div>
     * @param {Number} [min=0] - Lower bound (or Upper bound if only one argument is given)
     * @param {Number} [max=1] - Upper bound
     * @category distribution
     * @extends Distribution
     */
        constructor(min = 0, max = 1) {
            super()
            if (arguments.length === 1) { this.min(0).max(arguments[0]) } else { this.min(min).max(max) }
        }

    /**
     * Update lower bound value.
     * @param {Number} [min] - Lower bound
     * @return {Number|Distribution} Return instance in setter mode and value in getter mode
     */
        min(min) { return arguments.length ? (this._min = min, this) : this._min }

    /**
    * Update upper bound value.
    * @param {Number} [max] - Upper bound
    * @return {Number|Distribution} Return instance in setter mode and value in getter mode
     */
        max(max) { return arguments.length ? (this._max = max, this) : this._max }

   /**
    * Create an uniform distribution random number generator.
    * <div class="alert warning">
    * This method requires <span class="bold">this</span> context to be a {@link Distribution} instance, and this cannot be called directly.
    * </div>
    * @private
    * @return {Generator} Uniform distribution number generator
    */
       static *generator() {
           let rand = new Distribution.Random(this.seed())
           while (1) { yield this.min() + (this.min() < this.max() ? rand.next() * (this.max()-this.min()) : 0) }
       }
}

//Registering
    Distribution.Uniform = Uniform

        
class VonMises extends Distribution {
    /**
     * <pre>
     * Create a Von Mises distribution random number generator (circular data distribution).
     *
     * Based upon an algorithm published in: Fisher, N.I., "Statistical Analysis of Circular Data", Cambridge, University Press, 1993.
     * Thanks to Magnus Kessler for a correction to the implementation of step 4.
     *
     * See [Von Mises Distribution]{@link https://en.wikipedia.org/wiki/Von_Mises_distribution}.
     * </pre>
     * <div style="text-align:center">
     *      <figure style="display:inline-block">
     *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/b/b6/VonMises_distribution_PDF.png">
     *      <figcaption style="text-align:center">Probability density function</figcaption>
     *      </figure>
     *      <figure style="display:inline-block">
     *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/2/29/VonMises_distribution_CDF.png">
     *      <figcaption style="text-align:center">Cumulative distribution function</figcaption>
     *      </figure>
     * </div>
     * @param {Number} [mean=0] - Mean angle
     * @param {Number} [concentration=1] - Concentration parameter
     * @category distribution
     * @extends Distribution
     */
        constructor(mean = 0, concentration = 1) {
            super()
            this.mean(mean).concentration(concentration)
        }

    /**
     * Update mean angle value.
     * @param {Number} [mean] - Mean angle (0 ≤ mean angle ≤ 2ℼ)
     * @return {Number|Distribution} Return instance in setter mode and value in getter mode
     */
        mean(mean) { return arguments.length ? (this._mean = ((mean%Distribution.PI2)+Distribution.PI2)%Distribution.PI2, this) : this._mean }

    /**
    * <pre>
    * Update concentration paramater value.
    * If zero, this distribution reduces to an uniform random angle over the range 0 to 2ℼ.
    * </pre>
    * @param {Number} [concentration] - Concentration paramater (≥ 0)
    * @return {Number|Distribution} Return instance in setter mode and value in getter mode
     */
        concentration(concentration) { return arguments.length ? (this._concentration = concentration, this) : this._concentration }

   /**
    * Create a Von Mises distribution random number generator.
    * <div class="alert warning">
    * This method requires <span class="bold">this</span> context to be a {@link Distribution} instance, and this cannot be called directly.
    * </div>
    * @private
    * @return {Generator} Von Mises distribution number generator
    */
       static *generator() {
           let rand = new Distribution.Random(this.seed()), z
           while (1) {
               let k = this.concentration(), m = this.mean()
               if (k < 1.e-6) { yield Distribution.PI2 * rand.next() } else {
                   let s = 0.5/k, r = s + Math.sqrt(1 + s*s)
                   while (1) {
                       let v = rand.next(), w = rand.next()
                       z = Math.cos(Distribution.PI * v)
                       let d = z / (r + z)
                       if ((w < 1 - d*d)||(w <= (1 - d) * Math.exp(d))) { break }
                   }
                   let q = 1/r, f = (q + z)/(1 + q * z)
                   yield rand.next() > 0.5 ? (m + Math.acos(f) % Distribution.PI2) : (m - Math.acos(f) % Distribution.PI2)
               }
           }
       }
}

//Registering
    Distribution.VonMises = VonMises

        
class Weibull extends Distribution {
    /**
     * <pre>
     * Create a Weibull distribution random number generator.
     *
     * Jain, pg. 499; bug fix courtesy Bill Arms
     *
     * See [Weibull Distribution]{@link https://en.wikipedia.org/wiki/Weibull_distribution}.
     * </pre>
     * <div style="text-align:center">
     *      <figure style="display:inline-block">
     *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/5/58/Weibull_PDF.svg">
     *      <figcaption style="text-align:center">Probability density function</figcaption>
     *      </figure>
     *      <figure style="display:inline-block">
     *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Weibull_CDF.svg">
     *      <figcaption style="text-align:center">Cumulative distribution function</figcaption>
     *      </figure>
     * </div>
     * @param {Number} [scale=1] - Scale parameter
     * @param {Number} [shape=1] - Shape parameter
     * @category distribution
     * @extends Distribution
     */
        constructor(scale = 1, shape = 1) {
            super()
            this.scale(scale).shape(shape)
        }

    /**
     * Update scale paramater value.
     * @param {Number} [mean] - Scale paramater (> 0)
     * @return {Number|Distribution} Return instance in setter mode and value in getter mode
     */
        scale(scale) { return arguments.length ? (this._scale = scale, this) : this._scale }

    /**
    * <pre>
    * Update shape paramater value.
    * </pre>
    * @param {Number} [concentration] - Shape paramater (> 0)
    * @return {Number|Distribution} Return instance in setter mode and value in getter mode
     */
        shape(shape) { return arguments.length ? (this._shape = shape, this) : this._shape }

    /**
    * Create a Weibull distribution random number generator.
    * <div class="alert warning">
    * This method requires <span class="bold">this</span> context to be a {@link Distribution} instance, and this cannot be called directly.
    * </div>
    * @private
    * @return {Generator} Weibull distribution number generator
    */
       static *generator() {
           let rand =  new Distribution.Random(this.seed())
           while (1) { yield this.scale() * Math.pow(-Math.log(1 - rand.next()), 1/this.shape()) }
       }
}

//Registering
    Distribution.Weibull = Weibull


        
class Utilities {
    /**
     * Set of utilitary functions.
     * @category misc
     */
        constructor() {}

    /**
     * Initialize generators.
     * @param {?(Number|String)} [seed=null] - Seed
     * @ignore
     */
        static init(seed = null) {
            Utilities.shuffle.generator = new Distribution.Uniform(seed)
            Utilities.sample.generator = new Distribution.Uniform(seed)
            Utilities.choice.generator = new Distribution.Uniform(seed)
        }

    /**
     * <pre>
     * Shuffle an array.
     * <span class="bold">array</span> will always be shuffled the same way for a particular <span class="bold">seed</span>.
     * </pre>
     * <div class="alert info">
     * This method does not modify original array.
     * </div>
     * @param {Array|String} array - Array to shuffle
     * @param {?(Number|String|false)} [seed=false] - Seed (set to <span class="bold">false</span> to reuse previous seeded generator)
     * @return {Array|String} Shuffled array
     */
        static shuffle(array, seed = false) {
            let rand = (seed === false) ? Utilities.shuffle.generator : Utilities.shuffle.generator.reset().seed(seed)
            let copy = Array.isArray(array) ? array.slice() : array.toString().split("")
            for (let i = copy.length-1; 0 <= i; i--) {
                let j = Math.floor(rand.max(i).next()), t = copy[i]
                copy[i] = copy[j] ; copy[j] = t
            }
            return Array.isArray(array) ? copy : copy.join("")
        }

    /**
     * <pre>
     * Return a sample from an array. Original array isn't modified.
     * Sampled array will always be the same for a particular <span class="bold">seed</span>.
     * </pre>
     * @param {Array|String} array - Array to sample
     * @param {Number} [length=array.length] - Sampled array length (if <span class="bold">replace</span> is <span class="bold">false</span>, sampled arrays will never be larger than original array length)
     * @param {Boolean} [replace=false] - If true, drawn values will be replaced in pool
     * @param {?(Number|String|false)} [seed=false] - Seed (set to <span class="bold">false</span> to reuse previous seeded generator)
     * @return {Array} Sampled array
     */
        static sample(array, length, replace = false, seed = false) {
            length = (typeof length === "number") ? replace ? length : Math.min(array.length, length) : array.length
            let rand = (seed === false) ? Utilities.sample.generator : Utilities.sample.generator.reset().seed(seed)
            let copy = Array.isArray(array) ? array.slice() : array.toString().split(""), sampled = []
            for (let i = 0; i < length; i++) {
                let j = Math.floor(rand.max(copy.length).next())
                if (!replace) { sampled.push(copy.splice(j, 1)[0]) } else { sampled.push(copy[j]) }
            }
            return sampled
        }

    /**
     * <pre>
     * Return a random element from an array.
     * Chosen element will always be the same for a particular <span class="bold">seed</span>.
     * </pre>
     * @param {Array|String} array - Array to sample
     * @param {?(Number|String|false)} [seed=false] - Seed (set to <span class="bold">false</span> to reuse previous seeded generator)
     * @return {Array} Chosen element
     */
        static choice(array, seed = false) {
            let rand = ((seed === false) ? Utilities.choice.generator : Utilities.choice.generator.reset().seed(seed)).max(array.length)
            return array[Math.floor(rand.next())]
        }
}
Utilities.init()


        global.Lowlight.Random = {Distribution, Utilities}

})(typeof window !== "undefined" ? window : this)
