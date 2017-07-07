class Beta extends Distribution {
    /**
     * <pre>
     * Create a beta distribution random number generator.
     * Conditions on the parameters are α > 0 and β > 0.
     *
     * This version due to Janne Sinkkonen, and matches all the std texts (e.g., Knuth Vol 2 Ed 3 pg 134 "the beta distribution").
     *
     * See [Beta Distribution]{@link https://en.wikipedia.org/wiki/Beta_distribution}.
     * </pre>
     * <div style="text-align:center">
     *      <figure style="display:inline-block">
     *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/f/f3/Beta_distribution_pdf.svg">
     *      <figcaption style="text-align:center">Probability density function</figcaption>
     *      </figure>
     *      <figure style="display:inline-block">
     *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/1/11/Beta_distribution_cdf.svg">
     *      <figcaption style="text-align:center">Cumulative distribution function</figcaption>
     *      </figure>
     * </div>
     * @param {Number} [alpha=2] - Shape parameter (α)
     * @param {Number} [beta=2] - Shape parameter (β)
     * @category distribution
     * @extends Distribution
     */
        constructor(alpha = 0.5, beta = 0.5) {
            super()
            this.alpha(alpha).beta(beta)
        }

    /**
     * Update shape paramater value.
     * @param {Number} [mean] - Shape paramater (> 0)
     * @return {Number|Distribution} Return instance in setter mode and value in getter mode
     */
        alpha(alpha) { return arguments.length ? (this._alpha = alpha, this) : this._alpha }

    /**
    * <pre>
    * Update shape paramater value.
    * </pre>
    * @param {Number} [concentration] - Shape paramater (> 0)
    * @return {Number|Distribution} Return instance in setter mode and value in getter mode
     */
        beta(beta) { return arguments.length ? (this._beta = beta, this) : this._beta }

   /**
    * Create a beta distribution random number generator.
    * <div class="alert warning">
    * This method requires <span class="bold">this</span> context to be a {@link Distribution} instance, and this cannot be called directly.
    * </div>
    * @private
    * @return {Generator} Beta distribution number generator
    */
       static *generator() {
           let rand = new Distribution.Gamma(1, 1).seed(this.seed())
           while (1) {
               let y = rand.alpha(this.alpha()).next(), z = rand.alpha(this.beta()).next()
               yield y / (y + z)
           }
       }
}

//Registering
    Distribution.Beta = Beta
