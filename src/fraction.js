/**
 * @file fraction.js
 * @description Exact rational arithmetic engine for Islamic inheritance calculations.
 * Implements irreducible fraction representation, basic arithmetic, and comparison operations.
 */

/**
 * Computes the Greatest Common Divisor (GCD) of two integers using Euclid's algorithm.
 * 
 * @param {number} a - First integer.
 * @param {number} b - Second integer.
 * @returns {number} The greatest common divisor of a and b.
 */
function gcd(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) {
        const t = b;
        b = a % b;
        a = t;
    }
    return a;
}

/**
 * Represents an immutable rational number (fraction) in reduced form.
 * 
 * @class Fraction
 * @property {number} n - The reduced numerator (can be positive, negative, or zero).
 * @property {number} d - The reduced denominator (always strictly positive).
 */
export default class Fraction {
    /**
     * Creates a new Fraction in canonical reduced form.
     * 
     * @param {number|Fraction|string} n - Numerator, existing Fraction, or numeric string.
     * @param {number} [d=1] - Denominator (cannot be zero).
     * @throws {Error} If denominator is 0.
     */
    constructor(n, d = 1) {
        if (n instanceof Fraction) {
            this.n = n.n;
            this.d = n.d;
            return;
        }

        if (typeof n === 'string' && n.includes('/')) {
            const parts = n.split('/');
            n = parseInt(parts[0], 10) || 0;
            d = parseInt(parts[1], 10) || 1;
        }

        if (d === 0) {
            throw new Error("Denominator cannot be zero");
        }

        const num = Math.round(Number(n));
        const den = Math.round(Number(d));
        const common = gcd(num, den) || 1;
        const sign = (num < 0 ? -1 : 1) * (den < 0 ? -1 : 1);

        this.n = sign * Math.abs(num / common);
        this.d = Math.abs(den / common);
    }

    /**
     * Adds another fraction or number to this fraction.
     * 
     * @param {Fraction|number} other - The operand to add.
     * @returns {Fraction} A new Fraction representing the sum: (this + other).
     */
    add(other) {
        const b = other instanceof Fraction ? other : new Fraction(other);
        return new Fraction(this.n * b.d + b.n * this.d, this.d * b.d);
    }

    /**
     * Subtracts another fraction or number from this fraction.
     * 
     * @param {Fraction|number} other - The operand to subtract.
     * @returns {Fraction} A new Fraction representing the difference: (this - other).
     */
    sub(other) {
        const b = other instanceof Fraction ? other : new Fraction(other);
        return new Fraction(this.n * b.d - b.n * this.d, this.d * b.d);
    }

    /**
     * Multiplies this fraction by another fraction or number.
     * 
     * @param {Fraction|number} other - The multiplier.
     * @returns {Fraction} A new Fraction representing the product: (this * other).
     */
    mul(other) {
        const b = other instanceof Fraction ? other : new Fraction(other);
        return new Fraction(this.n * b.n, this.d * b.d);
    }

    /**
     * Divides this fraction by another fraction or number.
     * 
     * @param {Fraction|number} other - The divisor (cannot be zero).
     * @returns {Fraction} A new Fraction representing the quotient: (this / other).
     * @throws {Error} If dividing by zero.
     */
    div(other) {
        const b = other instanceof Fraction ? other : new Fraction(other);
        if (b.n === 0) {
            throw new Error("Division by zero in Fraction");
        }
        return new Fraction(this.n * b.d, this.d * b.n);
    }

    /**
     * Converts the fraction to a floating-point number.
     * 
     * @returns {number} Decimal representation of the fraction.
     */
    valueOf() {
        return this.n / this.d;
    }

    /**
     * Returns a string representation of the fraction (e.g. "1/3" or "2").
     * 
     * @returns {string} The fraction formatted as a string.
     */
    toString() {
        if (this.d === 1) {
            return `${this.n}`;
        }
        return `${this.n}/${this.d}`;
    }

    /**
     * Checks if this fraction is strictly equal in value to another fraction or number.
     * 
     * @param {Fraction|number} other - The operand to compare against.
     * @returns {boolean} True if both fractions have identical reduced values.
     */
    equals(other) {
        const b = other instanceof Fraction ? other : new Fraction(other);
        return this.n === b.n && this.d === b.d;
    }

    /**
     * Checks if this fraction is strictly greater than another fraction or number.
     * 
     * @param {Fraction|number} other - The operand to compare against.
     * @returns {boolean} True if (this > other).
     */
    greaterThan(other) {
        const b = other instanceof Fraction ? other : new Fraction(other);
        return this.n * b.d > b.n * this.d;
    }

    /**
     * Checks if this fraction is strictly less than another fraction or number.
     * 
     * @param {Fraction|number} other - The operand to compare against.
     * @returns {boolean} True if (this < other).
     */
    lessThan(other) {
        const b = other instanceof Fraction ? other : new Fraction(other);
        return this.n * b.d < b.n * this.d;
    }
}
