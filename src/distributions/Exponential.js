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
