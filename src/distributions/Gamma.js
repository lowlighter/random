class Gamma extends Distribution {
    /**
     * <pre>
     * Create a gamma distribution random number generator.
     * Conditions on the parameters are α > 0 and β > 0.
     * The probability distribution function is: pdf(x) = (x<sup>α- 1</sup> * e<sup>-x/β</sup>)/(gamma(α) * β<sup>α</sup>)
     * Mean is α*beta, variance is α*β**2.
     *
     * Uses R.C.H. Cheng, "The generation of Gamma variables with non-integral shape parameters", Applied Statistics, (1977), 26, No. 1, p71-74.
     * Uses ALGORITHM GS of Statistical Computing - Kennedy & Gentle.
     *
     * See [Gamma Distribution]{@link https://en.wikipedia.org/wiki/Gamma_distribution}.
     * </pre>
     * <div class="alert warning">
     * A few older sources define the gamma distribution in terms of α > -1.
     * </div>
     * <div style="text-align:center">
     *      <figure style="display:inline-block">
     *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/e/e6/Gamma_distribution_pdf.svg">
     *      <figcaption style="text-align:center">Probability density function</figcaption>
     *      </figure>
     *      <figure style="display:inline-block">
     *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/8/8d/Gamma_distribution_cdf.svg">
     *      <figcaption style="text-align:center">Cumulative distribution function</figcaption>
     *      </figure>
     * </div>
     * @param {Number} [alpha=5] - Shape parameter
     * @param {Number} [beta=1] - Rate parameter
     * @category distribution
     * @extends Distribution
     */
        constructor(alpha = 5, beta = 1) {
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
    * Update rate paramater value.
    * </pre>
    * @param {Number} [concentration] - Rate paramater (> 0)
    * @return {Number|Distribution} Return instance in setter mode and value in getter mode
     */
        beta(beta) { return arguments.length ? (this._beta = beta, this) : this._beta }

   /**
    * Create a gamma distribution random number generator.
    * <div class="alert warning">
    * This method requires <span class="bold">this</span> context to be a {@link Distribution} instance, and this cannot be called directly.
    * </div>
    * @private
    * @return {Generator} Gamma distribution number generator
    */
       static *generator() {
           let rand =  new Distribution.Random(this.seed())
           while (1) {
               let alpha = this.alpha(), beta = this.beta()
               if (alpha > 1) {
                   let ainv = Math.sqrt(2 * alpha - 1), bbb = alpha - Distribution.LOG4, ccc = alpha + ainv
                   while (1) {
                       let v = rand.next(), w = 1 - rand.next()
                       if (!((1e-7 < v)&&(v < .9999999))) { continue }
                       let u = Math.log(v/(1-v))/ainv, x = alpha * Math.exp(u), z = v*v*w, r = bbb + ccc*u - x
                       if ((r + Distribution.SG_MAGICCONST - 4.5*z >= 0)||(r >= Math.log(z))) { yield x * beta }
                   }
               } else if (alpha == 1) {
                   let v = rand.next()
                   while (v <= 1e-7) { v = rand.next() }
                   yield -Math.log(v) * beta
               } else {
                   let x
                   while (1) {
                       let v = rand.next(), w = rand.next()
                       let b = (Distribution.E + alpha) / Distribution.E, p = b * v
                       x = (p <= 1) ? Math.pow(p, 1/alpha) : - Math.log((b-p)/alpha)
                       if (p > 1) { if (w <= Math.pow(x, alpha-1)) { break } } else if (w <= Math.exp(-x)) { break }
                   }
                   yield x * beta
               }
           }
       }
}

//Registering
    Distribution.Gamma = Gamma
