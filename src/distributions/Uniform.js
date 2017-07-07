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
