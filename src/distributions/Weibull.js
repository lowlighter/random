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
