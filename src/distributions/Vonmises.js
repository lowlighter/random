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
