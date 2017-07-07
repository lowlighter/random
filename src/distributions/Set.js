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
