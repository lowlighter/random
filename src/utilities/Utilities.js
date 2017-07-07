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
