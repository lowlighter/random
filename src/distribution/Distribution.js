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
