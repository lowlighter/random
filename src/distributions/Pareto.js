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
