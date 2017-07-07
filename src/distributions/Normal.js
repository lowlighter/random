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
