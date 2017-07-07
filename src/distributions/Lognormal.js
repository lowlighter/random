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
